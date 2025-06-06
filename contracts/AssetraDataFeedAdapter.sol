// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IChainlinkDataStreams {
    function getData(uint256 dataId) external view returns (uint256 value, uint256 timestamp);
}

interface IAssetraDividendDistributor {
    function distributeDividends(uint256 tokenId, uint256 amount) external;
}

interface IAssetraLending {
    function updateLTV(address borrower, uint256 loanId) external;
    function isValidLoan(uint256 loanId) external view returns (bool);
}

interface IAssetraPropertyDAO {
    function getPropertyData(uint256 tokenId) external view returns (uint256);
    function isValidToken(uint256 tokenId) external view returns (bool);
}

interface IERC3643 {
    function verifyIdentity(address account) external view returns (bool);
}

contract AssetraDataFeedAdapter is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct DataRecord {
        uint256 value; // Data value (e.g., valuation, rental income)
        uint256 timestamp; // Data timestamp
        string ipfsHash; // MiMC-hashed data on IPFS
        bytes32 merkleRoot; // MiMC Merkle root
    }

    // State Variables
    mapping(uint256 => DataRecord) private dataRecords; // Token/Reit ID => DataRecord
    mapping(address => bool) private validTargetContracts; // Valid target contracts
    address public chainlinkDataStreams; // Chainlink Data Streams
    address public dividendDistributor; // DividendDistributor contract
    address public lendingProtocol; // LendingProtocol contract
    address public propertyManagementDAO; // PropertyManagementDAO contract
    address public complianceManager; // ComplianceManager contract
    uint256 public dataUpdateInterval; // Configurable update interval
    uint256 public constant MIN_DATA_UPDATE_INTERVAL = 1 hours; // Minimum update interval
    uint256 public constant MAX_IPFS_HASH_LENGTH = 128; // Maximum IPFS hash length

    // Events
    event DataFetched(uint256 indexed tokenId, uint256 value, string ipfsHash, bytes32 merkleRoot, uint256 timestamp);
    event DataFed(uint256 indexed tokenId, address indexed targetContract, uint256 value, uint256 timestamp);
    event ContractAddressesUpdated(
        address chainlinkDataStreams,
        address dividendDistributor,
        address lendingProtocol,
        address propertyManagementDAO,
        address complianceManager
    );
    event DataUpdateIntervalUpdated(uint256 oldInterval, uint256 newInterval);

    // Errors
    error InvalidContractAddress(address contractAddress);
    error InvalidIpfsHashLength(uint256 length);
    error InvalidMerkleRoot(bytes32 merkleRoot);
    error UpdateTooSoon(uint256 nextUpdateTime);
    error InvalidDataValue(uint256 value);
    error StaleData(uint256 timestamp, uint256 lastTimestamp);
    error InvalidTargetContract(address targetContract);
    error NoDataAvailable(uint256 tokenId);
    error NotKYCVerified(address account);
    error InvalidTokenId(uint256 tokenId);
    error InvalidLoanId(uint256 loanId);
    error ExternalCallFailed(address targetContract, string reason);

    // Initialize
    function initialize(
        address _chainlinkDataStreams,
        address _dividendDistributor,
        address _lendingProtocol,
        address _propertyManagementDAO,
        address _complianceManager,
        uint256 _dataUpdateInterval
    ) public initializer {
        if (_chainlinkDataStreams == address(0) || _dividendDistributor == address(0) ||
            _lendingProtocol == address(0) || _propertyManagementDAO == address(0) ||
            _complianceManager == address(0)) revert InvalidContractAddress(address(0));
        if (_dataUpdateInterval < MIN_DATA_UPDATE_INTERVAL) revert("Invalid update interval");

        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        chainlinkDataStreams = _chainlinkDataStreams;
        dividendDistributor = _dividendDistributor;
        lendingProtocol = _lendingProtocol;
        propertyManagementDAO = _propertyManagementDAO;
        complianceManager = _complianceManager;
        dataUpdateInterval = _dataUpdateInterval;

        validTargetContracts[_dividendDistributor] = true;
        validTargetContracts[_lendingProtocol] = true;
        validTargetContracts[_propertyManagementDAO] = true;

        emit ContractAddressesUpdated(
            _chainlinkDataStreams,
            _dividendDistributor,
            _lendingProtocol,
            _propertyManagementDAO,
            _complianceManager
        );
        emit DataUpdateIntervalUpdated(0, _dataUpdateInterval);
    }

    // Fetch and store data
    function fetchData(uint256 tokenId, string memory ipfsHash, bytes32 merkleRoot)
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        if (!IPropertyManagementDAO(propertyManagementDAO).isValidToken(tokenId)) 
            revert InvalidTokenId(tokenId);
        if (bytes(ipfsHash).length == 0 || bytes(ipfsHash).length > MAX_IPFS_HASH_LENGTH) 
            revert InvalidIpfsHashLength(bytes(ipfsHash).length);
        if (merkleRoot == bytes32(0)) revert InvalidMerkleRoot(merkleRoot);
        
        uint256 nextUpdateTime = dataRecords[tokenId].timestamp.add(dataUpdateInterval);
        if (block.timestamp < nextUpdateTime) revert UpdateTooSoon(nextUpdateTime);

        // Fetch data from Chainlink Data Streams
        (uint256 value, uint256 timestamp) = IChainlinkDataStreams(chainlinkDataStreams).getData(tokenId);
        if (value == 0) revert InvalidDataValue(value);
        if (timestamp < dataRecords[tokenId].timestamp) 
            revert StaleData(timestamp, dataRecords[tokenId].timestamp);

        dataRecords[tokenId] = DataRecord({
            value: value,
            timestamp: timestamp,
            ipfsHash: ipfsHash,
            merkleRoot: merkleRoot
        });

        emit DataFetched(tokenId, value, ipfsHash, merkleRoot, block.timestamp);
    }

    // Feed data to target contract
    function feedData(uint256 tokenId, address targetContract, address borrower, uint256 loanId)
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        if (!validTargetContracts[targetContract]) revert InvalidTargetContract(targetContract);
        if (dataRecords[tokenId].value == 0) revert NoDataAvailable(tokenId);
        if (targetContract != propertyManagementDAO && !IERC3643(complianceManager).verifyIdentity(borrower)) 
            revert NotKYCVerified(borrower);
        if (targetContract == lendingProtocol && !ILendingProtocol(lendingProtocol).isValidLoan(loanId)) 
            revert InvalidLoanId(loanId);

        try this._executeDataFeed(tokenId, targetContract, borrower, loanId) {
            emit DataFed(tokenId, targetContract, dataRecords[tokenId].value, block.timestamp);
        } catch Error(string memory reason) {
            revert ExternalCallFailed(targetContract, reason);
        } catch {
            revert ExternalCallFailed(targetContract, "Unknown error");
        }
    }

    // Internal function to execute data feed
    function _executeDataFeed(uint256 tokenId, address targetContract, address borrower, uint256 loanId)
        external
        onlyOwner
    {
        if (targetContract == dividendDistributor) {
            IDividendDistributor(dividendDistributor).distributeDividends(tokenId, dataRecords[tokenId].value);
        } else if (targetContract == lendingProtocol) {
            ILendingProtocol(lendingProtocol).updateLTV(borrower, loanId);
        }
        // No direct action needed for propertyManagementDAO as data is accessible via getPropertyData
    }

    // Update contract addresses
    function updateContractAddresses(
        address _chainlinkDataStreams,
        address _dividendDistributor,
        address _lendingProtocol,
        address _propertyManagementDAO,
        address _complianceManager
    ) external onlyOwner {
        if (_chainlinkDataStreams == address(0) || _dividendDistributor == address(0) ||
            _lendingProtocol == address(0) || _propertyManagementDAO == address(0) ||
            _complianceManager == address(0)) revert InvalidContractAddress(address(0));

        validTargetContracts[dividendDistributor] = false;
        validTargetContracts[lendingProtocol] = false;
        validTargetContracts[propertyManagementDAO] = false;
        validTargetContracts[_dividendDistributor] = true;
        validTargetContracts[_lendingProtocol] = true;
        validTargetContracts[_propertyManagementDAO] = true;

        chainlinkDataStreams = _chainlinkDataStreams;
        dividendDistributor = _dividendDistributor;
        lendingProtocol = _lendingProtocol;
        propertyManagementDAO = _propertyManagementDAO;
        complianceManager = _complianceManager;

        emit ContractAddressesUpdated(
            _chainlinkDataStreams,
            _dividendDistributor,
            _lendingProtocol,
            _propertyManagementDAO,
            _complianceManager
        );
    }

    // Update data update interval
    function updateDataUpdateInterval(uint256 newInterval) external onlyOwner {
        if (newInterval < MIN_DATA_UPDATE_INTERVAL) revert("Invalid update interval");
        emit DataUpdateIntervalUpdated(dataUpdateInterval, newInterval);
        dataUpdateInterval = newInterval;
    /

    // Get data record
    function getDataRecord(uint256 tokenId)
        external
        view
        returns (
            uint256 value,
            uint256 timestamp,
            string memory ipfsHash,
            bytes32 merkleRoot
        )
    {
        DataRecord storage record = dataRecords[tokenId];
        if (record.timestamp == 0) revert NoDataAvailable(tokenId);
        return (
            record.value,
            record.timestamp,
            record.ipfsHash,
            record.merkleRoot
        );
    }

    // Get recent data records
    function getRecentDataRecords(uint256[] calldata tokenIds)
        external
        view
        returns (
            uint256[] memory values,
            uint256[] memory timestamps,
            string[] memory ipfsHashes,
            bytes32[] memory merkleRoots
        )
    {
        values = new uint256[](tokenIds.length);
        timestamps = new uint256[](tokenIds.length);
        ipfsHashes = new string[](tokenIds.length);
        merkleRoots = new bytes32[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            DataRecord storage record = dataRecords[tokenIds[i]];
            if (record.timestamp == 0) continue; // Skip if no data
            values[i] = record.value;
            timestamps[i] = record.timestamp;
            ipfsHashes[i] = record.ipfsHash;
            merkleRoots[i] = record.merkleRoot;
        }

        return (values, timestamps, ipfsHashes, merkleRoots);
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