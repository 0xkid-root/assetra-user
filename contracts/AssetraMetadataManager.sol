// SPDX-License-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IAssetraProperty {
    function updateMetadata(uint256 tokenId, string memory newIpfsHash, bytes32 newMerkleRoot) external;
    function isValidToken(uint256 tokenId) external view returns (bool);
}

interface IAssetraFactory {
    function updateMetadata(uint256 reitId, string memory newIpfsHash, bytes32 newMerkleRoot) external;
    function isValidReit(uint256 reitId) external view returns (bool);
}

interface IERC3643 {
    function verifyIdentity(address account) external view returns (bool);
    function isMetadataUpdateAllowed(address caller, address tokenContract, uint256 tokenId) external view returns (bool);
}

interface IAssetraCCIP {
    function propagateMetadata(uint256 tokenId, bytes32 merkleRoot, bytes32 chainId) external returns (bytes32 messageId);
}

contract AssetMetadataManager is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // State Variables
    address public propertyToken; // PropertyToken contract
    address public reitFactory; // ReitFactory contract
    address public complianceManager; // ComplianceManager contract
    address public ccipRouter; // Chainlink CCIP router
    address public dao; // PropertyManagementDAO
    mapping(uint256 => bool) private updatedTokens; // Track updated token IDs
    mapping(address => bool) private validTokenContracts; // Valid token contracts
    mapping(bytes32 => bool) private supportedChains; // Supported destination chain IDs
    uint256 public constant MAX_IPFS_HASH_LENGTH = 128; // Maximum IPFS hash length

    // Events
    event MetadataUpdated(
        address indexed tokenContract,
        uint256 indexed tokenId,
        string newIpfsHash,
        bytes32 newMerkleRoot,
        uint256 timestamp
    );
    event CrossChainMetadataPropagated(
        bytes32 indexed messageId,
        uint256 indexed tokenId,
        bytes32 chainId,
        bytes32 merkleRoot,
        uint256 timestamp
    );
    event ContractAddressesUpdated(
        address indexed propertyToken,
        address indexed reitFactory,
        address indexed complianceManager,
        address ccipRouter,
        address dao
    );
    event SupportedChainUpdated(bytes32 indexed chainId, bool isSupported);

    // Errors
    error InvalidTokenContract(address tokenContract);
    error InvalidIpfsHashLength(uint256 length);
    error InvalidMerkleRoot(bytes32 merkleRoot);
    error NotKYCVerified(address caller);
    error MetadataUpdateNotAllowed(address caller, address tokenContract, uint256 tokenId);
    error InvalidContractAddress(address contractAddress);
    error InvalidTokenId(uint256 tokenId);
    error UnauthorizedCaller(address caller);
    error UnsupportedChain(bytes32 chainId);
    error ExternalCallFailed(address targetContract, string reason);

    // Modifiers
    modifier onlyDAO() {
        if (msg.sender != dao) revert UnauthorizedCaller(msg.sender);
        _;
    }

    // Initialize
    function initialize(
        address _propertyToken,
        address _reitFactory,
        address _complianceManager,
        address _ccipRouter,
        address _dao
    ) public initializer {
        if (_propertyToken == address(0) || _reitFactory == address(0) || _complianceManager == address(0) ||
            _ccipRouter == address(0) || _dao == address(0)) revert InvalidContractAddress(address(0));

        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;
        ccipRouter = _ccipRouter;
        dao = _dao;

        validTokenContracts[_propertyToken] = true;
        validTokenContracts[_reitFactory] = true;

        emit ContractAddressesUpdated(_propertyToken, _reitFactory, _complianceManager, _ccipRouter, _dao);
    }

    // Update metadata
    function updateMetadata(
        address tokenContract,
        uint256 tokenId,
        string memory newIpfsHash,
        bytes32 newMerkleRoot,
        bytes32 destinationChainId
    ) external onlyDAO whenNotPaused nonReentrant {
        if (!validTokenContracts[tokenContract]) revert InvalidTokenContract(tokenContract);
        if (bytes(newIpfsHash).length == 0 || bytes(newIpfsHash).length > MAX_IPFS_HASH_LENGTH) 
            revert InvalidIpfsHashLength(bytes(newIpfsHash).length);
        if (newMerkleRoot == bytes32(0)) revert InvalidMerkleRoot(newMerkleRoot);
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified(msg.sender);
        if (!IERC3643(complianceManager).isMetadataUpdateAllowed(msg.sender, tokenContract, tokenId)) 
            revert MetadataUpdateNotAllowed(msg.sender, tokenContract, tokenId);

        // Validate tokenId
        if (tokenContract == propertyToken) {
            if (!IPropertyToken(propertyToken).isValidToken(tokenId)) revert InvalidTokenId(tokenId);
        } else {
            if (!IReitFactory(reitFactory).isValidReit(tokenId)) revert InvalidTokenId(tokenId);
        }

        // Update metadata
        try tokenContract == propertyToken
            ? IPropertyToken(propertyToken).updateMetadata(tokenId, newIpfsHash, newMerkleRoot)
            : IReitFactory(reitFactory).updateMetadata(tokenId, newIpfsHash, newMerkleRoot)
        {} catch Error(string memory reason) {
            revert ExternalCallFailed(tokenContract, reason);
        } catch {
            revert ExternalCallFailed(tokenContract, "Unknown error");
        }

        updatedTokens[tokenId] = true;

        // Propagate metadata cross-chain if destinationChainId is provided
        if (destinationChainId != bytes32(0)) {
            if (!supportedChains[destinationChainId]) revert UnsupportedChain(destinationChainId);
            try ICCIP(ccipRouter).propagateMetadata(tokenId, newMerkleRoot, destinationChainId) returns (bytes32 messageId) {
                emit CrossChainMetadataPropagated(messageId, tokenId, destinationChainId, newMerkleRoot, block.timestamp);
            } catch Error(string memory reason) {
                revert ExternalCallFailed(ccipRouter, reason);
            } catch {
                revert ExternalCallFailed(ccipRouter, "Unknown error");
            }
        }

        emit MetadataUpdated(tokenContract, tokenId, newIpfsHash, newMerkleRoot, block.timestamp);
    }

    // Update contract addresses
    function updateContractAddresses(
        address _propertyToken,
        address _reitFactory,
        address _complianceManager,
        address _ccipRouter,
        address _dao
    ) external onlyOwner {
        if (_propertyToken == address(0) || _reitFactory == address(0) || _complianceManager == address(0) ||
            _ccipRouter == address(0) || _dao == address(0)) revert InvalidContractAddress(address(0));

        validTokenContracts[propertyToken] = false;
        validTokenContracts[reitFactory] = false;
        validTokenContracts[_propertyToken] = true;
        validTokenContracts[_reitFactory] = true;

        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;
        ccipRouter = _ccipRouter;
        dao = _dao;

        emit ContractAddressesUpdated(_propertyToken, _reitFactory, _complianceManager, _ccipRouter, _dao);
    }

    // Update supported chains
    function updateSupportedChain(bytes32 chainId, bool isSupported) external onlyOwner {
        supportedChains[chainId] = isSupported;
        emit SupportedChainUpdated(chainId, isSupported);
    }

    // Verify metadata integrity
    function verifyMetadata(uint256 tokenId, bytes32 merkleRoot) external view returns (bool) {
        if (!updatedTokens[tokenId] || merkleRoot == bytes32(0)) return false;
        return true;
    }

    // Get updated tokens
    function isTokenUpdated(uint256 tokenId) external view returns (bool) {
        return updatedTokens[tokenId];
    }

    // Batch verify metadata
    function batchVerifyMetadata(uint256[] calldata tokenIds, bytes32[] calldata merkleRoots)
        external
        view
        returns (bool[] memory results)
    {
        if (tokenIds.length != merkleRoots.length) revert("Array length mismatch");
        results = new bool[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            results[i] = updatedTokens[tokenIds[i]] && merkleRoots[i] != bytes32(0);
        }
        return results;
    }

    // Pause contract
    function pause() external onlyOwner {
        _pause();
    }

    // Unpause contract
    function unpause() external onlyOwner {
        _unpause();
    }
}