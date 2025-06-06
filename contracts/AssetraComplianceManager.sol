// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

// Interfaces
interface ISecuritize {
    function isVerified(address account) external view returns (bool);
    function getInvestorDetails(address account) external view returns (bytes memory);
}

/// @title AssetraComplianceManager - Manages KYC/AML compliance and transfer restrictions
/// @notice Handles identity verification, transfer restrictions, and audit logging for a tokenized real estate platform
contract AssetraComplianceManager is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    // Structs
    struct AuditLog {
        address account; // Account associated with the action
        uint256 timestamp; // Timestamp of the action
        string action; // Action type (e.g., "KYCVerified", "TransferRestricted")
        bytes details; // Additional data (e.g., Securitize response or transfer details)
    }

    // State Variables
    mapping(address => bool) private verifiedIdentities; // KYC/AML status
    mapping(address => mapping(address => bool)) private transferRestrictions; // from => to => restricted
    mapping(uint256 => AuditLog) private auditLogs; // Log ID => AuditLog
    uint256 private auditLogCount; // Incremental log ID
    address public securitize; // Securitize contract or API proxy
    address public dao; // PropertyManagementDAO
    string[] private jurisdictions; // Supported jurisdictions (e.g., "US", "SG")
    uint256 public constant MAX_TRANSFER_AMOUNT = 1_000_000 * 10**6; // $1M USDC equivalent (6 decimals)
    uint256 public constant MAX_JURISDICTIONS = 50; // Max supported jurisdictions
    uint256 public constant MIN_LOG_COUNT = 1; // Starting index for audit logs

    // Events
    event IdentityVerified(address indexed account, uint256 timestamp);
    event TransferRestricted(address indexed from, address indexed to, uint256 timestamp);
    event AuditLogCreated(uint256 indexed logId, address indexed account, string action);
    event JurisdictionAdded(string indexed jurisdiction);
    event JurisdictionRemoved(string indexed jurisdiction);

    // Errors
    error InvalidAddress();
    error NotDAO();
    error JurisdictionExists();
    error JurisdictionNotFound();
    error ExceedsMaxJurisdictions();
    error InvalidAction();
    error EmptyJurisdiction();

    /// @notice Initializes the contract with external contract addresses
    /// @param _securitize Address of the Securitize contract or API proxy
    /// @param _dao Address of the PropertyManagementDAO contract
    function initialize(address _securitize, address _dao) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        if (_securitize == address(0)) revert InvalidAddress();
        if (_dao == address(0)) revert InvalidAddress();

        securitize = _securitize;
        dao = _dao;
        jurisdictions.push("US");
        jurisdictions.push("SG");
        auditLogCount = MIN_LOG_COUNT;
    }

    /// @notice Verifies if an account is KYC/AML compliant
    /// @param account Address to verify
    /// @return isVerified True if the account is verified
    function verifyIdentity(address account) external view returns (bool isVerified) {
        if (account == address(0)) revert InvalidAddress();
        return verifiedIdentities[account] || ISecuritize(securitize).isVerified(account);
    }

    /// @notice Updates the KYC/AML status of an account
    /// @param account Address to update
    /// @param verified New KYC/AML status
    function updateKYCStatus(address account, bool verified) 
        external 
        onlyOwner 
        whenNotPaused 
        nonReentrant 
    {
        if (account == address(0)) revert InvalidAddress();

        verifiedIdentities[account] = verified;

        string memory action = verified ? "KYCVerified" : "KYCRevoked";
        auditLogs[auditLogCount] = AuditLog({
            account: account,
            timestamp: block.timestamp,
            action: action,
            details: ISecuritize(securitize).getInvestorDetails(account)
        });
        emit AuditLogCreated(auditLogCount, account, action);
        auditLogCount = auditLogCount + 1;

        if (verified) {
            emit IdentityVerified(account, block.timestamp);
        }
    }

    /// @notice Checks if a transfer is allowed based on compliance rules
    /// @param from Sender address
    /// @param to Recipient address
    /// @param amount Amount to transfer (in USDC, 6 decimals)
    /// @return isAllowed True if the transfer is allowed
    function restrictTransfer(address from, address to, uint256 amount) 
        external 
        view 
        returns (bool isAllowed) 
    {
        if (from == address(0) || to == address(0)) revert InvalidAddress();
        if (!verifiedIdentities[from] || !verifiedIdentities[to]) {
            return false;
        }
        if (transferRestrictions[from][to]) {
            return false;
        }
        if (amount > MAX_TRANSFER_AMOUNT) {
            return false;
        }
        return true;
    }

    /// @notice Sets a transfer restriction between two addresses
    /// @param from Sender address
    /// @param to Recipient address
    /// @param restricted True to restrict transfers, false to allow
    function setTransferRestriction(address from, address to, bool restricted) 
        external 
        onlyDAO 
        whenNotPaused 
        nonReentrant 
    {
        if (from == address(0) || to == address(0)) revert InvalidAddress();

        transferRestrictions[from][to] = restricted;

        string memory action = restricted ? "TransferRestricted" : "TransferAllowed";
        auditLogs[auditLogCount] = AuditLog({
            account: from,
            timestamp: block.timestamp,
            action: action,
            details: abi.encode(to)
        });
        emit AuditLogCreated(auditLogCount, from, action);
        auditLogCount = auditLogCount + 1;

        if (restricted) {
            emit TransferRestricted(from, to, block.timestamp);
        }
    }

    /// @notice Adds a new jurisdiction to the supported list
    /// @param jurisdiction Jurisdiction code (e.g., "US", "SG")
    function addJurisdiction(string memory jurisdiction) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        if (bytes(jurisdiction).length == 0) revert EmptyJurisdiction();
        if (jurisdictions.length >= MAX_JURISDICTIONS) revert ExceedsMaxJurisdictions();

        for (uint256 i = 0; i < jurisdictions.length; i++) {
            if (keccak256(bytes(jurisdictions[i])) == keccak256(bytes(jurisdiction))) {
                revert JurisdictionExists();
            }
        }

        jurisdictions.push(jurisdiction);
        emit JurisdictionAdded(jurisdiction);
    }

    /// @notice Removes a jurisdiction from the supported list
    /// @param jurisdiction Jurisdiction code to remove
    function removeJurisdiction(string memory jurisdiction) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        if (bytes(jurisdiction).length == 0) revert EmptyJurisdiction();

        for (uint256 i = 0; i < jurisdictions.length; i++) {
            if (keccak256(bytes(jurisdictions[i])) == keccak256(bytes(jurisdiction))) {
                jurisdictions[i] = jurisdictions[jurisdictions.length - 1];
                jurisdictions.pop();
                emit JurisdictionRemoved(jurisdiction);
                return;
            }
        }
        revert JurisdictionNotFound();
    }

    /// @notice Retrieves the audit trail for an account
    /// @param account Address to retrieve audit logs for
    /// @return logs Array of audit logs associated with the account
    function generateAuditTrail(address account) 
        external 
        view 
        returns (AuditLog[] memory logs) 
    {
        if (account == address(0)) revert InvalidAddress();

        uint256 count = 0;
        for (uint256 i = MIN_LOG_COUNT; i < auditLogCount; i++) {
            if (auditLogs[i].account == account) {
                count++;
            }
        }

        logs = new AuditLog[](count);
        uint256 index = 0;
        for (uint256 i = MIN_LOG_COUNT; i < auditLogCount; i++) {
            if (auditLogs[i].account == account) {
                logs[index] = auditLogs[i];
                index++;
            }
        }
    }

    /// @notice Pauses the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Retrieves the list of supported jurisdictions
    /// @return jurisdictionList Array of supported jurisdiction codes
    function getJurisdictions() 
        external 
        view 
        returns (string[] memory jurisdictionList) 
    {
        return jurisdictions;
    }

    /// @notice Modifier to restrict access to the DAO
    modifier onlyDAO() {
        if (msg.sender != dao) revert NotDAO();
        _;
    }
}
