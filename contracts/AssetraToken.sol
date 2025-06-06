// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IERC3643 {
    function verifyIdentity(address account) external view returns (bool);
    function restrictTransfer(address from, address to, uint256 amount) external view returns (bool);
}

/// @title AssetraToken - An ERC20 token with staking and reward distribution
/// @notice Manages $ASTR token with KYC-compliant transfers, staking, and block-based rewards
contract AssetraToken is Initializable, ERC20Upgradeable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct Stake {
        uint256 amount; // Staked $ASTR tokens
        uint256 timestamp; // Staking start time
        uint256 lastRewardBlock; // Last block when rewards were claimed
    }

    // State Variables
    mapping(address => Stake) private stakes; // User => Stake
    address public complianceManager; // ComplianceManager contract
    address public dao; // PropertyManagementDAO contract
    address public dex; // DEX contract
    uint256 public totalStaked; // Total staked $ASTR
    uint256 public lastRewardBlock; // Last block for reward calculation
    uint256 public constant REWARD_PER_BLOCK = 1 * 10**18; // 1 $ASTR per block (18 decimals)
    uint256 public constant MIN_STAKE_PERIOD = 30 days; // Minimum staking period
    uint256 public constant MIN_STAKE_AMOUNT = 1 * 10**18; // Minimum stake: 1 $ASTR
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // Max supply: 1B $ASTR

    // Events
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event RewardsDistributed(address indexed recipient, uint256 amount);
    event TokensMinted(address indexed recipient, uint256 amount);
    event TokensBurned(address indexed account, uint256 amount);

    // Errors
    error InvalidAddress();
    error InvalidAmount();
    error NotKYCVerified();
    error InsufficientBalance();
    error TransferRestricted();
    error StakeLocked();
    error OnlyDAOorDEX();
    error ExceedsMaxSupply();

    /// @notice Initializes the contract with external contract addresses
    /// @param _complianceManager Address of the ComplianceManager contract
    /// @param _dao Address of the PropertyManagementDAO contract
    /// @param _dex Address of the DEX contract
    function initialize(
        address _complianceManager,
        address _dao,
        address _dex
    ) public initializer {
        __ERC20_init("Assetra Token", "ASTR");
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        if (_complianceManager == address(0)) revert InvalidAddress();
        if (_dao == address(0)) revert InvalidAddress();
        if (_dex == address(0)) revert InvalidAddress();

        complianceManager = _complianceManager;
        dao = _dao;
        dex = _dex;
        lastRewardBlock = block.number;
    }

    /// @notice Mints new $ASTR tokens to a recipient
    /// @param recipient Address to receive the minted tokens
    /// @param amount Amount of tokens to mint (18 decimals)
    function mint(address recipient, uint256 amount) 
        external 
        onlyDAOorDEX 
        whenNotPaused 
        nonReentrant 
    {
        if (recipient == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (!IERC3643(complianceManager).verifyIdentity(recipient)) revert NotKYCVerified();
        if (totalSupply().add(amount) > MAX_SUPPLY) revert ExceedsMaxSupply();

        _mint(recipient, amount);
        emit TokensMinted(recipient, amount);
    }

    /// @notice Burns $ASTR tokens from the caller's balance
    /// @param amount Amount of tokens to burn (18 decimals)
    function burn(uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (amount == 0) revert InvalidAmount();
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();

        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /// @notice Stakes $ASTR tokens to earn rewards
    /// @param amount Amount of tokens to stake (18 decimals)
    function stake(uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (amount < MIN_STAKE_AMOUNT) revert InvalidAmount();
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified();

        if (stakes[msg.sender].amount > 0) {
            _claimRewards(msg.sender);
        } else {
            stakes[msg.sender].lastRewardBlock = block.number;
        }

        stakes[msg.sender].amount = stakes[msg.sender].amount.add(amount);
        stakes[msg.sender].timestamp = block.timestamp;
        totalStaked = totalStaked.add(amount);

        _transfer(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount, block.timestamp);
    }

    /// @notice Unstakes $ASTR tokens and claims accumulated rewards
    /// @param amount Amount of tokens to unstake (18 decimals)
    function unstake(uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (amount == 0 || amount > stakes[msg.sender].amount) revert InvalidAmount();
        if (block.timestamp < stakes[msg.sender].timestamp.add(MIN_STAKE_PERIOD)) revert StakeLocked();

        _claimRewards(msg.sender);

        stakes[msg.sender].amount = stakes[msg.sender].amount.sub(amount);
        totalStaked = totalStaked.sub(amount);

        if (stakes[msg.sender].amount == 0) {
            delete stakes[msg.sender];
        }

        _transfer(address(this), msg.sender, amount);
        emit Unstaked(msg.sender, amount, block.timestamp);
    }

    /// @notice Claims accumulated staking rewards for the caller
    function claimRewards() 
        external 
        whenNotPaused 
        nonReentrant 
    {
        _claimRewards(msg.sender);
    }

    /// @notice Internal function to calculate and distribute staking rewards
    /// @param user Address of the user claiming rewards
    function _claimRewards(address user) internal {
        if (block.number <= stakes[user].lastRewardBlock || totalStaked == 0) return;

        uint256 blocksElapsed = block.number.sub(stakes[user].lastRewardBlock);
        uint256 reward = blocksElapsed.mul(REWARD_PER_BLOCK).mul(stakes[user].amount).div(totalStaked);

        if (reward > 0) {
            if (totalSupply().add(reward) > MAX_SUPPLY) revert ExceedsMaxSupply();
            _mint(user, reward);
            emit RewardsDistributed(user, reward);
        }

        stakes[user].lastRewardBlock = block.number;
        lastRewardBlock = block.number;
    }

    /// @notice Transfers $ASTR tokens with KYC and compliance checks
    /// @param to Recipient address
    /// @param amount Amount of tokens to transfer (18 decimals)
    /// @return success True if the transfer succeeds
    function transfer(address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        returns (bool success) 
    {
        if (!IERC3643(complianceManager).verifyIdentity(to)) revert NotKYCVerified();
        if (!IERC3643(complianceManager).restrictTransfer(msg.sender, to, amount)) revert TransferRestricted();
        return super.transfer(to, amount);
    }

    /// @notice Transfers $ASTR tokens from one address to another with KYC and compliance checks
    /// @param from Sender address
    /// @param to Recipient address
    /// @param amount Amount of tokens to transfer (18 decimals)
    /// @return success True if the transfer succeeds
    function transferFrom(address from, address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        returns (bool success) 
    {
        if (!IERC3643(complianceManager).verifyIdentity(to)) revert NotKYCVerified();
        if (!IERC3643(complianceManager).restrictTransfer(from, to, amount)) revert TransferRestricted();
        return super.transferFrom(from, to, amount);
    }

    /// @notice Pauses the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Retrieves staking details for a user
    /// @param user Address of the user
    /// @return amount Staked $ASTR tokens
    /// @return timestamp Staking start time
    /// @return lastRewardBlock Last block when rewards were claimed
    function getStakeDetails(address user) 
        external 
        view 
        returns (uint256 amount, uint256 timestamp, uint256 lastRewardBlock) 
    {
        Stake memory stake = stakes[user];
        return (stake.amount, stake.timestamp, stake.lastRewardBlock);
    }

    /// @notice Modifier to restrict access to DAO or DEX
    modifier onlyDAOorDEX() {
        if (msg.sender != dao && msg.sender != dex) revert OnlyDAOorDEX();
        _;
    }
}