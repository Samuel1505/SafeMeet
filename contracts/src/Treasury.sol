// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Treasury
 * @notice Manages protocol fees, reserves, and fund distribution for SafeMeet
 * @dev Handles fee collection, reserve management, and multi-sig operations
 *
 * Features:
 * - Collect fees from puddles and yield router
 * - Manage protocol reserves
 * - Distribute funds for development, marketing, and operations
 * - Emergency withdrawal capabilities
 * - Multi-signature approval for large withdrawals
 */
contract Treasury is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct AllocationConfig {
        uint256 developmentFund; // Basis points (10000 = 100%)
        uint256 marketingFund; // Basis points
        uint256 operationsFund; // Basis points
        uint256 reserveFund; // Basis points
        uint256 buybackFund; // Basis points for GUI token buyback
    }

    struct WithdrawalRequest {
        address recipient;
        address token;
        uint256 amount;
        string purpose;
        uint256 requestTime;
        uint256 approvalCount;
        bool executed;
        mapping(address => bool) approvals;
    }

    // State variables
    AllocationConfig public allocationConfig;

    // Fund balances by category
    mapping(string => mapping(address => uint256)) public fundBalances; // category => token => balance

    // Authorized addresses (can receive funds)
    mapping(address => bool) public authorizedRecipients;

    // Multi-sig approvers for large withdrawals
    mapping(address => bool) public approvers;
    address[] public approverList;
    uint256 public requiredApprovals = 2;

    // Withdrawal requests
    mapping(uint256 => WithdrawalRequest) private withdrawalRequests;
    uint256 public withdrawalRequestCount;

    // Large withdrawal threshold (requires multi-sig)
    uint256 public largeWithdrawalThreshold = 10000 * 10 ** 6; // 10,000 USDC

    // Total fees collected
    mapping(address => uint256) public totalFeesCollected; // token => amount

    // Events
    event FeeReceived(
        address indexed from,
        address indexed token,
        uint256 amount
    );
    event FundsAllocated(address indexed token, uint256 amount);
    event FundsWithdrawn(
        address indexed recipient,
        address indexed token,
        uint256 amount,
        string category
    );
    event WithdrawalRequested(
        uint256 indexed requestId,
        address indexed recipient,
        address indexed token,
        uint256 amount
    );
    event WithdrawalApproved(
        uint256 indexed requestId,
        address indexed approver
    );
    event WithdrawalExecuted(uint256 indexed requestId);
    event ApproverAdded(address indexed approver);
    event ApproverRemoved(address indexed approver);
    event AllocationConfigUpdated(
        uint256 development,
        uint256 marketing,
        uint256 operations,
        uint256 reserve,
        uint256 buyback
    );
    event EmergencyWithdrawal(address indexed token, uint256 amount);

    /**
     * @notice Constructor to initialize the treasury
     * @param initialOwner Owner of the treasury
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        // Default allocation: 30% dev, 20% marketing, 20% ops, 20% reserve, 10% buyback
        allocationConfig = AllocationConfig({
            developmentFund: 3000,
            marketingFund: 2000,
            operationsFund: 2000,
            reserveFund: 2000,
            buybackFund: 1000
        });

        // Owner is automatically an approver
        approvers[initialOwner] = true;
        approverList.push(initialOwner);
    }

    /**
     * @notice Receives fees from protocol contracts
     * @param token Address of the token
     * @param amount Amount received
     */
    function receiveFees(
        address token,
        uint256 amount
    ) external nonReentrant whenNotPaused {
        require(amount > 0, "Treasury: zero amount");

        // Transfer tokens to treasury
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Allocate funds according to config
        _allocateFunds(token, amount);

        // Track total fees
        totalFeesCollected[token] += amount;

        emit FeeReceived(msg.sender, token, amount);
    }

    /**
     * @notice Internal function to allocate received funds
     */
    function _allocateFunds(address token, uint256 amount) internal {
        AllocationConfig memory config = allocationConfig;

        uint256 devAmount = (amount * config.developmentFund) / 10000;
        uint256 marketingAmount = (amount * config.marketingFund) / 10000;
        uint256 opsAmount = (amount * config.operationsFund) / 10000;
        uint256 reserveAmount = (amount * config.reserveFund) / 10000;
        uint256 buybackAmount = (amount * config.buybackFund) / 10000;

        fundBalances["development"][token] += devAmount;
        fundBalances["marketing"][token] += marketingAmount;
        fundBalances["operations"][token] += opsAmount;
        fundBalances["reserve"][token] += reserveAmount;
        fundBalances["buyback"][token] += buybackAmount;

        emit FundsAllocated(token, amount);
    }

    /**
     * @notice Withdraws funds from a specific category (small amounts, no approval needed)
     * @param category Fund category (development, marketing, operations, reserve, buyback)
     * @param token Token address
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function withdraw(
        string memory category,
        address token,
        uint256 amount,
        address recipient
    ) external nonReentrant whenNotPaused onlyOwner {
        require(amount > 0, "Treasury: zero amount");
        require(recipient != address(0), "Treasury: zero address");
        require(
            fundBalances[category][token] >= amount,
            "Treasury: insufficient balance"
        );
        require(
            amount < largeWithdrawalThreshold,
            "Treasury: amount too large, needs approval"
        );

        // Update balance
        fundBalances[category][token] -= amount;

        // Transfer tokens
        IERC20(token).safeTransfer(recipient, amount);

        emit FundsWithdrawn(recipient, token, amount, category);
    }

    /**
     * @notice Requests a large withdrawal (requires multi-sig approval)
     * @param category Fund category
     * @param token Token address
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     * @param purpose Purpose of withdrawal
     */
    function requestWithdrawal(
        string memory category,
        address token,
        uint256 amount,
        address recipient,
        string memory purpose
    ) external onlyOwner returns (uint256) {
        require(amount > 0, "Treasury: zero amount");
        require(recipient != address(0), "Treasury: zero address");
        require(
            fundBalances[category][token] >= amount,
            "Treasury: insufficient balance"
        );

        withdrawalRequestCount++;
        uint256 requestId = withdrawalRequestCount;

        WithdrawalRequest storage request = withdrawalRequests[requestId];
        request.recipient = recipient;
        request.token = token;
        request.amount = amount;
        request.purpose = purpose;
        request.requestTime = block.timestamp;
        request.approvalCount = 0;
        request.executed = false;

        emit WithdrawalRequested(requestId, recipient, token, amount);

        return requestId;
    }

    /**
     * @notice Approves a withdrawal request
     * @param requestId Request ID
     */
    function approveWithdrawal(uint256 requestId) external {
        require(approvers[msg.sender], "Treasury: not an approver");
        require(
            requestId <= withdrawalRequestCount,
            "Treasury: invalid request"
        );

        WithdrawalRequest storage request = withdrawalRequests[requestId];
        require(!request.executed, "Treasury: already executed");
        require(!request.approvals[msg.sender], "Treasury: already approved");

        request.approvals[msg.sender] = true;
        request.approvalCount++;

        emit WithdrawalApproved(requestId, msg.sender);
    }

    /**
     * @notice Executes an approved withdrawal request
     * @param requestId Request ID
     * @param category Fund category
     */
    function executeWithdrawal(
        uint256 requestId,
        string memory category
    ) external nonReentrant onlyOwner {
        require(
            requestId <= withdrawalRequestCount,
            "Treasury: invalid request"
        );

        WithdrawalRequest storage request = withdrawalRequests[requestId];
        require(!request.executed, "Treasury: already executed");
        require(
            request.approvalCount >= requiredApprovals,
            "Treasury: insufficient approvals"
        );
        require(
            fundBalances[category][request.token] >= request.amount,
            "Treasury: insufficient balance"
        );

        // Mark as executed
        request.executed = true;

        // Update balance
        fundBalances[category][request.token] -= request.amount;

        // Transfer tokens
        IERC20(request.token).safeTransfer(request.recipient, request.amount);

        emit WithdrawalExecuted(requestId);
        emit FundsWithdrawn(
            request.recipient,
            request.token,
            request.amount,
            category
        );
    }

    /**
     * @notice Emergency withdrawal (requires owner)
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address token,
        uint256 amount
    ) external nonReentrant onlyOwner {
        require(amount > 0, "Treasury: zero amount");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance >= amount, "Treasury: insufficient balance");

        IERC20(token).safeTransfer(owner(), amount);

        emit EmergencyWithdrawal(token, amount);
    }

    /**
     * @notice Emergency withdrawal of native ETH
     */
    function emergencyWithdrawETH() external nonReentrant onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Treasury: no ETH balance");

        payable(owner()).transfer(balance);

        emit EmergencyWithdrawal(address(0), balance);
    }

    // View functions

    /**
     * @notice Returns the balance of a specific fund category
     * @param category Fund category
     * @param token Token address
     */
    function getFundBalance(
        string memory category,
        address token
    ) external view returns (uint256) {
        return fundBalances[category][token];
    }

    /**
     * @notice Returns total balance across all categories for a token
     * @param token Token address
     */
    function getTotalBalance(address token) external view returns (uint256) {
        return
            fundBalances["development"][token] +
            fundBalances["marketing"][token] +
            fundBalances["operations"][token] +
            fundBalances["reserve"][token] +
            fundBalances["buyback"][token];
    }

    /**
     * @notice Returns all fund balances for a token
     * @param token Token address
     */
    function getAllBalances(
        address token
    )
        external
        view
        returns (
            uint256 development,
            uint256 marketing,
            uint256 operations,
            uint256 reserve,
            uint256 buyback
        )
    {
        return (
            fundBalances["development"][token],
            fundBalances["marketing"][token],
            fundBalances["operations"][token],
            fundBalances["reserve"][token],
            fundBalances["buyback"][token]
        );
    }

    /**
     * @notice Returns withdrawal request details
     * @param requestId Request ID
     */
    function getWithdrawalRequest(
        uint256 requestId
    )
        external
        view
        returns (
            address recipient,
            address token,
            uint256 amount,
            string memory purpose,
            uint256 requestTime,
            uint256 approvalCount,
            bool executed
        )
    {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        return (
            request.recipient,
            request.token,
            request.amount,
            request.purpose,
            request.requestTime,
            request.approvalCount,
            request.executed
        );
    }

    /**
     * @notice Checks if an address has approved a withdrawal request
     * @param requestId Request ID
     * @param approver Approver address
     */
    function hasApproved(
        uint256 requestId,
        address approver
    ) external view returns (bool) {
        return withdrawalRequests[requestId].approvals[approver];
    }

    /**
     * @notice Returns all approvers
     */
    function getApprovers() external view returns (address[] memory) {
        return approverList;
    }

    // Admin functions

    /**
     * @notice Adds an approver for multi-sig withdrawals
     * @param approver Address to add
     */
    function addApprover(address approver) external onlyOwner {
        require(approver != address(0), "Treasury: zero address");
        require(!approvers[approver], "Treasury: already approver");

        approvers[approver] = true;
        approverList.push(approver);

        emit ApproverAdded(approver);
    }

    /**
     * @notice Removes an approver
     * @param approver Address to remove
     */
    function removeApprover(address approver) external onlyOwner {
        require(approvers[approver], "Treasury: not an approver");
        require(
            approverList.length > requiredApprovals,
            "Treasury: too few approvers"
        );

        approvers[approver] = false;

        // Remove from array
        for (uint256 i = 0; i < approverList.length; i++) {
            if (approverList[i] == approver) {
                approverList[i] = approverList[approverList.length - 1];
                approverList.pop();
                break;
            }
        }

        emit ApproverRemoved(approver);
    }

    /**
     * @notice Updates required approval count
     * @param count New required approval count
     */
    function setRequiredApprovals(uint256 count) external onlyOwner {
        require(count > 0, "Treasury: invalid count");
        require(
            count <= approverList.length,
            "Treasury: exceeds approver count"
        );

        requiredApprovals = count;
    }

    /**
     * @notice Updates large withdrawal threshold
     * @param threshold New threshold amount
     */
    function setLargeWithdrawalThreshold(uint256 threshold) external onlyOwner {
        largeWithdrawalThreshold = threshold;
    }

    /**
     * @notice Updates allocation configuration
     * @param development Development fund allocation (basis points)
     * @param marketing Marketing fund allocation (basis points)
     * @param operations Operations fund allocation (basis points)
     * @param reserve Reserve fund allocation (basis points)
     * @param buyback Buyback fund allocation (basis points)
     */
    function setAllocationConfig(
        uint256 development,
        uint256 marketing,
        uint256 operations,
        uint256 reserve,
        uint256 buyback
    ) external onlyOwner {
        require(
            development + marketing + operations + reserve + buyback == 10000,
            "Treasury: must equal 100%"
        );

        allocationConfig = AllocationConfig({
            developmentFund: development,
            marketingFund: marketing,
            operationsFund: operations,
            reserveFund: reserve,
            buybackFund: buyback
        });

        emit AllocationConfigUpdated(
            development,
            marketing,
            operations,
            reserve,
            buyback
        );
    }

    /**
     * @notice Authorizes a recipient address
     * @param recipient Address to authorize
     */
    function authorizeRecipient(address recipient) external onlyOwner {
        require(recipient != address(0), "Treasury: zero address");
        authorizedRecipients[recipient] = true;
    }

    /**
     * @notice Removes authorization from a recipient
     * @param recipient Address to deauthorize
     */
    function removeRecipient(address recipient) external onlyOwner {
        authorizedRecipients[recipient] = false;
    }

    /**
     * @notice Pauses the treasury
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses the treasury
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Fallback to receive ETH
     */
    receive() external payable {}
}
