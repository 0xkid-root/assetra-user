// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2_5.sol";

// Simplified ERC-3643 interface for compliance
interface IERC3643 {
    function verifyIdentity(address investor) external view returns (bool);
    function restrictTransfer(address from, address to, uint256 amount) external view returns (bool);
}

/// @title AssetraProperty - Manages tokenized properties and REITs
/// @notice Handles property tokenization, share management, dividends, metadata, and compliance with Chainlink VRF
contract AssetraProperty is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, VRFConsumerBaseV2Plus {
    using SafeMath for uint256;

    // Structs
    struct Property {
        string ipfsHash; // IPFS hash for MiMC-hashed metadata (deeds, valuations)
        bytes32 merkleRoot; // MiMC Merkle root for metadata integrity
        uint256 totalShares; // Total fractional shares
        uint256 valuation; // Property valuation in USDC (6 decimals)
        bool isREIT; // True if token represents a REIT
        address[] linkedProperties; // For REITs: linked PropertyToken addresses
        uint256 investorCount; // Number of unique investors
        bool active; // Property status
    }

    struct MetadataHistory {
        string ipfsHash; // Historical IPFS hash
        bytes32 merkleRoot; // Historical Merkle root
        uint256 timestamp; // Update timestamp
    }

    struct Dividend {
        uint256 totalAmount; // Total USDC distributed (6 decimals)
        uint256 amountPerShare; // USDC per share (6 decimals)
        uint256 timestamp; // Distribution timestamp
        mapping(address => bool) claimed; // Investor claim status
    }

    struct AllocationRequest {
        uint256 tokenId; // Token ID for allocation
        address[] investors; // List of investors
        uint256[] amounts; // Share amounts to allocate
    }

    // State Variables
    mapping(uint256 => Property) private properties; // Token ID => Property details
    mapping(uint256 => mapping(address => uint256)) private balances; // Token ID => Investor => Balance
    mapping(uint256 => uint256) private totalSupply; // Token ID => Total issued shares
    mapping(uint256 => address[]) private investors; // Token ID => List of investors
    mapping(uint256 => mapping(uint256 => Dividend)) private dividends; // Token ID => Dividend ID => Dividend
    mapping(uint256 => uint256) private dividendCount; // Token ID => Number of dividends
    mapping(uint256 => MetadataHistory[]) private metadataHistory; // Token ID => Metadata update history
    mapping(address => bool) private kycVerified; // Investor KYC status
    mapping(uint256 => AllocationRequest) private vrfRequests; // VRF request ID => Allocation request
    address public complianceManager; // ComplianceManager contract
    address public usdc; // USDC token
    address public dao; // PropertyManagementDAO
    uint256 public nextTokenId; // Incremental token ID
    uint256 public constant MINIMUM_INVESTMENT = 50 * 10**6; // $50 in USDC (6 decimals)
    uint256 public constant MAX_SHARE_ALLOCATION = 10_000; // Max investors per allocation
    uint256 public constant MAX_LINKED_PROPERTIES = 50; // Max linked properties for REITs
    uint256 public constant MAX_INVESTORS_PER_TOKEN = 1_000; // Max investors per token
    uint256 public constant MINIMUM_SHARES = 1; // Minimum shares per transaction
    uint256 public constant MAX_REDEMPTION_AMOUNT = 100_000; // Max shares for redemption
    bytes32 private constant NULL_BYTES32 = bytes32(0); // Null bytes32 constant
    uint256 private constant VRF_GAS_LIMIT = 200_000; // Gas limit for VRF callback
    uint16 private constant VRF_REQUEST_CONFIRMATIONS = 3; // VRF confirmation blocks
    uint32 private constant VRF_NUM_WORDS = 1; // Number of random words

    // Chainlink VRF Variables
    IVRFCoordinatorV2_0 public vrfCoordinator; // VRF Coordinator contract
    uint256 public vrfSubscriptionId; // Chainlink VRF subscription ID
    bytes32 public vrfKeyHash; // VRF key hash for gas lane

    // Events
    event PropertyTokenCreated(uint256 indexed tokenId, string ipfsHash, bytes32 merkleRoot, uint256 totalShares);
    event SharesMinted(uint256 indexed tokenId, address indexed investor, uint256 amount);
    event SharesTransferred(uint256 indexed tokenId, address indexed from, address indexed to, uint256 amount);
    event SharesRedeemed(uint256 indexed tokenId, address indexed investor, uint256 amount);
    event MetadataUpdated(uint256 indexed tokenId, string newIpfsHash, bytes32 newMerkleRoot);
    event DividendDistributed(uint256 indexed tokenId, uint256 indexed dividendId, uint256 totalAmount, uint256 timestamp);
    event DividendClaimed(uint256 indexed tokenId, uint256 indexed dividendId, address indexed investor, uint256 amount);
    event SharesAllocated(uint256 indexed tokenId, address[] investors, uint256[] amounts);
    event KYCStatusUpdated(address indexed investor, bool verified);
    event PropertyDeactivated(uint256 indexed tokenId);
    event VRFRequestInitiated(uint256 indexed requestId, uint256 indexed tokenId);

    // Errors
    error InvalidTokenId();
    error InvalidAmount();
    error NotKYCVerified();
    error TransferRestricted();
    error InsufficientBalance();
    error InvalidShares();
    error ValuationTooLow();
    error ArrayLengthMismatch();
    error InvalidVRFRequest();
    error OnlyVRFCoordinator();
    error OnlyDAO();
    error InvalidAddress();
    error REITRequiresProperties();
    error ExceedsMaxProperties();
    error ExceedsMaxInvestors();
    error InsufficientUSDC();
    error AmountTooSmall();
    error InvalidMetadata();
    error PropertyNotActive();
    error DividendAlreadyClaimed();
    error ExceedsRedemptionLimit();
    error InvestorAlreadyExists();
    error VRFNotConfigured();

    /// @notice Initializes the contract with external contract addresses and Chainlink VRF configuration
    /// @param _complianceManager Address of the ComplianceManager contract
    /// @param _vrfCoordinator Address of the Chainlink VRF coordinator
    /// @param _usdc Address of the USDC token contract
    /// @param _dao Address of the PropertyManagementDAO contract
    /// @param _vrfSubscriptionId Chainlink VRF subscription ID
    /// @param _vrfKeyHash Chainlink VRF key hash for gas lane
    function initialize(
        address _complianceManager,
        address _vrfCoordinator,
        address _usdc,
        address _dao,
        uint256 _vrfSubscriptionId,
        bytes32 _vrfKeyHash
    ) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();
        __VRFConsumerBaseV2Plus_init(_vrfCoordinator);

        if (_complianceManager == address(0)) revert InvalidAddress();
        if (_vrfCoordinator == address(0)) revert InvalidAddress();
        if (_usdc == address(0)) revert InvalidAddress();
        if (_dao == address(0)) revert InvalidAddress();
        if (_vrfSubscriptionId == 0) revert VRFNotConfigured();
        if (_vrfKeyHash == NULL_BYTES32) revert VRFNotConfigured();

        complianceManager = _complianceManager;
        vrfCoordinator = IVRFCoordinatorV2_0(_vrfCoordinator);
        usdc = _usdc;
        dao = _dao;
        vrfSubscriptionId = _vrfSubscriptionId;
        vrfKeyHash = _vrfKeyHash;
        nextTokenId = 1;
    }

    /// @notice Tokenizes a new property or REIT
    /// @param ipfsHash IPFS hash for MiMC-hashed metadata
    /// @param merkleRoot MiMC Merkle root for metadata integrity
    /// @param totalShares Total number of fractional shares
    /// @param valuation Property valuation in USDC (6 decimals)
    /// @param isREIT True if the token represents a REIT
    /// @param linkedProperties List of linked property token addresses for REITs
    function tokenizeProperty(
        string memory ipfsHash,
        bytes32 merkleRoot,
        uint256 totalShares,
        uint256 valuation,
        bool isREIT,
        address[] memory linkedProperties
    ) external onlyOwner whenNotPaused nonReentrant {
        if (totalShares < MINIMUM_SHARES) revert InvalidShares();
        if (valuation < MINIMUM_INVESTMENT) revert ValuationTooLow();
        if (isREIT && linkedProperties.length == 0) revert REITRequiresProperties();
        if (linkedProperties.length > MAX_LINKED_PROPERTIES) revert ExceedsMaxProperties();
        if (bytes(ipfsHash).length == 0 || merkleRoot == NULL_BYTES32) revert InvalidMetadata();

        // Validate linked properties for REITs
        if (isREIT) {
            for (uint256 i = 0; i < linkedProperties.length; i++) {
                if (linkedProperties[i] == address(0)) revert InvalidAddress();
            }
        }

        uint256 tokenId = nextTokenId;
        properties[tokenId] = Property({
            ipfsHash: ipfsHash,
            merkleRoot: merkleRoot,
            totalShares: totalShares,
            valuation: valuation,
            isREIT: isREIT,
            linkedProperties: linkedProperties,
            investorCount: 0,
            active: true
        });
        totalSupply[tokenId] = totalShares;

        metadataHistory[tokenId].push(MetadataHistory({
            ipfsHash: ipfsHash,
            merkleRoot: merkleRoot,
            timestamp: block.timestamp
        }));

        emit PropertyTokenCreated(tokenId, ipfsHash, merkleRoot, totalShares);
        nextTokenId = nextTokenId.add(1);
    }

    /// @notice Mints shares to an investor for a specific token
    /// @param tokenId ID of the property or REIT token
    /// @param investor Address of the investor
    /// @param amount Number of shares to mint
    function mintShares(uint256 tokenId, address investor, uint256 amount) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        if (!properties[tokenId].active) revert PropertyNotActive();
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (amount < MINIMUM_SHARES || amount > totalSupply[tokenId]) revert InvalidAmount();
        if (investor == address(0)) revert InvalidAddress();
        if (!IERC3643(complianceManager).verifyIdentity(investor)) revert NotKYCVerified();
        if (balances[tokenId][investor].add(amount) > totalSupply[tokenId]) revert InvalidAmount();

        // Update investor count if new investor
        if (balances[tokenId][investor] == 0) {
            if (properties[tokenId].investorCount >= MAX_INVESTORS_PER_TOKEN) revert ExceedsMaxInvestors();
            bool exists = false;
            for (uint256 i = 0; i < investors[tokenId].length; i++) {
                if (investors[tokenId][i] == investor) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                investors[tokenId].push(investor);
                properties[tokenId].investorCount = properties[tokenId].investorCount.add(1);
            }
        }

        balances[tokenId][investor] = balances[tokenId][investor].add(amount);
        emit SharesMinted(tokenId, investor, amount);
    }

    /// @notice Allocates shares to multiple investors using Chainlink VRF
    /// @param tokenId ID of the property or REIT token
    /// @param investors Array of investor addresses
    /// @param amounts Array of share amounts to allocate
    function allocateShares(
        uint256 tokenId,
        address[] memory investors,
        uint256[] memory amounts
    ) external onlyOwner whenNotPaused nonReentrant returns (uint256 requestId) {
        if (!properties[tokenId].active) revert PropertyNotActive();
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (investors.length != amounts.length) revert ArrayLengthMismatch();
        if (investors.length > MAX_SHARE_ALLOCATION) revert InvalidAmount();

        uint256 totalAllocated = 0;
        for (uint256 i = 0; i < investors.length; i++) {
            if (investors[i] == address(0)) revert InvalidAddress();
            if (!IERC3643(complianceManager).verifyIdentity(investors[i])) revert NotKYCVerified();
            if (amounts[i] < MINIMUM_SHARES) revert InvalidAmount();
            totalAllocated = totalAllocated.add(amounts[i]);
        }
        if (totalAllocated > totalSupply[tokenId]) revert InvalidAmount();

        // Store allocation request
        vrfRequests[requestId] = AllocationRequest({
            tokenId: tokenId,
            investors: investors,
            amounts: amounts
        });

        // Request randomness from Chainlink VRF
        requestId = vrfCoordinator.requestRandomWords(
            VRF_GAS_LIMIT,
            VRF_REQUEST_CONFIRMATIONS,
            VRF_NUM_WORDS,
            vrfSubscriptionId,
            vrfKeyHash
        );

        emit VRFRequestInitiated(requestId, tokenId);
    }

    /// @notice Chainlink VRF callback to finalize share allocation
    /// @param requestId VRF request ID
    /// @param randomWords Array of random numbers
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        AllocationRequest memory request = vrfRequests[requestId];
        if (request.tokenId == 0) revert InvalidVRFRequest();
        if (!properties[request.tokenId].active) revert PropertyNotActive();

        // Simplified: Use randomness to shuffle allocations
        // In production, implement secure Fisher-Yates shuffle
        for (uint256 i = 0; i < request.investors.length; i++) {
            if (balances[request.tokenId][request.investors[i]] == 0) {
                if (properties[request.tokenId].investorCount >= MAX_INVESTORS_PER_TOKEN) revert ExceedsMaxInvestors();
                investors[request.tokenId].push(request.investors[i]);
                properties[request.tokenId].investorCount = properties[request.tokenId].investorCount.add(1);
            }
            balances[request.tokenId][request.investors[i]] = balances[request.tokenId][request.investors[i]].add(request.amounts[i]);
        }

        emit SharesAllocated(request.tokenId, request.investors, request.amounts);
        delete vrfRequests[requestId];
    }

    /// @notice Transfers shares to another address with compliance checks
    /// @param tokenId ID of the property or REIT token
    /// @param to Recipient address
    /// @param amount Number of shares to transfer
    function transferShares(uint256 tokenId, address to, uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (!properties[tokenId].active) revert PropertyNotActive();
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (to == address(0)) revert InvalidAddress();
        if (amount < MINIMUM_SHARES) revert InvalidAmount();
        if (balances[tokenId][msg.sender] < amount) revert InsufficientBalance();
        if (!IERC3643(complianceManager).restrictTransfer(msg.sender, to, amount)) revert TransferRestricted();
        if (!IERC3643(complianceManager).verifyIdentity(to)) revert NotKYCVerified();

        // Update investor count if new investor
        if (balances[tokenId][to] == 0) {
            if (properties[tokenId].investorCount >= MAX_INVESTORS_PER_TOKEN) revert ExceedsMaxInvestors();
            bool exists = false;
            for (uint256 i = 0; i < investors[tokenId].length; i++) {
                if (investors[tokenId][i] == to) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                investors[tokenId].push(to);
                properties[tokenId].investorCount = properties[tokenId].investorCount.add(1);
            }
        }

        balances[tokenId][msg.sender] = balances[tokenId][msg.sender].sub(amount);
        balances[tokenId][to] = balances[tokenId][to].add(amount);
        emit SharesTransferred(tokenId, msg.sender, to, amount);
    }

    /// @notice Distributes USDC dividends to shareholders
    /// @param tokenId ID of the property or REIT token
    /// @param totalAmount Total USDC to distribute (6 decimals)
    function distributeDividends(uint256 tokenId, uint256 totalAmount) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        if (!properties[tokenId].active) revert PropertyNotActive();
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (totalAmount == 0) revert InvalidAmount();
        if (IERC20(usdc).balanceOf(address(this)) < totalAmount) revert InsufficientUSDC();

        uint256 amountPerShare = totalAmount.div(totalSupply[tokenId]);
        if (amountPerShare == 0) revert AmountTooSmall();

        uint256 dividendId = dividendCount[tokenId];
        dividends[tokenId][dividendId] = Dividend({
            totalAmount: totalAmount,
            amountPerShare: amountPerShare,
            timestamp: block.timestamp
        });
        dividendCount[tokenId] = dividendId.add(1);

        emit DividendDistributed(tokenId, dividendId, totalAmount, block.timestamp);
    }

    /// @notice Allows investors to claim their dividends
    /// @param tokenId ID of the property or REIT token
    /// @param dividendId ID of the dividend to claim
    function claimDividend(uint256 tokenId, uint256 dividendId) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (!properties[tokenId].active) revert PropertyNotActive();
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (dividendId >= dividendCount[tokenId]) revert InvalidTokenId();
        if (dividends[tokenId][dividendId].claimed[msg.sender]) revert DividendAlreadyClaimed();

        uint256 shareBalance = balances[tokenId][msg.sender];
        if (shareBalance == 0) revert InsufficientBalance();

        uint256 amount = shareBalance.mul(dividends[tokenId][dividendId].amountPerShare);
        dividends[tokenId][dividendId].claimed[msg.sender] = true;

        if (!IERC20(usdc).transfer(msg.sender, amount)) revert InsufficientUSDC();
        emit DividendClaimed(tokenId, dividendId, msg.sender, amount);
    }

    /// @notice Redeems shares for USDC (e.g., upon property sale)
    /// @param tokenId ID of the property or REIT token
    /// @param amount Number of shares to redeem
    function redeemShares(uint256 tokenId, uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (!properties[tokenId].active) revert PropertyNotActive();
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (amount < MINIMUM_SHARES || amount > MAX_REDEMPTION_AMOUNT) revert InvalidAmount();
        if (balances[tokenId][msg.sender] < amount) revert InsufficientBalance();

        // In production, calculate redemption value based on latest valuation
        uint256 redemptionValue = amount.mul(properties[tokenId].valuation).div(totalSupply[tokenId]);
        if (IERC20(usdc).balanceOf(address(this)) < redemptionValue) revert InsufficientUSDC();

        balances[tokenId][msg.sender] = balances[tokenId][msg.sender].sub(amount);
        totalSupply[tokenId] = totalSupply[tokenId].sub(amount);

        // Update investor count if investor's balance becomes zero
        if (balances[tokenId][msg.sender] == 0) {
            properties[tokenId].investorCount = properties[tokenId].investorCount.sub(1);
            // Remove investor from list (gas-intensive, optimize in production)
        }

        if (!IERC20(usdc).transfer(msg.sender, redemptionValue)) revert InsufficientUSDC();
        emit SharesRedeemed(tokenId, msg.sender, amount);
    }

    /// @notice Updates metadata for a property or REIT
    /// @param tokenId ID of the property or REIT token
    /// @param newIpfsHash New IPFS hash for metadata
    /// @param newMerkleRoot New MiMC Merkle root
    function updateMetadata(uint256 tokenId, string memory newIpfsHash, bytes32 newMerkleRoot) 
        external 
        onlyDAO 
        whenNotPaused 
        nonReentrant 
    {
        if (!properties[tokenId].active) revert PropertyNotActive();
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (bytes(newIpfsHash).length == 0 || newMerkleRoot == NULL_BYTES32) revert InvalidMetadata();

        properties[tokenId].ipfsHash = newIpfsHash;
        properties[tokenId].merkleRoot = newMerkleRoot;

        metadataHistory[tokenId].push(MetadataHistory({
            ipfsHash: newIpfsHash,
            merkleRoot: newMerkleRoot,
            timestamp: block.timestamp
        }));

        emit MetadataUpdated(tokenId, newIpfsHash, newMerkleRoot);
    }

    /// @notice Updates investor KYC status
    /// @param investor Address of the investor
    /// @param verified New KYC status
    function updateKYCStatus(address investor, bool verified) external onlyOwner {
        if (investor == address(0)) revert InvalidAddress();
        kycVerified[investor] = verified;
        emit KYCStatusUpdated(investor, verified);
    }

    /// @notice Deactivates a property (e.g., after sale or liquidation)
    /// @param tokenId ID of the property or REIT token
    function deactivateProperty(uint256 tokenId) external onlyDAO whenNotPaused nonReentrant {
        if (properties[tokenId].totalShares == 0) revert InvalidTokenId();
        if (!properties[tokenId].active) revert PropertyNotActive();

        properties[tokenId].active = false;
        emit PropertyDeactivated(tokenId);
    }

    /// @notice Pauses the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Retrieves property details
    /// @param tokenId ID of the property or REIT token
    /// @return ipfsHash IPFS hash for metadata
    /// @return merkleRoot MiMC Merkle root
    /// @return totalShares Total fractional shares
    /// @return valuation Property valuation in USDC
    /// @return isREIT True if REIT
    /// @return linkedProperties Linked property addresses
    /// @return investorCount Number of investors
    /// @return active Property status
    function getPropertyDetails(uint256 tokenId)
        external
        view
        returns (
            string memory ipfsHash,
            bytes32 merkleRoot,
            uint256 totalShares,
            uint256 valuation,
            bool isREIT,
            address[] memory linkedProperties,
            uint256 investorCount,
            bool active
        )
    {
        Property memory prop = properties[tokenId];
        return (
            prop.ipfsHash,
            prop.merkleRoot,
            prop.totalShares,
            prop.valuation,
            prop.isREIT,
            prop.linkedProperties,
            prop.investorCount,
            prop.active
        );
    }

    /// @notice Retrieves investor balance for a token
    /// @param tokenId ID of the property or REIT token
    /// @param investor Address of the investor
    /// @return balance Number of shares owned
    function balanceOf(uint256 tokenId, address investor) external view returns (uint256 balance) {
        if (investor == address(0)) revert InvalidAddress();
        return balances[tokenId][investor];
    }

    /// @notice Retrieves metadata history for a token
    /// @param tokenId ID of the property or REIT token
    /// @return history Array of metadata updates
    function getMetadataHistory(uint256 tokenId) external view returns (MetadataHistory[] memory history) {
        return metadataHistory[tokenId];
    }

    /// @notice Retrieves dividend details
    /// @param tokenId ID of the property or REIT token
    /// @param dividendId ID of the dividend
    /// @return totalAmount Total USDC distributed
    /// @return amountPerShare USDC per share
    /// @return timestamp Distribution timestamp
    function getDividendDetails(uint256 tokenId, uint256 dividendId)
        external
        view
        returns (uint256 totalAmount, uint256 amountPerShare, uint256 timestamp)
    {
        if (dividendId >= dividendCount[tokenId]) revert InvalidTokenId();
        Dividend storage dividend = dividends[tokenId][dividendId];
        return (dividend.totalAmount, dividend.amountPerShare, dividend.timestamp);
    }

    /// @notice Modifier to restrict access to the DAO
    modifier onlyDAO() {
        if (msg.sender != dao) revert OnlyDAO();
        _;
    }
}
