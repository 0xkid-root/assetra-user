// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Simplified interfaces for external contracts
interface IAssetraProperty {
    function balanceOf(uint256 tokenId, address investor) external view returns (uint256);
    function transferShares(uint256 tokenId, address to, uint256 amount) external;
}

interface IAssetraFactory {
    function balanceOf(uint256 reitId, address investor) external view returns (uint256);
    function transferShares(uint256 reitId, address to, uint256 amount) external;
}

interface IERC3643 {
    function verifyIdentity(address investor) external view returns (bool);
    function restrictTransfer(address from, address to, uint256 amount) external view returns (bool);
}

interface IAssetraToken {
    function mint(address recipient, uint256 amount) external;
}

/// @title AssetraDEX - Decentralized exchange for tokenized real estate assets
/// @notice Manages liquidity pools, swaps, fees, and $ASTR rewards with Chainlink Price Feed integration
contract AssetraDEX is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct Pool {
        address token; // PropertyToken or REITFactory contract
        uint256 tokenId; // Token or REIT ID
        uint256 tokenReserve; // Reserve of token shares
        uint256 usdcReserve; // Reserve of USDC (6 decimals)
        uint256 totalLiquidity; // Total liquidity shares
        uint256 accumulatedFees; // Accumulated trading fees in USDC
        uint256 lastRewardBlock; // Last block for reward calculation
        mapping(address => uint256) liquidityBalance; // Liquidity provider shares
    }

    // State Variables
    mapping(bytes32 => Pool) private pools; // Pool ID (keccak256(token, tokenId)) => Pool
    address public propertyToken; // PropertyToken contract
    address public reitFactory; // REITFactory contract
    address public complianceManager; // ComplianceManager contract
    address public usdc; // USDC token (6 decimals)
    address public astrToken; // $ASTR token (18 decimals)
    address public dao; // PropertyManagementDAO contract
    AggregatorV3Interface public priceFeed; // Chainlink USDC/USD price feed
    uint256 public constant FEE_PERCENT = 50; // 0.5% fee (50/10000)
    uint256 public constant REWARD_RATE = 1 * 10**18; // 1 $ASTR per block (18 decimals)
    uint256 public constant MINIMUM_LIQUIDITY = 1_000; // Minimum liquidity to prevent division by zero
    uint256 public constant MINIMUM_AMOUNT = 1; // Minimum token/USDC amount for transactions
    uint256 public constant MAX_POOLS = 1_000; // Maximum number of pools
    uint256 private poolCount; // Number of active pools

    // Events
    event PoolCreated(address indexed token, uint256 indexed tokenId, bytes32 poolId);
    event LiquidityAdded(address indexed provider, bytes32 indexed poolId, uint256 tokenAmount, uint256 usdcAmount, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, bytes32 indexed poolId, uint256 tokenAmount, uint256 usdcAmount, uint256 liquidity);
    event Swap(address indexed user, bytes32 indexed poolId, address tokenIn, uint256 amountIn, uint256 amountOut);
    event FeesClaimed(address indexed provider, bytes32 indexed poolId, uint256 usdcAmount);
    event RewardsDistributed(address indexed provider, bytes32 indexed poolId, uint256 astrAmount);
    event EmergencyWithdrawal(address indexed owner, address token, uint256 amount);

    // Errors
    error InvalidPool();
    error InvalidAmount();
    error NotKYCVerified();
    error TransferRestricted();
    error InsufficientLiquidity();
    error InvalidTokenContract();
    error PoolExists();
    error TransferFailed();
    error InsufficientOutput();
    error NoFeesToClaim();
    error InvalidAddress();
    error ExceedsMaxPools();
    error PriceFeedError();

    /// @notice Initializes the contract with external contract addresses and Chainlink Price Feed
    /// @param _propertyToken Address of the PropertyToken contract
    /// @param _reitFactory Address of the REITFactory contract
    /// @param _complianceManager Address of the ComplianceManager contract
    /// @param _usdc Address of the USDC token contract
    /// @param _astrToken Address of the $ASTR token contract
    /// @param _dao Address of the PropertyManagementDAO contract
    /// @param _priceFeed Address of the Chainlink USDC/USD price feed
    function initialize(
        address _propertyToken,
        address _reitFactory,
        address _complianceManager,
        address _usdc,
        address _astrToken,
        address _dao,
        address _priceFeed
    ) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        if (_propertyToken == address(0)) revert InvalidAddress();
        if (_reitFactory == address(0)) revert InvalidAddress();
        if (_complianceManager == address(0)) revert InvalidAddress();
        if (_usdc == address(0)) revert InvalidAddress();
        if (_astrToken == address(0)) revert InvalidAddress();
        if (_dao == address(0)) revert InvalidAddress();
        if (_priceFeed == address(0)) revert InvalidAddress();

        propertyToken = _propertyToken;
        reitFactory = _reitFactory;
        complianceManager = _complianceManager;
        usdc = _usdc;
        astrToken = _astrToken;
        dao = _dao;
        priceFeed = AggregatorV3Interface(_priceFeed);
        poolCount = 0;
    }

    /// @notice Creates a new liquidity pool for a token or REIT
    /// @param token Address of the PropertyToken or REITFactory contract
    /// @param tokenId ID of the token or REIT
    /// @return poolId Unique ID of the created pool
    function createPool(address token, uint256 tokenId) 
        external 
        onlyOwner 
        whenNotPaused 
        returns (bytes32 poolId) 
    {
        if (token != propertyToken && token != reitFactory) revert InvalidTokenContract();
        if (poolCount >= MAX_POOLS) revert ExceedsMaxPools();

        poolId = keccak256(abi.encodePacked(token, tokenId));
        if (pools[poolId].token != address(0)) revert PoolExists();

        Pool storage pool = pools[poolId];
        pool.token = token;
        pool.tokenId = tokenId;
        pool.tokenReserve = 0;
        pool.usdcReserve = 0;
        pool.totalLiquidity = 0;
        pool.accumulatedFees = 0;
        pool.lastRewardBlock = block.number;

        poolCount = poolCount.add(1);

        emit PoolCreated(token, tokenId, poolId);
    }

    /// @notice Adds liquidity to a pool
    /// @param poolId ID of the pool
    /// @param tokenAmount Amount of token shares to deposit
    /// @param usdcAmount Amount of USDC to deposit (6 decimals)
    /// @return liquidity Amount of liquidity shares minted
    function addLiquidity(bytes32 poolId, uint256 tokenAmount, uint256 usdcAmount) 
        external 
        whenNotPaused 
        nonReentrant 
        returns (uint256 liquidity) 
    {
        Pool storage pool = pools[poolId];
        if (pool.token == address(0)) revert InvalidPool();
        if (tokenAmount < MINIMUM_AMOUNT || usdcAmount < MINIMUM_AMOUNT) revert InvalidAmount();
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified();

        // Calculate liquidity shares
        if (pool.totalLiquidity == 0) {
            liquidity = tokenAmount.mul(usdcAmount).sqrt().sub(MINIMUM_LIQUIDITY);
            pool.liquidityBalance[address(0)] = MINIMUM_LIQUIDITY; // Lock minimum liquidity
        } else {
            liquidity = tokenAmount.mul(pool.totalLiquidity).div(pool.tokenReserve).min(
                usdcAmount.mul(pool.totalLiquidity).div(pool.usdcReserve)
            );
        }
        if (liquidity == 0) revert InsufficientLiquidity();

        // Transfer tokens
        if (pool.token == propertyToken) {
            IPropertyToken(propertyToken).transferShares(pool.tokenId, address(this), tokenAmount);
        } else {
            IReitFactory(reitFactory).transferShares(pool.tokenId, address(this), tokenAmount);
        }
        if (!IERC20(usdc).transferFrom(msg.sender, address(this), usdcAmount)) revert TransferFailed();

        // Update pool reserves
        pool.tokenReserve = pool.tokenReserve.add(tokenAmount);
        pool.usdcReserve = pool.usdcReserve.add(usdcAmount);
        pool.totalLiquidity = pool.totalLiquidity.add(liquidity);
        pool.liquidityBalance[msg.sender] = pool.liquidityBalance[msg.sender].add(liquidity);

        // Distribute $ASTR rewards
        _distributeRewards(poolId, msg.sender);

        emit LiquidityAdded(msg.sender, poolId, tokenAmount, usdcAmount, liquidity);
    }

    /// @notice Removes liquidity from a pool
    /// @param poolId ID of the pool
    /// @param liquidity Amount of liquidity shares to burn
    function removeLiquidity(bytes32 poolId, uint256 liquidity) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        Pool storage pool = pools[poolId];
        if (pool.token == address(0)) revert InvalidPool();
        if (pool.liquidityBalance[msg.sender] < liquidity) revert InsufficientLiquidity();
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified();

        // Calculate token and USDC amounts
        uint256 tokenAmount = liquidity.mul(pool.tokenReserve).div(pool.totalLiquidity);
        uint256 usdcAmount = liquidity.mul(pool.usdcReserve).div(pool.totalLiquidity);
        if (tokenAmount == 0 || usdcAmount == 0) revert InvalidAmount();

        // Update pool reserves
        pool.tokenReserve = pool.tokenReserve.sub(tokenAmount);
        pool.usdcReserve = pool.usdcReserve.sub(usdcAmount);
        pool.totalLiquidity = pool.totalLiquidity.sub(liquidity);
        pool.liquidityBalance[msg.sender] = pool.liquidityBalance[msg.sender].sub(liquidity);

        // Transfer tokens
        if (pool.token == propertyToken) {
            IPropertyToken(propertyToken).transferShares(pool.tokenId, msg.sender, tokenAmount);
        } else {
            IReitFactory(reitFactory).transferShares(pool.tokenId, msg.sender, tokenAmount);
        }
        if (!IERC20(usdc).transfer(msg.sender, usdcAmount)) revert TransferFailed();

        // Distribute $ASTR rewards
        _distributeRewards(poolId, msg.sender);

        emit LiquidityRemoved(msg.sender, poolId, tokenAmount, usdcAmount, liquidity);
    }

    /// @notice Swaps tokens using Chainlink Price Feed for pricing
    /// @param poolId ID of the pool
    /// @param tokenIn Address of the input token (token or USDC)
    /// @param amountIn Amount of input tokens
    /// @param minAmountOut Minimum output amount expected
    /// @return amountOut Amount of output tokens received
    function swap(bytes32 poolId, address tokenIn, uint256 amountIn, uint256 minAmountOut) 
        external 
        whenNotPaused 
        nonReentrant 
        returns (uint256 amountOut) 
    {
        Pool storage pool = pools[poolId];
        if (pool.token == address(0)) revert InvalidPool();
        if (amountIn < MINIMUM_AMOUNT) revert InvalidAmount();
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified();
        if (!IERC3643(complianceManager).restrictTransfer(msg.sender, address(this), amountIn)) revert TransferRestricted();

        // Get latest USDC/USD price from Chainlink
        (, int256 price, , , ) = priceFeed.latestRoundData();
        if (price <= 0) revert PriceFeedError();
        uint256 usdcPrice = uint256(price); // Assume 8 decimals for price feed

        bool isTokenToUsdc = tokenIn == pool.token;
        uint256 reserveIn = isTokenToUsdc ? pool.tokenReserve : pool.usdcReserve;
        uint256 reserveOut = isTokenToUsdc ? pool.usdcReserve : pool.tokenReserve;

        // Calculate amount out with 0.5% fee
        uint256 amountInWithFee = amountIn.mul(10000 - FEE_PERCENT).div(10000);
        amountOut = amountInWithFee.mul(reserveOut).div(reserveIn.add(amountInWithFee));
        if (amountOut < minAmountOut) revert InsufficientOutput();

        // Adjust amountOut based on USDC price (simplified, adjust for token valuation in production)
        if (isTokenToUsdc) {
            amountOut = amountOut.mul(10**8).div(usdcPrice); // Normalize to 6 decimals
        } else {
            amountInWithFee = amountInWithFee.mul(usdcPrice).div(10**8); // Normalize to token decimals
        }

        // Update reserves
        if (isTokenToUsdc) {
            pool.tokenReserve = pool.tokenReserve.add(amountIn);
            pool.usdcReserve = pool.usdcReserve.sub(amountOut);
            pool.accumulatedFees = pool.accumulatedFees.add(amountIn.mul(FEE_PERCENT).div(10000));
            if (pool.token == propertyToken) {
                IPropertyToken(propertyToken).transferShares(pool.tokenId, address(this), amountIn);
            } else {
                IReitFactory(reitFactory).transferShares(pool.tokenId, address(this), amountIn);
            }
            if (!IERC20(usdc).transfer(msg.sender, amountOut)) revert TransferFailed();
        } else {
            pool.usdcReserve = pool.usdcReserve.add(amountIn);
            pool.tokenReserve = pool.tokenReserve.sub(amountOut);
            pool.accumulatedFees = pool.accumulatedFees.add(amountIn.mul(FEE_PERCENT).div(10000));
            if (!IERC20(usdc).transferFrom(msg.sender, address(this), amountIn)) revert TransferFailed();
            if (pool.token == propertyToken) {
                IPropertyToken(propertyToken).transferShares(pool.tokenId, msg.sender, amountOut);
            } else {
                IReitFactory(reitFactory).transferShares(pool.tokenId, msg.sender, amountOut);
            }
        }

        emit Swap(msg.sender, poolId, tokenIn, amountIn, amountOut);
    }

    /// @notice Claims accumulated fees for a liquidity provider
    /// @param poolId ID of the pool
    function claimFees(bytes32 poolId) 
        external 
        nonReentrant 
    {
        Pool storage pool = pools[poolId];
        if (pool.token == address(0)) revert InvalidPool();
        if (pool.liquidityBalance[msg.sender] == 0) revert InsufficientLiquidity();

        uint256 feeShare = pool.accumulatedFees.mul(pool.liquidityBalance[msg.sender]).div(pool.totalLiquidity);
        if (feeShare == 0) revert NoFeesToClaim();

        pool.accumulatedFees = pool.accumulatedFees.sub(feeShare);
        if (!IERC20(usdc).transfer(msg.sender, feeShare)) revert TransferFailed();

        emit FeesClaimed(msg.sender, poolId, feeShare);
    }

    /// @notice Distributes $ASTR rewards to a liquidity provider
    /// @param poolId ID of the pool
    /// @param provider Address of the liquidity provider
    function _distributeRewards(bytes32 poolId, address provider) internal {
        Pool storage pool = pools[poolId];
        if (block.number <= pool.lastRewardBlock) return;
        if (pool.totalLiquidity == 0) return;

        uint256 blocksElapsed = block.number.sub(pool.lastRewardBlock);
        uint256 rewardAmount = blocksElapsed.mul(REWARD_RATE).mul(pool.liquidityBalance[provider]).div(pool.totalLiquidity);
        if (rewardAmount > 0) {
            IASTRToken(astrToken).mint(provider, rewardAmount);
            emit RewardsDistributed(provider, poolId, rewardAmount);
        }

        pool.lastRewardBlock = block.number;
    }

    /// @notice Allows the owner to withdraw tokens in an emergency
    /// @param token Address of the token to withdraw
    /// @param amount Amount to withdraw
    function emergencyWithdraw(address token, uint256 amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (token == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();

        if (token == usdc) {
            if (!IERC20(usdc).transfer(msg.sender, amount)) revert TransferFailed();
        } else {
            // Handle token shares if necessary (simplified for non-standard tokens)
            revert InvalidTokenContract();
        }

        emit EmergencyWithdrawal(msg.sender, token, amount);
    }

    /// @notice Pauses the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Retrieves pool details
    /// @param poolId ID of the pool
    /// @return token Token contract address
    /// @return tokenId Token or REIT ID
    /// @return tokenReserve Token reserve amount
    /// @return usdcReserve USDC reserve amount
    /// @return totalLiquidity Total liquidity shares
    /// @return accumulatedFees Accumulated USDC fees
    function getPoolDetails(bytes32 poolId)
        external
        view
        returns (
            address token,
            uint256 tokenId,
            uint256 tokenReserve,
            uint256 usdcReserve,
            uint256 totalLiquidity,
            uint256 accumulatedFees
        )
    {
        Pool storage pool = pools[poolId];
        if (pool.token == address(0)) revert InvalidPool();
        return (
            pool.token,
            pool.tokenId,
            pool.tokenReserve,
            pool.usdcReserve,
            pool.totalLiquidity,
            pool.accumulatedFees
        );
    }

    /// @notice Retrieves liquidity balance for a provider
    /// @param poolId ID of the pool
    /// @param provider Address of the liquidity provider
    /// @return liquidityBalance Amount of liquidity shares
    function getLiquidityBalance(bytes32 poolId, address provider) 
        external 
        view 
        returns (uint256 liquidityBalance) 
    {
        if (provider == address(0)) revert InvalidAddress();
        return pools[poolId].liquidityBalance[provider];
    }

    /// @notice Modifier to restrict access to the DAO
    modifier onlyDAO() {
        if (msg.sender != dao) revert onlyDAO();
        _;
    }
}
