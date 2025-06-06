// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Chainlink VRF interface
interface IAssetraVRF {
    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 minReqConf,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external returns (uint256 requestId);
}

interface IAssetraProperty {
    function mintShares(uint256 tokenId, address investor, uint256 amount) external;
    function isValidToken(uint256 tokenId) external view returns (bool);
}

interface IAssetraFactory {
    function mintShares(uint256 reitId, address investor, uint256 amount) external;
    function isValidReit(uint256 reitId) external view returns (bool);
}

interface IERC3643 {
    function verifyIdentity(address investor) external view returns (bool);
}

contract AssetraVRF is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct Request {
        bytes32 requestId;
        address tokenContract; // PropertyToken or ReitFactory
        uint256 tokenId; // Token or REIT ID
        address[] investors; // Investors to allocate
        uint256[] amounts; // Amounts to allocate
        bool fulfilled; // Request status
        uint256 timestamp; // Request creation timestamp
    }

    // State Variables
    mapping(bytes32 => Request) private requests; // Request ID => Request
    mapping(address => bool) private validTokenContracts; // Valid token contracts
    address public chainlinkVRF; // Chainlink VRF contract
    address public propertyToken; // PropertyToken contract
    address public reitFactory; // ReitFactory contract
    address public complianceManager; // ComplianceManager contract
    bytes32 public keyHash; // Chainlink VRF key hash
    uint64 public subscriptionId; // Chainlink VRF subscription ID
    uint16 public minimumRequestConfirmations; // Minimum confirmations
    uint32 public callbackGasLimit; // Gas limit for callback
    uint32 public constant MAX_NUM_WORDS = 10; // Maximum random words
    uint32 public numWords; // Number of random words
    uint256 public constant MAX_INVESTORS = 100; // Maximum investors per request

    // Events
    event RandomnessRequested(bytes32 indexed requestId, address indexed tokenContract, uint256 indexed tokenId, uint256 investorCount);
    event RandomnessFulfilled(bytes32 indexed requestId, uint256 randomness);
    event SharesAllocated(bytes32 indexed requestId, address[] investors, uint256[] amounts);
    event ContractAddressesUpdated(address indexed propertyToken, address indexed reitFactory, address indexed complianceManager);
    event VRFConfigUpdated(bytes32 keyHash, uint64 subscriptionId, uint16 minRequestConfirmations, uint32 callbackGasLimit, uint32 numWords);

    // Errors
    error InvalidTokenContract(address tokenContract);
    error ArrayLengthMismatch(uint256 investorsLength, uint256 amountsLength);
    error EmptyInvestorList();
    error TooManyInvestors(uint256 count);
    error NotKYCVerified(address investor);
    error InvalidAmount(uint256 amount);
    error UnauthorizedCaller(address caller);
    error RequestAlreadyFulfilled(bytes32 requestId);
    error InvalidRandomWords(uint256 received, uint256 expected);
    error InvalidContractAddress(address contractAddress);
    error InvalidTokenId(uint256 tokenId);
    error InvalidNumWords(uint32 numWords);
    error InvalidRequestId(bytes32 requestId);

    // Initialize
    function initialize(
        address _chainlinkVRF,
        address _propertyToken,
        address _reitFactory,
        address _complianceManager,
        bytes32 _keyHash,
        uint64 _subscriptionId,
        uint16 _minRequestConfirmations,
        uint32 _callbackGasLimit,
        uint32 _numWords
    ) public initializer {
        if (_chainlinkVRF == address(0) || _propertyToken == address(0) || _reitFactory == address(0) || 
            _complianceManager == address(0)) revert InvalidContractAddress(address(0));
        if (_numWords == 0 || _numWords > MAX_NUM_WORDS) revert InvalidNumWords(_numWords);

        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        chainlinkVRF = _chainlinkVRF;
        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        minimumRequestConfirmations = _minRequestConfirmations;
        callbackGasLimit = _callbackGasLimit;
        numWords = _numWords;

        validTokenContracts[_propertyToken] = true;
        validTokenContracts[_reitFactory] = true;

        emit ContractAddressesUpdated(_propertyToken, _reitFactory, _complianceManager);
        emit VRFConfigUpdated(_keyHash, _subscriptionId, _minRequestConfirmations, _callbackGasLimit, _numWords);
    }

    // Request randomness
    function requestRandomness(
        address tokenContract,
        uint256 tokenId,
        address[] memory investors,
        uint256[] memory amounts
    )
        external
        onlyOwner
        whenNotPaused
        nonReentrant
        returns (bytes32 requestId)
    {
        if (!validTokenContracts[tokenContract]) revert InvalidTokenContract(tokenContract);
        if (investors.length != amounts.length) revert ArrayLengthMismatch(investors.length, amounts.length);
        if (investors.length == 0) revert EmptyInvestorList();
        if (investors.length > MAX_INVESTORS) revert TooManyInvestors(investors.length);

        // Validate tokenId
        if (tokenContract == propertyToken) {
            if (!IPropertyToken(propertyToken).isValidToken(tokenId)) revert InvalidTokenId(tokenId);
        } else {
            if (!IReitFactory(reitFactory).isValidReit(tokenId)) revert InvalidTokenId(tokenId);
        }

        // Verify KYC and amounts
        for (uint256 i = 0; i < investors.length; i++) {
            if (!IERC3643(complianceManager).verifyIdentity(investors[i])) 
                revert NotKYCVerified(investors[i]);
            if (amounts[i] == 0) revert InvalidAmount(amounts[i]);
        }

        // Request random words from Chainlink VRF
        uint256 vrfRequestId = IChainlinkVRF(chainlinkVRF).requestRandomWords(
            keyHash,
            subscriptionId,
            minimumRequestConfirmations,
            callbackGasLimit,
            numWords
        );

        requestId = bytes32(vrfRequestId);
        requests[requestId] = Request({
            requestId: requestId,
            tokenContract: tokenContract,
            tokenId: tokenId,
            investors: investors,
            amounts: amounts,
            fulfilled: false,
            timestamp: block.timestamp
        });

        emit RandomnessRequested(requestId, tokenContract, tokenId, investors.length);
        return requestId;
    }

    // Fulfill randomness
    function fulfillRandomWords(bytes32 requestId, uint256[] memory randomWords) 
        external 
        nonReentrant 
    {
        if (msg.sender != chainlinkVRF) revert UnauthorizedCaller(msg.sender);
        Request storage req = requests[requestId];
        if (req.requestId == bytes32(0)) revert InvalidRequestId(requestId);
        if (req.fulfilled) revert RequestAlreadyFulfilled(requestId);
        if (randomWords.length != numWords) revert InvalidRandomWords(randomWords.length, numWords);

        req.fulfilled = true;
        uint256 randomness = randomWords[0];

        // Shuffle investors using Fisher-Yates algorithm with randomness
        address[] memory investors = req.investors;
        uint256[] memory amounts = req.amounts;
        for (uint256 i = investors.length - 1; i > 0; i--) {
            uint256 randIndex = uint256(keccak256(abi.encode(randomness, i))) % (i + 1);
            (investors[i], investors[randIndex]) = (investors[randIndex], investors[i]);
            (amounts[i], amounts[randIndex]) = (amounts[randIndex], amounts[i]);
        }

        // Allocate shares
        for (uint256 i = 0; i < investors.length; i++) {
            if (req.tokenContract == propertyToken) {
                IPropertyToken(propertyToken).mintShares(req.tokenId, investors[i], amounts[i]);
            } else {
                IReitFactory(reitFactory).mintShares(req.tokenId, investors[i], amounts[i]);
            }
        }

        emit RandomnessFulfilled(requestId, randomness);
        emit SharesAllocated(requestId, investors, amounts);
    }

    // Update Chainlink VRF config
    function updateVRFConfig(
        bytes32 _keyHash,
        uint64 _subscriptionId,
        uint16 _minRequestConfirmations,
        uint32 _callbackGasLimit,
        uint32 _numWords
    ) external onlyOwner {
        if (_numWords == 0 || _numWords > MAX_NUM_WORDS) revert InvalidNumWords(_numWords);
        
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        minimumRequestConfirmations = _minRequestConfirmations;
        callbackGasLimit = _callbackGasLimit;
        numWords = _numWords;

        emit VRFConfigUpdated(_keyHash, _subscriptionId, _minRequestConfirmations, _callbackGasLimit, _numWords);
    }

    // Update contract addresses
    function updateContractAddresses(
        address _chainlinkVRF,
        address _propertyToken,
        address _reitFactory,
        address _complianceManager
    ) external onlyOwner {
        if (_chainlinkVRF == address(0) || _propertyToken == address(0) || 
            _reitFactory == address(0) || _complianceManager == address(0))
            revert InvalidContractAddress(address(0));

        validTokenContracts[propertyToken] = false;
        validTokenContracts[reitFactory] = false;
        validTokenContracts[_propertyToken] = true;
        validTokenContracts[_reitFactory] = true;

        chainlinkVRF = _chainlinkVRF;
        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;

        emit ContractAddressesUpdated(_propertyToken, _reitFactory, _complianceManager);
    }

    // Pause contract
    function pause() external onlyOwner {
        _pause();
    }

    // Unpause contract
    function unpause() external onlyOwner {
        _unpause();
    }

    // Get request details
    function getRequestDetails(bytes32 requestId)
        external
        view
        returns (
            address tokenContract,
            uint256 tokenId,
            address[] memory investors,
            uint256[] memory amounts,
            bool fulfilled,
            uint256 timestamp
        )
    {
        Request storage req = requests[requestId];
        return (
            req.tokenContract,
            req.tokenId,
            req.investors,
            req.amounts,
            req.fulfilled,
            req.timestamp
        );
    }

    // Get pending requests
    function getPendingRequests() 
        external 
        view 
        returns (bytes32[] memory requestIds, uint256[] memory timestamps)
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= type(uint256).max; i++) {
            bytes32 id = bytes32(i);
            if (requests[id].requestId != bytes32(0) && !requests[id].fulfilled) {
                count++;
            }
            if (requests[id].requestId == bytes32(0)) break;
        }

        requestIds = new bytes32[](count);
        timestamps = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= type(uint256).max && index < count; i++) {
            bytes32 id = bytes32(i);
            if (requests[id].requestId != bytes32(0) && !requests[id].fulfilled) {
                requestIds[index] = id;
                timestamps[index] = requests[id].timestamp;
                index++;
            }
            if (requests[id].requestId == bytes32(0)) break;
        }

        return (requestIds, timestamps);
    }

    // Emergency stop request processing
    function emergencyStopRequest(bytes32 requestId) 
        external 
        onlyOwner 
        nonReentrant 
    {
        Request storage req = requests[requestId];
        if (req.requestId == bytes32(0)) revert InvalidRequestId(requestId);
        if (req.fulfilled) revert RequestAlreadyFulfilled(requestId);

        req.fulfilled = true; // Mark as fulfilled to prevent processing
        emit RandomnessFulfilled(requestId, 0);
    }
}