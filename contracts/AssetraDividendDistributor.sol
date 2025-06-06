// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IAssetraProperty {
    function balanceOf(uint256 tokenId, address investor) external view returns (uint256);
    function totalSupply(uint256 tokenId) external view returns (uint256);
    function mintShares(uint256 tokenId, address investor, uint256 amount) external;
}

interface IAssetraFactory {
    function balanceOf(uint256 reitId, address investor) external view returns (uint256);
    function totalSupply(uint256 reitId) external view returns (uint256);
    function mintShares(uint256 reitId, address investor, uint256 amount) external;
    function isValidReit(uint256 reitId) external view returns (bool);
}

interface IERC3643 {
    function verifyIdentity(address investor) external view returns (bool);
}

interface IChainlinkDataStreams {
    function getRentalIncome(uint256 tokenId) external view returns (uint256);
    function getSharePrice(uint256 tokenId) external view returns (uint256);
}

contract AssetraDividendDistributor is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct Dividend {
        uint256 amount; // Total USDC distributed
        uint256 timestamp; // Distribution timestamp
        uint256 totalShares; // Snapshot of total shares at distribution
        mapping(address => bool) claimed; // Investor claim status
    }

    // State Variables
    mapping(uint256 => mapping(uint256 => Dividend)) private dividends; // Token/Reit ID => Dividend ID => Dividend
    mapping(uint256 => uint256) private dividendCount; // Token/Reit ID => Dividend counter
    mapping(uint256 => bool) private validTokens; // Token/Reit ID => validity
    address public propertyToken; // PropertyToken contract
    address public reitFactory; // ReitFactory contract
    address public complianceManager; // ComplianceManager contract
    address public usdc; // USDC token (6 decimals)
    address public dataStreams; // Chainlink Data Streams
    address public dao; // PropertyManagementDAO
    uint256 public constant MIN_DISTRIBUTION = 100 * 10**6; // $100 minimum distribution
    uint256 public constant USDC_DECIMALS = 6;
    uint256 public constant PRECISION = 1e18;

    // Events
    event DividendDistributed(uint256 indexed tokenId, uint256 indexed dividendId, uint256 amount, uint256 timestamp);
    event DividendClaimed(address indexed investor, uint256 indexed tokenId, uint256 indexed dividendId, uint256 amount);
    event DividendReinvested(address indexed investor, uint256 indexed tokenId, uint256 amount, uint256 newShares);
    event ContractAddressesUpdated(address indexed propertyToken, address indexed reitFactory, address indexed dao);
    event TokenValidityUpdated(uint256 indexed tokenId, bool isValid);

    // Errors
    error InvalidTokenId(uint256 tokenId);
    error InsufficientBalance(uint256 required, uint256 available);
    error NotKYCVerified(address investor);
    error DividendAlreadyClaimed(address investor, uint256 dividendId);
    error ZeroAmount();
    error ZeroShares();
    error InvalidContractAddress(address contractAddress);
    error UnauthorizedCaller(address caller);

    // Modifiers
    modifier onlyDAO() {
        if (msg.sender != dao) revert UnauthorizedCaller(msg.sender);
        _;
    }

    modifier validToken(uint256 tokenId) {
        if (!validTokens[tokenId]) revert InvalidTokenId(tokenId);
        _;
    }

    // Initialize
    function initialize(
        address _propertyToken,
        address _reitFactory,
        address _complianceManager,
        address _usdc,
        address _dataStreams,
        address _dao
    ) public initializer {
        if (_propertyToken == address(0) || _reitFactory == address(0) || _complianceManager == address(0) ||
            _usdc == address(0) || _dataStreams == address(0) || _dao == address(0))
            revert InvalidContractAddress(address(0));

        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();
        
        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;
        usdc = _usdc;
        dataStreams = _dataStreams;
        dao = _dao;

        emit ContractAddressesUpdated(_propertyToken, _reitFactory, _dao);
    }

    // Distribute dividends
    function distributeDividends(uint256 tokenId, uint256 amount) 
        external 
        onlyDAO 
        whenNotPaused 
        nonReentrant 
        validToken(tokenId) 
    {
        if (amount < MIN_DISTRIBUTION) revert ZeroAmount();
        uint256 balance = IERC20(usdc).balanceOf(address(this));
        if (balance < amount) revert InsufficientBalance(amount, balance);

        uint256 totalShares = _getTotalSupply(tokenId);
        if (totalShares == 0) revert ZeroShares();

        uint256 dividendId = dividendCount[tokenId]++;
        Dividend storage dividend = dividends[tokenId][dividendId];
        dividend.amount = amount;
        dividend.timestamp = block.timestamp;
        dividend.totalShares = totalShares;

        emit DividendDistributed(tokenId, dividendId, amount, block.timestamp);
    }

    // Claim dividends
    function claimDividends(uint256 tokenId, uint256 dividendId) 
        external 
        whenNotPaused 
        nonReentrant 
        validToken(tokenId) 
    {
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) 
            revert NotKYCVerified(msg.sender);
        
        Dividend storage dividend = dividends[tokenId][dividendId];
        if (dividend.claimed[msg.sender]) 
            revert DividendAlreadyClaimed(msg.sender, dividendId);

        uint256 balance = _getBalance(tokenId, msg.sender);
        if (balance == 0) revert ZeroShares();

        uint256 amount = dividend.amount.mul(balance).div(dividend.totalShares);
        if (amount == 0) revert ZeroAmount();

        dividend.claimed[msg.sender] = true;
        if (!IERC20(usdc).transfer(msg.sender, amount)) 
            revert("USDC transfer failed");

        emit DividendClaimed(msg.sender, tokenId, dividendId, amount);
    }

    // Reinvest dividends
    function reinvestDividends(uint256 tokenId, uint256 dividendId, uint256 targetTokenId) 
        external 
        whenNotPaused 
        nonReentrant 
        validToken(tokenId) 
        validToken(targetTokenId) 
    {
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) 
            revert NotKYCVerified(msg.sender);
        
        Dividend storage dividend = dividends[tokenId][dividendId];
        if (dividend.claimed[msg.sender]) 
            revert DividendAlreadyClaimed(msg.sender, dividendId);

        uint256 balance = _getBalance(tokenId, msg.sender);
        if (balance == 0) revert ZeroShares();

        uint256 amount = dividend.amount.mul(balance).div(dividend.totalShares);
        if (amount == 0) revert ZeroAmount();

        uint256 sharePrice = IChainlinkDataStreams(dataStreams).getSharePrice(targetTokenId);
        if (sharePrice == 0) revert("Invalid share price");

        uint256 newShares = amount.mul(PRECISION).div(sharePrice).div(10**USDC_DECIMALS);
        if (newShares == 0) revert ZeroShares();

        dividend.claimed[msg.sender] = true;
        
        if (_isPropertyToken(targetTokenId)) {
            IPropertyToken(propertyToken).mintShares(targetTokenId, msg.sender, newShares);
        } else {
            IReitFactory(reitFactory).mintShares(targetTokenId, msg.sender, newShares);
        }

        emit DividendReinvested(msg.sender, tokenId, amount, newShares);
    }

    // Update valid token
    function updateTokenValidity(uint256 tokenId, bool isValid) external onlyOwner {
        validTokens[tokenId] = isValid;
        emit TokenValidityUpdated(tokenId, isValid);
    }

    // Update contract addresses
    function updateContractAddresses(
        address _propertyToken,
        address _reitFactory,
        address _dao
    ) external onlyOwner {
        if (_propertyToken == address(0) || _reitFactory == address(0) || _dao == address(0))
            revert InvalidContractAddress(address(0));

        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        dao = _dao;
        
        emit ContractAddressesUpdated(_propertyToken, _reitFactory, _dao);
    }

    // Helper: Get total supply
    function _getTotalSupply(uint256 tokenId) internal view returns (uint256) {
        if (_isPropertyToken(tokenId)) {
            return IPropertyToken(propertyToken).totalSupply(tokenId);
        } else {
            return IReitFactory(reitFactory).totalSupply(tokenId);
        }
    }

    // Helper: Get balance
    function _getBalance(uint256 tokenId, address investor) internal view returns (uint256) {
        if (_isPropertyToken(tokenId)) {
            return IPropertyToken(propertyToken).balanceOf(tokenId, investor);
        } else {
            return IReitFactory(reitFactory).balanceOf(tokenId, investor);
        }
    }

    // Helper: Check if tokenId is PropertyToken
    function _isPropertyToken(uint256 tokenId) internal view returns (bool) {
        return !IReitFactory(reitFactory).isValidReit(tokenId);
    }

    // Pause contract
    function pause() external onlyOwner {
        _pause();
    }

    // Unpause contract
    function unpause() external onlyOwner {
        _unpause();
    }

    // Get dividend details
    function getDividendDetails(uint256 tokenId, uint256 dividendId)
        external
        view
        returns (
            uint256 amount,
            uint256 timestamp,
            uint256 totalShares,
            bool claimed
        )
    {
        Dividend storage dividend = dividends[tokenId][dividendId];
        return (
            dividend.amount,
            dividend.timestamp,
            dividend.totalShares,
            dividend.claimed[msg.sender]
        );
    }

    // Get available dividends for an investor
    function getAvailableDividends(uint256 tokenId, address investor)
        external
        view
        returns (uint256[] memory dividendIds, uint256[] memory amounts)
    {
        uint256 count = dividendCount[tokenId];
        uint256[] memory ids = new uint256[](count);
        uint256[] memory amountsArr = new uint256[](count);
        uint256 validCount = 0;

        for (uint256 i = 0; i < count; i++) {
            Dividend storage dividend = dividends[tokenId][i];
            if (!dividend.claimed[investor] && dividend.amount > 0) {
                uint256 balance = _getBalance(tokenId, investor);
                if (balance > 0) {
                    uint256 amount = dividend.amount.mul(balance).div(dividend.totalShares);
                    if (amount > 0) {
                        ids[validCount] = i;
                        amountsArr[validCount] = amount;
                        validCount++;
                    }
                }
            }
        }

        // Resize arrays to remove empty slots
        dividendIds = new uint256[](validCount);
        amounts = new uint256[](validCount);
        for (uint256 i = 0; i < validCount; i++) {
            dividendIds[i] = ids[i];
            amounts[i] = amountsArr[i];
        }

        return (dividendIds, amounts);
    }

    // Emergency withdraw
    function emergencyWithdraw(address token, address to, uint256 amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (to == address(0)) revert InvalidContractAddress(address(0));
        if (amount == 0) revert ZeroAmount();
        
        if (!IERC20(token).transfer(to, amount)) 
            revert("Token transfer failed");
    }
}