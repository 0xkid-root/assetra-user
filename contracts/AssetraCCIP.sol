// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IAssetraProperty {
    function transferShares(uint256 tokenId, address to, uint256 amount) external;
    function isValidToken(uint256 tokenId) external view returns (bool);
}

interface IAssetraFactory {
    function transferShares(uint256 reitId, address to, uint256 amount) external;
    function isValidReit(uint256 reitId) external view returns (bool);
}

interface IERC3643 {
    function verifyIdentity(address account) external view returns (bool);
    function restrictTransfer(address from, address to, uint256 amount) external view returns (bool);
}

interface IAssetraCCIP {
    function sendMessage(
        bytes32 destinationChainId,
        address receiver,
        bytes memory payload
    ) external returns (bytes32 messageId);
}

contract AssetraCCIP is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct BridgeRequest {
        address sender;
        address tokenContract; // PropertyToken or ReitFactory
        uint256 tokenId; // Token or REIT ID
        uint256 amount; // Token amount
        bytes32 destinationChainId; // Target chain
        bytes32 messageId; // CCIP message ID
        bool completed; // Request status
        uint256 timestamp; // Request creation timestamp
    }

    // State Variables
    mapping(bytes32 => BridgeRequest) private bridgeRequests; // Message ID => BridgeRequest
    mapping(address => bool) private validTokenContracts; // Valid token contracts
    mapping(bytes32 => bool) private supportedChains; // Supported destination chain IDs
    address public propertyToken; // PropertyToken contract
    address public reitFactory; // ReitFactory contract
    address public complianceManager; // ComplianceManager contract
    address public chainlinkCCIP; // Chainlink CCIP router
    address public lendingProtocol; // LendingProtocol contract
    address public metadataUpdater; // MetadataUpdater contract
    uint256 public constant MIN_BRIDGE_AMOUNT = 1; // Minimum token amount to bridge
    uint256 public constant MAX_MESSAGE_SIZE = 1000; // Maximum payload size in bytes

    // Events
    event TokenBridged(
        bytes32 indexed messageId,
        address indexed sender,
        address indexed tokenContract,
        uint256 tokenId,
        uint256 amount,
        bytes32 destinationChainId,
        uint256 timestamp
    );
    event MetadataPropagated(
        bytes32 indexed messageId,
        uint256 tokenId,
        bytes32 merkleRoot,
        bytes32 destinationChainId,
        uint256 timestamp
    );
    event BridgeCompleted(bytes32 indexed messageId, uint256 timestamp);
    event ContractAddressesUpdated(
        address propertyToken,
        address reitFactory,
        address complianceManager,
        address chainlinkCCIP,
        address lendingProtocol,
        address metadataUpdater
    );
    event SupportedChainUpdated(bytes32 indexed chainId, bool isSupported);
    event BridgeRequestCancelled(bytes32 indexed messageId);

    // Errors
    error InvalidTokenContract(address tokenContract);
    error InvalidAmount(uint256 amount);
    error NotKYCVerified(address account);
    error TransferRestricted(address from, address to, uint256 amount);
    error InvalidContractAddress(address contractAddress);
    error InvalidTokenId(uint256 tokenId);
    error UnsupportedChain(bytes32 chainId);
    error BridgeAlreadyCompleted(bytes32 messageId);
    error InvalidMerkleRoot(bytes32 merkleRoot);
    error InvalidMessageId(bytes32 messageId);
    error OnlyMetadataUpdater(address caller);
    error PayloadTooLarge(uint256 size);
    error TransferFailed(address tokenContract, uint256 tokenId, uint256 amount);

    // Initialize
    function initialize(
        address _propertyToken,
        address _reitFactory,
        address _complianceManager,
        address _chainlinkCCIP,
        address _lendingProtocol,
        address _metadataUpdater
    ) public initializer {
        if (_propertyToken == address(0) || _reitFactory == address(0) || _complianceManager == address(0) ||
            _chainlinkCCIP == address(0) || _lendingProtocol == address(0) || _metadataUpdater == address(0))
            revert InvalidContractAddress(address(0));

        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;
        chainlinkCCIP = _chainlinkCCIP;
        lendingProtocol = _lendingProtocol;
        metadataUpdater = _metadataUpdater;

        validTokenContracts[_propertyToken] = true;
        validTokenContracts[_reitFactory] = true;

        emit ContractAddressesUpdated(
            _propertyToken,
            _reitFactory,
            _complianceManager,
            _chainlinkCCIP,
            _lendingProtocol,
            _metadataUpdater
        );
    }

    // Bridge tokens
    function bridgeToken(
        address tokenContract,
        uint256 tokenId,
        uint256 amount,
        bytes32 destinationChainId
    ) external whenNotPaused nonReentrant returns (bytes32 messageId) {
        if (!validTokenContracts[tokenContract]) revert InvalidTokenContract(tokenContract);
        if (amount < MIN_BRIDGE_AMOUNT) revert InvalidAmount(amount);
        if (!supportedChains[destinationChainId]) revert UnsupportedChain(destinationChainId);
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified(msg.sender);
        if (!IERC3643(complianceManager).restrictTransfer(msg.sender, address(this), amount)) 
            revert TransferRestricted(msg.sender, address(this), amount);

        // Validate tokenId
        if (tokenContract == propertyToken) {
            if (!IPropertyToken(propertyToken).isValidToken(tokenId)) revert InvalidTokenId(tokenId);
        } else {
            if (!IReitFactory(reitFactory).isValidReit(tokenId)) revert InvalidTokenId(tokenId);
        }

        // Transfer tokens to this contract
        try tokenContract == propertyToken
            ? IPropertyToken(propertyToken).transferShares(tokenId, address(this), amount)
            : IReitFactory(reitFactory).transferShares(tokenId, address(this), amount)
        {} catch {
            revert TransferFailed(tokenContract, tokenId, amount);
        }

        // Encode and validate payload
        bytes memory payload = abi.encode(msg.sender, tokenContract, tokenId, amount);
        if (payload.length > MAX_MESSAGE_SIZE) revert PayloadTooLarge(payload.length);

        // Send CCIP message
        messageId = IChainlinkCCIP(chainlinkCCIP).sendMessage(destinationChainId, lendingProtocol, payload);

        bridgeRequests[messageId] = BridgeRequest({
            sender: msg.sender,
            tokenContract: tokenContract,
            tokenId: tokenId,
            amount: amount,
            destinationChainId: destinationChainId,
            messageId: messageId,
            completed: false,
            timestamp: block.timestamp
        });

        emit TokenBridged(messageId, msg.sender, tokenContract, tokenId, amount, destinationChainId, block.timestamp);
        return messageId;
    }

    // Propagate metadata
    function propagateMetadata(
        uint256 tokenId,
        bytes32 merkleRoot,
        bytes32 destinationChainId
    ) external whenNotPaused nonReentrant returns (bytes32 messageId) {
        if (msg.sender != metadataUpdater) revert OnlyMetadataUpdater(msg.sender);
        if (merkleRoot == bytes32(0)) revert InvalidMerkleRoot(merkleRoot);
        if (!supportedChains[destinationChainId]) revert UnsupportedChain(destinationChainId);
        if (!IMetadataUpdater(metadataUpdater).isValidToken(tokenId)) revert InvalidTokenId(tokenId);

        // Encode and validate payload
        bytes memory payload = abi.encode(tokenId, merkleRoot);
        if (payload.length > MAX_MESSAGE_SIZE) revert PayloadTooLarge(payload.length);

        // Send CCIP message
        messageId = IChainlinkCCIP(chainlinkCCIP).sendMessage(destinationChainId, metadataUpdater, payload);

        bridgeRequests[messageId] = BridgeRequest({
            sender: msg.sender,
            tokenContract: address(0),
            tokenId: tokenId,
            amount: 0,
            destinationChainId: destinationChainId,
            messageId: messageId,
            completed: false,
            timestamp: block.timestamp
        });

        emit MetadataPropagated(messageId, tokenId, merkleRoot, destinationChainId, block.timestamp);
        return messageId;
    }

    // Confirm bridge completion
    function confirmBridge(bytes32 messageId) external onlyOwner whenNotPaused nonReentrant {
        BridgeRequest storage request = bridgeRequests[messageId];
        if (request.messageId == bytes32(0)) revert InvalidMessageId(messageId);
        if (request.completed) revert BridgeAlreadyCompleted(messageId);

        request.completed = true;
        emit BridgeCompleted(messageId, block.timestamp);
    }

    // Cancel bridge request
    function cancelBridgeRequest(bytes32 messageId) external onlyOwner whenNotPaused nonReentrant {
        BridgeRequest storage request = bridgeRequests[messageId];
        if (request.messageId == bytes32(0)) revert InvalidMessageId(messageId);
        if (request.completed) revert BridgeAlreadyCompleted(messageId);
        if (request.tokenContract == address(0)) revert InvalidTokenContract(address(0));

        // Return tokens to sender
        try request.tokenContract == propertyToken
            ? IPropertyToken(propertyToken).transferShares(request.tokenId, request.sender, request.amount)
            : IReitFactory(reitFactory).transferShares(request.tokenId, request.sender, request.amount)
        {} catch {
            revert TransferFailed(request.tokenContract, request.tokenId, request.amount);
        }

        request.completed = true;
        emit BridgeRequestCancelled(messageId);
    }

    // Update contract addresses
    function updateContractAddresses(
        address _propertyToken,
        address _reitFactory,
        address _complianceManager,
        address _chainlinkCCIP,
        address _lendingProtocol,
        address _metadataUpdater
    ) external onlyOwner {
        if (_propertyToken == address(0) || _reitFactory == address(0) || _complianceManager == address(0) ||
            _chainlinkCCIP == address(0) || _lendingProtocol == address(0) || _metadataUpdater == address(0))
            revert InvalidContractAddress(address(0));

        validTokenContracts[propertyToken] = false;
        validTokenContracts[reitFactory] = false;
        validTokenContracts[_propertyToken] = true;
        validTokenContracts[_reitFactory] = true;

        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;
        chainlinkCCIP = _chainlinkCCIP;
        lendingProtocol = _lendingProtocol;
        metadataUpdater = _metadataUpdater;

        emit ContractAddressesUpdated(
            _propertyToken,
            _reitFactory,
            _complianceManager,
            _chainlinkCCIP,
            _lendingProtocol,
            _metadataUpdater
        );
    }

    // Update supported chains
    function updateSupportedChain(bytes32 chainId, bool isSupported) external onlyOwner {
        supportedChains[chainId] = isSupported;
        emit SupportedChainUpdated(chainId, isSupported);
    }

    // Get bridge request details
    function getBridgeRequest(bytes32 messageId)
        external
        view
        returns (
            address sender,
            address tokenContract,
            uint256 tokenId,
            uint256 amount,
            bytes32 destinationChainId,
            bool completed,
            uint256 timestamp
        )
    {
        BridgeRequest storage req = bridgeRequests[messageId];
        if (req.messageId == bytes32(0)) revert InvalidMessageId(messageId);
        return (
            req.sender,
            req.tokenContract,
            req.tokenId,
            req.amount,
            req.destinationChainId,
            req.completed,
            req.timestamp
        );
    }

    // Get pending bridge requests
    function getPendingBridgeRequests() 
        external 
        view 
        returns (bytes32[] memory messageIds, uint256[] memory timestamps)
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= type(uint256).max; i++) {
            bytes32 id = bytes32(i);
            if (bridgeRequests[id].messageId != bytes32(0) && !bridgeRequests[id].completed) {
                count++;
            }
            if (bridgeRequests[id].messageId == bytes32(0)) break;
        }

        messageIds = new bytes32[](count);
        timestamps = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= type(uint256).max && index < count; i++) {
            bytes32 id = bytes32(i);
            if (bridgeRequests[id].messageId != bytes32(0) && !bridgeRequests[id].completed) {
                messageIds[index] = id;
                timestamps[index] = bridgeRequests[id].timestamp;
                index++;
            }
            if (bridgeRequests[id].messageId == bytes32(0)) break;
        }

        return (messageIds, timestamps);
    }

    // Emergency withdraw tokens
    function emergencyWithdraw(address tokenContract, uint256 tokenId, address to, uint256 amount)
        external
        onlyOwner
        nonReentrant
    {
        if (!validTokenContracts[tokenContract]) revert InvalidTokenContract(tokenContract);
        if (to == address(0)) revert InvalidContractAddress(to);
        if (amount == 0) revert InvalidAmount(amount);

        try tokenContract == propertyToken
            ? IPropertyToken(propertyToken).transferShares(tokenId, to, amount)
            : IReitFactory(reitFactory).transferShares(tokenId, to, amount)
        {} catch {
            revert TransferFailed(tokenContract, tokenId, amount);
        }
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