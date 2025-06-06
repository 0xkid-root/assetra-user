// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Interfaces
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

interface IChainlinkDataStreams {
    function getLatestPrice(uint256 tokenId) external view returns (uint256);
}

/// @title AssetraLending - A lending protocol for tokenized real estate assets
/// @notice Manages collateralized loans using PropertyToken or AssetraFactory shares, with USDC borrowing
contract AssetraLending is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Structs
    struct Loan {
        address borrower; // Address of the borrower
        address token; // PropertyToken or AssetraFactory contract address
        uint256 tokenId; // Token or REIT ID
        uint256 collateralAmount; // Amount of tokens locked as collateral
        uint256 borrowedAmount; // Amount borrowed in USDC (6 decimals)
        uint256 ltvRatio; // Current LTV ratio (in basis points, e.g., 8000 = 80%)
        uint256 interestRate; // Annual interest rate (in basis points)
        uint256 startTime; // Loan start timestamp
        bool active; // Loan status
    }

    // State Variables
    mapping(address => mapping(uint256 => Loan)) private loans; // Borrower => Loan ID => Loan
    mapping(address => uint256) private loanCount; // Borrower loan counter
    address public propertyToken; // PropertyToken contract
    address public AssetraFactory; // AssetraFactory contract
    address public complianceManager; // ComplianceManager contract
    address public usdc; // USDC token (6 decimals)
    address public dataStreams; // Chainlink Data Streams
    address public dao; // PropertyManagementDAO
    uint256 public constant MAX_LTV = 8000; // 80% max LTV (basis points)
    uint256 public constant LIQUIDATION_THRESHOLD = 9000; // 90% LTV triggers liquidation (basis points)
    uint256 public constant INTEREST_RATE = 500; // 5% annual interest (basis points)
    uint256 public constant LENDING_FEE = 100; // 1% fee (basis points)
    uint256 public constant SECONDS_PER_YEAR = 31536000; // Seconds in a year
    uint256 public constant MINIMUM_BORROW = 100 * 10**6; // Minimum borrow: $100 in USDC (6 decimals)
    uint256 public totalBorrowed; // Total USDC borrowed

    // Events
    event CollateralDeposited(address indexed borrower, uint256 indexed loanId, address token, uint256 tokenId, uint256 amount);
    event LoanBorrowed(address indexed borrower, uint256 indexed loanId, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 indexed loanId, uint256 amount);
    event LoanLiquidated(address indexed borrower, uint256 indexed loanId, uint256 collateralSold);
    event LTVUpdated(address indexed borrower, uint256 indexed loanId, uint256 newLTV);

    // Errors
    error InvalidToken();
    error InvalidAmount();
    error NotKYCVerified();
    error InvalidLoan();
    error ExceedsMaxBorrow();
    error InsufficientUSDC();
    error ExcessRepayment();
    error USDCTransferFailed();
    error LTVBelowThreshold();
    error OnlyDAO();
    error InvalidAddress();

    /// @notice Initializes the contract with external contract addresses
    /// @param _propertyToken Address of the PropertyToken contract
    /// @param _AssetraFactory Address of the AssetraFactory contract
    /// @param _complianceManager Address of the ComplianceManager contract
    /// @param _usdc Address of the USDC token contract
    /// @param _dataStreams Address of the Chainlink Data Streams contract
    /// @param _dao Address of the PropertyManagementDAO contract
    function initialize(
        address _propertyToken,
        address _AssetraFactory,
        address _complianceManager,
        address _usdc,
        address _dataStreams,
        address _dao
    ) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        if (_propertyToken == address(0)) revert InvalidAddress();
        if (_AssetraFactory == address(0)) revert InvalidAddress();
        if (_complianceManager == address(0)) revert InvalidAddress();
        if (_usdc == address(0)) revert InvalidAddress();
        if (_dataStreams == address(0)) revert InvalidAddress();
        if (_dao == address(0)) revert InvalidAddress();

        propertyToken = _propertyToken;
        AssetraFactory = _AssetraFactory;
        complianceManager = _complianceManager;
        usdc = _usdc;
        dataStreams = _dataStreams;
        dao = _dao;
    }

    /// @notice Deposits collateral to create a new loan
    /// @param token Address of the collateral token (PropertyToken or AssetraFactory)
    /// @param tokenId ID of the token or REIT
    /// @param amount Amount of tokens to deposit as collateral
    function depositCollateral(address token, uint256 tokenId, uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        if (token != propertyToken && token != AssetraFactory) revert InvalidToken();
        if (amount == 0) revert InvalidAmount();
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified();

        uint256 loanId = loanCount[msg.sender];
        loans[msg.sender][loanId] = Loan({
            borrower: msg.sender,
            token: token,
            tokenId: tokenId,
            collateralAmount: amount,
            borrowedAmount: 0,
            ltvRatio: 0,
            interestRate: INTEREST_RATE,
            startTime: block.timestamp,
            active: true
        });
        loanCount[msg.sender] = loanId.add(1);

        // Verify sufficient balance before transfer
        if (token == propertyToken) {
            if (IPropertyToken(propertyToken).balanceOf(tokenId, msg.sender) < amount) revert InvalidAmount();
            IPropertyToken(propertyToken).transferShares(tokenId, address(this), amount);
        } else {
            if (IAssetraFactory(AssetraFactory).balanceOf(tokenId, msg.sender) < amount) revert InvalidAmount();
            IAssetraFactory(AssetraFactory).transferShares(tokenId, address(this), amount);
        }

        emit CollateralDeposited(msg.sender, loanId, token, tokenId, amount);
    }

    /// @notice Borrows USDC against deposited collateral
    /// @param loanId ID of the loan
    /// @param amount Amount of USDC to borrow (6 decimals)
    function borrow(uint256 loanId, uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        Loan storage loan = loans[msg.sender][loanId];
        if (!loan.active) revert InvalidLoan();
        if (amount < MINIMUM_BORROW) revert InvalidAmount();
        if (!IERC3643(complianceManager).verifyIdentity(msg.sender)) revert NotKYCVerified();

        uint256 collateralValue = IChainlinkDataStreams(dataStreams).getLatestPrice(loan.tokenId);
        uint256 maxBorrow = collateralValue.mul(loan.collateralAmount).mul(MAX_LTV).div(10000);
        if (loan.borrowedAmount.add(amount) > maxBorrow) revert ExceedsMaxBorrow();

        uint256 fee = amount.mul(LENDING_FEE).div(10000);
        uint256 totalTransfer = amount.add(fee);
        if (IERC20(usdc).balanceOf(address(this)) < totalTransfer) revert InsufficientUSDC();

        loan.borrowedAmount = loan.borrowedAmount.add(amount);
        loan.ltvRatio = loan.borrowedAmount.mul(10000).div(collateralValue.mul(loan.collateralAmount));
        totalBorrowed = totalBorrowed.add(amount);

        if (!IERC20(usdc).transfer(msg.sender, amount)) revert USDCTransferFailed();
        if (!IERC20(usdc).transfer(dao, fee)) revert USDCTransferFailed();

        emit LoanBorrowed(msg.sender, loanId, amount);
    }

    /// @notice Repays a loan partially or fully
    /// @param loanId ID of the loan
    /// @param amount Amount of USDC to repay (6 decimals)
    function repay(uint256 loanId, uint256 amount) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        Loan storage loan = loans[msg.sender][loanId];
        if (!loan.active) revert InvalidLoan();
        if (amount == 0) revert InvalidAmount();

        uint256 interest = loan.borrowedAmount.mul(INTEREST_RATE).mul(block.timestamp.sub(loan.startTime)).div(SECONDS_PER_YEAR.mul(10000));
        uint256 totalOwed = loan.borrowedAmount.add(interest);
        if (amount > totalOwed) revert ExcessRepayment();

        if (!IERC20(usdc).transferFrom(msg.sender, address(this), amount)) revert USDCTransferFailed();

        uint256 amountApplied = amount > loan.borrowedAmount ? loan.borrowedAmount : amount;
        loan.borrowedAmount = totalOwed > amount ? totalOwed.sub(amount) : 0;
        loan.startTime = block.timestamp;
        totalBorrowed = totalBorrowed.sub(amountApplied);

        if (loan.borrowedAmount == 0) {
            loan.active = false;
            if (loan.token == propertyToken) {
                IPropertyToken(propertyToken).transferShares(loan.tokenId, msg.sender, loan.collateralAmount);
            } else {
                IAssetraFactory(AssetraFactory).transferShares(loan.tokenId, msg.sender, loan.collateralAmount);
            }
        }

        emit LoanRepaid(msg.sender, loanId, amount);
    }

    /// @notice Liquidates a loan if LTV exceeds the threshold
    /// @param borrower Address of the borrower
    /// @param loanId ID of the loan
    function liquidate(address borrower, uint256 loanId) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        Loan storage loan = loans[borrower][loanId];
        if (!loan.active) revert InvalidLoan();

        uint256 collateralValue = IChainlinkDataStreams(dataStreams).getLatestPrice(loan.tokenId);
        uint256 currentLTV = loan.borrowedAmount.mul(10000).div(collateralValue.mul(loan.collateralAmount));
        if (currentLTV < LIQUIDATION_THRESHOLD) revert LTVBelowThreshold();

        loan.active = false;
        totalBorrowed = totalBorrowed.sub(loan.borrowedAmount);

        // In production, implement collateral sale via DEX or auction
        emit LoanLiquidated(borrower, loanId, loan.collateralAmount);
    }

    /// @notice Updates the LTV ratio for a loan based on the latest price
    /// @param borrower Address of the borrower
    /// @param loanId ID of the loan
    function updateLTV(address borrower, uint256 loanId) 
        external 
        onlyDAO 
    {
        Loan storage loan = loans[borrower][loanId];
        if (!loan.active) revert InvalidLoan();

        uint256 collateralValue = IChainlinkDataStreams(dataStreams).getLatestPrice(loan.tokenId);
        loan.ltvRatio = loan.borrowedAmount.mul(10000).div(collateralValue.mul(loan.collateralAmount));

        emit LTVUpdated(borrower, loanId, loan.ltvRatio);
    }

    /// @notice Pauses the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Retrieves details of a loan
    /// @param borrower Address of the borrower
    /// @param loanId ID of the loan
    /// @return token Address of the collateral token
    /// @return tokenId ID of the token or REIT
    /// @return collateralAmount Amount of tokens locked
    /// @return borrowedAmount Amount borrowed in USDC
    /// @return ltvRatio Current LTV ratio (basis points)
    /// @return active Status of the loan
    function getLoanDetails(address borrower, uint256 loanId)
        external
        view
        returns (
            address token,
            uint256 tokenId,
            uint256 collateralAmount,
            uint256 borrowedAmount,
            uint256 ltvRatio,
            bool active
        )
    {
        Loan memory loan = loans[borrower][loanId];
        return (
            loan.token,
            loan.tokenId,
            loan.collateralAmount,
            loan.borrowedAmount,
            loan.ltvRatio,
            loan.active
        );
    }

    /// @notice Modifier to restrict access to the DAO
    modifier onlyDAO() {
        if (msg.sender != dao) revert OnlyDAO();
        _;
    }
}
