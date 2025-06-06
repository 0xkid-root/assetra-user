// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Simplified interfaces for external contracts
interface IAssetraProperty {
    function getPropertyDetails(uint256 tokenId)
        external
        view
        returns (
            string memory ipfsHash,
            bytes32 merkleRoot,
            uint256 totalShares,
            uint256 valuation,
            bool isREIT,
            address[] memory linkedProperties
        );
    function balanceOf(uint256 tokenId, address investor) external view returns (uint256);
    function mintShares(uint256 tokenId, address investor, uint256 amount) external;
}

interface IERC3643 {
    function verifyIdentity(address investor) external view returns (bool);
    function restrictTransfer(address from, address to, uint256 amount) external view returns (bool);
}

interface IAssetraVRF {
    function requestRandomness(bytes32 requestId) external;
    function fulfillRandomness(bytes32 requestId, uint256 randomness) external;
}

interface IAssetraCCIP {
    function propagateMetadata(uint256 tokenId, bytes32 merkleRoot, bytes32 chainId) external;
}

/// @title AssetraFactory - A factory for creating and managing tokenized real estate investment trusts (REITs)
/// @notice This contract manages REIT creation, share allocation, dividends, and metadata updates with compliance
contract AssetraFactory is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct REIT {
        uint256 reitId; // Unique REIT token ID
        string ipfsHash; // IPFS hash for MiMC-hashed REIT metadata
        bytes32 merkleRoot; // MiMC Merkle root for metadata integrity
        address[] propertyTokens; // Linked PropertyToken contracts
        uint256[] propertyWeights; // Weight of each property in REIT (percentage)
        uint256 totalShares; // Total fractional shares
        uint256 valuation; // Aggregated valuation in USDC (6 decimals)
        bool active; // REIT status
    }

    // State Variables
    mapping(uint256 => REIT) private reits; // REIT ID to details
    mapping(uint256 => mapping(address => uint256)) private balances; // REIT ID to investor balances
    mapping(uint256 => uint256) private totalSupply; // REIT ID to total issued shares
    mapping(address => bool) private kycVerified; // Investor KYC status
    mapping(bytes32 => uint256) private vrfRequests; // VRF request ID to REIT ID
    address public propertyToken; // PropertyToken contract
    address public complianceManager; // ComplianceManager contract
    address public vrfCoordinator; // Chainlink VRF coordinator
    address public ccipRouter; // Chainlink CCIP router
    address public usdc; // USDC token for dividends
    address public dao; // PropertyManagementDAO contract
    uint256 public nextReitId; // Incremental REIT ID
    uint256 public constant MINIMUM_INVESTMENT = 50 * 10**6; // $50 in USDC (6 decimals)
    uint256 public constant MAX_PROPERTIES = 50; // Max properties per REIT
    uint256 public constant MAX_SHARE_ALLOCATION = 10_000; // Max shares per allocation for gas safety
    bytes32 private constant NULL_BYTES32 = bytes32(0); // Constant for null bytes32

    // Events
    event REITCreated(uint256 indexed reitId, string ipfsHash, bytes32 merkleRoot, uint256 totalShares);
    event SharesMinted(uint256 indexed reitId, address indexed investor, uint256 amount);
    event SharesAllocated(uint256 indexed reitId, address[] investors, uint256[] amounts);
    event DividendsDistributed(uint256 indexed reitId, uint256 totalAmount, uint256 timestamp);
    event REITMetadataUpdated(uint256 indexed reitId, string newIpfsHash, bytes32 newMerkleRoot);
    event KYCStatusUpdated(address indexed investor, bool verified);
    event REITDeactivated(uint256 indexed reitId);

    // Errors
    error InvalidArrayLength();
    error ExceedsMaxProperties();
    error InvalidShares();
    error InvalidValuation();
    error WeightsNotSumTo100();
    error REITNotActive();
    error InvestorNotKYCVerified();
    error InsufficientBalance();
    error TransferRestricted();
    error InvalidVRFRequest();
    error InvalidAmount();
    error InsufficientUSDC();
    error AmountTooSmall();
    error OnlyVRFCoordinator();
    error OnlyDAO();

    /// @notice Initializes the contract with external contract addresses
    /// @param _propertyToken Address of the PropertyToken contract
    /// @param _complianceManager Address of the ComplianceManager contract
    /// @param _vrfCoordinator Address of the Chainlink VRF coordinator
    /// @param _ccipRouter Address of the Chainlink CCIP router
    /// @param _usdc Address of the USDC token contract
    /// @param _dao Address of the PropertyManagementDAO contract
    function initialize(
        address _propertyToken,
        address _complianceManager,
        address _vrfCoordinator,
        address _ccipRouter,
        address _usdc,
        address _dao
    ) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();
        
        require(_propertyToken != address(0), "Invalid PropertyToken address");
        require(_complianceManager != address(0), "Invalid ComplianceManager address");
        require(_vrfCoordinator != address(0), "Invalid VRFCoordinator address");
        require(_ccipRouter != address(0), "Invalid CCIPRouter address");
        require(_usdc != address(0), "Invalid USDC address");
        require(_dao != address(0), "Invalid DAO address");

        propertyToken = _propertyToken;
        complianceManager = _complianceManager;
        vrfCoordinator = _vrfCoordinator;
        ccipRouter = _ccipRouter;
        usdc = _usdc;
        dao = _dao;
        nextReitId = 1;
    }

    /// @notice Creates a new REIT with specified properties
    /// @param _propertyTokens Array of property token addresses
    /// @param _propertyWeights Array of weights for each property
    /// @param ipfsHash IPFS hash for REIT metadata
    /// @param merkleRoot MiMC Merkle root for metadata integrity
    /// @param totalShares Total number of shares for the REIT
    function createREIT(
        address[] memory _propertyTokens,
        uint256[] memory _propertyWeights,
        string memory ipfsHash,
        bytes32 merkleRoot,
        uint256 totalShares
    ) external onlyOwner whenNotPaused nonReentrant {
        if (_propertyTokens.length != _propertyWeights.length) revert InvalidArrayLength();
        if (_propertyTokens.length > MAX_PROPERTIES) revert ExceedsMaxProperties();
        if (totalShares == 0) revert InvalidShares();
        if (bytes(ipfsHash).length == 0 || merkleRoot == NULL_BYTES32) revert InvalidAmount();

        // Validate properties and calculate valuation
        uint256 totalValuation = 0;
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < _propertyTokens.length; i++) {
            (, , , uint256 valuation, bool isREIT, ) = IPropertyToken(propertyToken).getPropertyDetails(i + 1);
            require(!isREIT, "Cannot include REIT in REIT");
            totalValuation = totalValuation.add(valuation.mul(_propertyWeights[i]).div(100));
            totalWeight = totalWeight.add(_propertyWeights[i]);
        }
        if (totalWeight != 100) revert WeightsNotSumTo100();
        if (totalValuation < MINIMUM_INVESTMENT) revert InvalidValuation();

        uint256 reitId = nextReitId;
        reits[reitId] = REIT({
            reitId: reitId,
            ipfsHash: ipfsHash,
            merkleRoot: merkleRoot,
            propertyTokens: _propertyTokens,
            propertyWeights: _propertyWeights,
            totalShares: totalShares,
            valuation: totalValuation,
            active: true
        });
        totalSupply[reitId] = totalShares;

        emit REITCreated(reitId, ipfsHash, merkleRoot, totalShares);
        nextReitId = nextReitId.add(1);
    }

    /// @notice Mints REIT shares to a single investor
    /// @param reitId The ID of the RIET
    /// @param investor Address of the investor
    /// @param amount Number of shares to mint
    function mintShares(uint256 reitId, address investor, uint256 amount) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        if (!reits[reitId].active) revert REITNotActive();
        if (amount == 0 || amount > totalSupply[reitId]) revert InvalidAmount();
        if (!IERC3643(complianceManager).verifyIdentity(investor)) revert InvestorNotKYCVerified();
        if (balances[reitId][investor].add(amount) > totalSupply[reitId]) revert InvalidAmount();

        balances[reitId][investor] = balances[reitId][investor].add(amount);
        emit SharesMinted(reitId, investor, amount);
    }

    /// @notice Allocates REIT shares to multiple investors using Chainlink VRF
    /// @param reitId The ID of the REIT
    /// @param investors Array of investor addresses
    /// @param amounts Array of share amounts to allocate
    /// @param vrfRequestId VRF request ID for randomness
    function allocateShares(
        uint256 reitId,
        address[] memory investors,
        uint256[] memory amounts,
        bytes32 vrfRequestId
    ) external onlyOwner whenNotPaused nonReentrant {
        if (!reits[reitId].active) revert REITNotActive();
        if (investors.length != amounts.length) revert InvalidArrayLength();
        if (investors.length > MAX_SHARE_ALLOCATION) revert InvalidAmount();
        if (vrfRequestId == NULL_BYTES32) revert InvalidVRFRequest();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < investors.length; i++) {
            if (!IERC3643(complianceManager).verifyIdentity(investors[i])) revert InvestorNotKYCVerified();
            totalAmount = totalAmount.add(amounts[i]);
        }
        if (totalAmount > totalSupply[reitId]) revert InvalidAmount();

        vrfRequests[vrfRequestId] = reitId;
        IVRFCoordinator(vrfCoordinator).requestRandomness(vrfRequestId);
    }

    /// @notice Callback function for Chainlink VRF to fulfill randomness
    /// @param requestId The VRF request ID
    /// @param randomness The random number provided by Chainlink VRF
    function fulfillRandomness(bytes32 requestId, uint256 randomness) external {
        if (msg.sender != vrfCoordinator) revert OnlyVRFCoordinator();
        uint256 reitId = vrfRequests[requestId];
        if (reitId == 0) revert InvalidVRFRequest();

        // In production, implement secure allocation algorithm using randomness
        // Simplified for now: emit event
        emit SharesAllocated(reitId, new address[](0), new uint256[](0));
        delete vrfRequests[requestId];
    }

    /// @notice Transfers REIT shares to another address with compliance checks
    /// @param reitId The ID of the REIT
    /// @param to Recipient address
    /// @param amount Number of shares to transfer
    function transferShares(uint256 reitId, address to, uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (!reits[reitId].active) revert REITNotActive();
        if (balances[reitId][msg.sender] < amount) revert InsufficientBalance();
        if (!IERC3643(complianceManager).restrictTransfer(msg.sender, to, amount)) revert TransferRestricted();
        if (!IERC3643(complianceManager).verifyIdentity(to)) revert InvestorNotKYCVerified();

        balances[reitId][msg.sender] = balances[reitId][msg.sender].sub(amount);
        balances[reitId][to] = balances[reitId][to].add(amount);
    }

    /// @notice Distributes USDC dividends to REIT shareholders
    /// @param reitId The ID of the REIT
    /// @param totalAmount Total USDC amount to distribute (6 decimals)
    function distributeDividends(uint256 reitId, uint256 totalAmount) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        if (!reits[reitId].active) revert REITNotActive();
        if (totalAmount == 0) revert InvalidAmount();
        if (IERC20(usdc).balanceOf(address(this)) < totalAmount) revert InsufficientUSDC();

        uint256 amountPerShare = totalAmount.div(totalSupply[reitId]);
        if (amountPerShare == 0) revert AmountTooSmall();

        // In production, implement pull-based claiming for gas efficiency
        emit DividendsDistributed(reitId, totalAmount, block.timestamp);
    }

    /// @notice Updates REIT metadata and propagates cross-chain
    /// @param reitId The ID of the REIT
    /// @param newIpfsHash New IPFS hash for metadata
    /// @param newMerkleRoot New MiMC Merkle root
    function updateMetadata(uint256 reitId, string memory newIpfsHash, bytes32 newMerkleRoot)
        external
        whenNotPaused
    {
        if (msg.sender != dao) revert OnlyDAO();
        if (!reits[reitId].active) revert REITNotActive();
        if (bytes(newIpfsHash).length == 0 || newMerkleRoot == NULL_BYTES32) revert InvalidAmount();

        reits[reitId].ipfsHash = newIpfsHash;
        reits[reitId].merkleRoot = newMerkleRoot;

        ICCIP(ccipRouter).propagateMetadata(reitId, newMerkleRoot, NULL_BYTES32); // Chain ID placeholder

        emit REITMetadataUpdated(reitId, newIpfsHash, newMerkleRoot);
    }

    /// @notice Updates KYC status for an investor
    /// @param investor Address of the investor
    /// @param verified New KYC verification status
    function updateKYCStatus(address investor, bool verified) external onlyOwner {
        require(investor != address(0), "Invalid investor address");
        kycVerified[investor] = verified;
        emit KYCStatusUpdated(investor, verified);
    }

    /// @notice Deactivates a REIT
    /// @param reitId The ID of the REIT
    function deactivateREIT(uint256 reitId) external onlyOwner whenNotPaused {
        if (!reits[reitId].active) revert REITNotActive();
        reits[reitId].active = false;
        emit REITDeactivated(reitId);
    }

    /// @notice Pauses the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Retrieves details of a REIT
    /// @param reitId The ID of the REIT
    /// @return ipfsHash The IPFS hash of the REIT metadata
    /// @return merkleRoot The MiMC Merkle root for metadata integrity
    /// @return propertyTokens Array of linked property token addresses
    /// @return propertyWeights Array of weights for each property
    /// @return totalShares Total number of shares in the REIT
    /// @return valuation Aggregated valuation in USDC
    /// @return active Status of the REIT
    function getREITDetails(uint256 reitId)
        external
        view
        returns (
            string memory ipfsHash,
            bytes32 merkleRoot,
            address[] memory propertyTokens,
            uint256[] memory propertyWeights,
            uint256 totalShares,
            uint256 valuation,
            bool active
        )
    {
        REIT memory reit = reits[reitId];
        return (
            reit.ipfsHash,
            reit.merkleRoot,
            reit.propertyTokens,
            reit.propertyWeights,
            reit.totalShares,
            reit.valuation,
            reit.active
        );
    }

    /// @notice Retrieves an investor's balance for a REIT
    /// @param reitId The ID of the REIT
    /// @param investor Address of the investor
    /// @return Balance of the investor in the REIT
    function balanceOf(uint256 reitId, address investor) external view returns (uint256) {
        return balances[reitId][investor];
    }
}
