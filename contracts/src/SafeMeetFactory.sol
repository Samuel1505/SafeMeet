// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./PuddleVault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SafeMeetFactory
 * @notice Factory contract for deploying and managing SafeMeet puddle vaults
 * @dev Tracks all active group savings pools and provides discovery
 *
 * Features:
 * - Deploy new puddle vaults with custom parameters
 * - Track all active puddles
 * - Puddle discovery and querying
 * - Owner management and platform fees
 */
contract SafeMeetFactory is Ownable, Pausable {
    // Structs
    struct PuddleInfo {
        address puddleAddress;
        string name;
        address creator;
        address stablecoin;
        uint256 createdAt;
        uint256 lockPeriod;
        uint256 minDepositAmount;
        uint256 maxMembers;
        bool isActive;
    }

    // State variables
    address public yieldRouter;
    address public treasury;
    address public nftPostcard;
    address public guiToken;

    // Puddle tracking
    address[] public allPuddles;
    mapping(address => PuddleInfo) public puddleInfo;
    mapping(address => address[]) public userPuddles; // user => puddle addresses
    mapping(address => bool) public isPuddle;

    // Default parameters
    uint256 public defaultLockPeriod = 7 days;
    uint256 public defaultMinDeposit = 10 * 10 ** 6; // 10 USDC (6 decimals)
    uint256 public defaultMaxMembers = 100;

    // Creation fee (in native token, e.g., ETH on Base)
    uint256 public puddleCreationFee = 0.001 ether;

    // Statistics
    uint256 public totalPuddlesCreated;
    uint256 public activePuddlesCount;

    // Events
    event PuddleCreated(
        address indexed puddleAddress,
        address indexed creator,
        string name,
        address stablecoin,
        uint256 timestamp
    );
    event PuddleDeactivated(address indexed puddleAddress);
    event YieldRouterUpdated(address indexed newRouter);
    event TreasuryUpdated(address indexed newTreasury);
    event CreationFeeUpdated(uint256 newFee);
    event DefaultParametersUpdated(
        uint256 lockPeriod,
        uint256 minDeposit,
        uint256 maxMembers
    );

    /**
     * @notice Constructor to initialize the factory
     * @param initialOwner Owner of the factory
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Creates a new puddle vault
     * @param name Name of the puddle
     * @param stablecoin Address of the stablecoin to use
     * @param lockPeriod Lock period in seconds (0 to use default)
     * @param minDepositAmount Minimum deposit amount (0 to use default)
     * @param maxMembers Maximum number of members (0 to use default)
     * @return puddleAddress Address of the newly created puddle
     */
    function createPuddle(
        string memory name,
        address stablecoin,
        uint256 lockPeriod,
        uint256 minDepositAmount,
        uint256 maxMembers
    ) external payable whenNotPaused returns (address puddleAddress) {
        require(bytes(name).length > 0, "SafeMeetFactory: empty name");
        require(stablecoin != address(0), "SafeMeetFactory: zero address");
        require(
            msg.value >= puddleCreationFee,
            "SafeMeetFactory: insufficient fee"
        );

        // Use defaults if parameters are zero
        uint256 _lockPeriod = lockPeriod == 0 ? defaultLockPeriod : lockPeriod;
        uint256 _minDeposit = minDepositAmount == 0
            ? defaultMinDeposit
            : minDepositAmount;
        uint256 _maxMembers = maxMembers == 0 ? defaultMaxMembers : maxMembers;

        // Deploy new puddle vault with factory as temporary owner
        PuddleVault puddle = new PuddleVault(
            name,
            stablecoin,
            address(this),
            address(this),
            _lockPeriod,
            _minDeposit,
            _maxMembers
        );

        puddleAddress = address(puddle);

        // Set puddle configuration (factory is owner at this point)
        if (yieldRouter != address(0)) {
            puddle.setYieldRouter(yieldRouter);
        }
        if (treasury != address(0)) {
            puddle.setTreasury(treasury);
        }
        if (nftPostcard != address(0)) {
            puddle.setNFTPostcard(nftPostcard);
        }

        // Transfer ownership to the creator
        puddle.transferOwnership(msg.sender);

        // Store puddle information
        puddleInfo[puddleAddress] = PuddleInfo({
            puddleAddress: puddleAddress,
            name: name,
            creator: msg.sender,
            stablecoin: stablecoin,
            createdAt: block.timestamp,
            lockPeriod: _lockPeriod,
            minDepositAmount: _minDeposit,
            maxMembers: _maxMembers,
            isActive: true
        });

        // Track puddle
        allPuddles.push(puddleAddress);
        userPuddles[msg.sender].push(puddleAddress);
        isPuddle[puddleAddress] = true;

        // Update statistics
        totalPuddlesCreated++;
        activePuddlesCount++;

        // Transfer creation fee to treasury
        if (treasury != address(0) && msg.value > 0) {
            payable(treasury).transfer(msg.value);
        }

        emit PuddleCreated(
            puddleAddress,
            msg.sender,
            name,
            stablecoin,
            block.timestamp
        );

        return puddleAddress;
    }

    /**
     * @notice Creates a puddle with default parameters
     * @param name Name of the puddle
     * @param stablecoin Address of the stablecoin to use
     * @return puddleAddress Address of the newly created puddle
     */
    function createPuddleWithDefaults(
        string memory name,
        address stablecoin
    ) external payable whenNotPaused returns (address) {
        return this.createPuddle{value: msg.value}(name, stablecoin, 0, 0, 0);
    }

    /**
     * @notice Deactivates a puddle (only owner or puddle creator)
     * @param puddleAddress Address of the puddle to deactivate
     */
    function deactivatePuddle(address puddleAddress) external {
        require(isPuddle[puddleAddress], "SafeMeetFactory: not a puddle");
        PuddleInfo storage info = puddleInfo[puddleAddress];
        require(
            msg.sender == owner() || msg.sender == info.creator,
            "SafeMeetFactory: not authorized"
        );
        require(info.isActive, "SafeMeetFactory: already inactive");

        info.isActive = false;
        activePuddlesCount--;

        // Note: The puddle owner should pause the contract themselves if needed
        // Factory can only mark it as inactive in the registry

        emit PuddleDeactivated(puddleAddress);
    }

    // View functions

    /**
     * @notice Returns all puddle addresses
     * @return Array of all puddle addresses
     */
    function getAllPuddles() external view returns (address[] memory) {
        return allPuddles;
    }

    /**
     * @notice Returns all active puddle addresses
     * @return Array of active puddle addresses
     */
    function getActivePuddles() external view returns (address[] memory) {
        address[] memory active = new address[](activePuddlesCount);
        uint256 index = 0;

        for (uint256 i = 0; i < allPuddles.length; i++) {
            if (puddleInfo[allPuddles[i]].isActive) {
                active[index] = allPuddles[i];
                index++;
            }
        }

        return active;
    }

    /**
     * @notice Returns puddles created by a specific user
     * @param user Address of the user
     * @return Array of puddle addresses
     */
    function getUserPuddles(
        address user
    ) external view returns (address[] memory) {
        return userPuddles[user];
    }

    /**
     * @notice Returns detailed information about a puddle
     * @param puddleAddress Address of the puddle
     * @return info Puddle information struct
     */
    function getPuddleInfo(
        address puddleAddress
    ) external view returns (PuddleInfo memory) {
        require(isPuddle[puddleAddress], "SafeMeetFactory: not a puddle");
        return puddleInfo[puddleAddress];
    }

    /**
     * @notice Returns paginated list of puddles
     * @param offset Starting index
     * @param limit Number of puddles to return
     * @return puddles Array of puddle addresses
     */
    function getPuddlesPaginated(
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory puddles) {
        require(
            offset < allPuddles.length,
            "SafeMeetFactory: offset out of bounds"
        );

        uint256 end = offset + limit;
        if (end > allPuddles.length) {
            end = allPuddles.length;
        }

        puddles = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            puddles[i - offset] = allPuddles[i];
        }

        return puddles;
    }

    /**
     * @notice Returns the total number of puddles
     * @return Total number of puddles created
     */
    function getPuddleCount() external view returns (uint256) {
        return allPuddles.length;
    }

    /**
     * @notice Checks if an address is a valid puddle
     * @param puddleAddress Address to check
     * @return True if it's a puddle created by this factory
     */
    function isValidPuddle(address puddleAddress) external view returns (bool) {
        return isPuddle[puddleAddress];
    }

    /**
     * @notice Returns puddles by stablecoin
     * @param stablecoin Address of the stablecoin
     * @return Array of puddle addresses using this stablecoin
     */
    function getPuddlesByStablecoin(
        address stablecoin
    ) external view returns (address[] memory) {
        uint256 count = 0;

        // Count matching puddles
        for (uint256 i = 0; i < allPuddles.length; i++) {
            if (
                puddleInfo[allPuddles[i]].stablecoin == stablecoin &&
                puddleInfo[allPuddles[i]].isActive
            ) {
                count++;
            }
        }

        // Build array
        address[] memory result = new address[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < allPuddles.length; i++) {
            if (
                puddleInfo[allPuddles[i]].stablecoin == stablecoin &&
                puddleInfo[allPuddles[i]].isActive
            ) {
                result[index] = allPuddles[i];
                index++;
            }
        }

        return result;
    }

    // Admin functions

    /**
     * @notice Sets the yield router address for new puddles
     * @param _yieldRouter Address of the yield router
     */
    function setYieldRouter(address _yieldRouter) external onlyOwner {
        require(_yieldRouter != address(0), "SafeMeetFactory: zero address");
        yieldRouter = _yieldRouter;
        emit YieldRouterUpdated(_yieldRouter);
    }

    /**
     * @notice Sets the treasury address
     * @param _treasury Address of the treasury
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "SafeMeetFactory: zero address");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    /**
     * @notice Sets the NFT postcard contract address
     * @param _nftPostcard Address of the NFT contract
     */
    function setNFTPostcard(address _nftPostcard) external onlyOwner {
        require(_nftPostcard != address(0), "SafeMeetFactory: zero address");
        nftPostcard = _nftPostcard;
    }

    /**
     * @notice Sets the GUI token address
     * @param _guiToken Address of the GUI token
     */
    function setGUIToken(address _guiToken) external onlyOwner {
        require(_guiToken != address(0), "SafeMeetFactory: zero address");
        guiToken = _guiToken;
    }

    /**
     * @notice Updates the puddle creation fee
     * @param newFee New creation fee in wei
     */
    function setPuddleCreationFee(uint256 newFee) external onlyOwner {
        puddleCreationFee = newFee;
        emit CreationFeeUpdated(newFee);
    }

    /**
     * @notice Updates default parameters for new puddles
     * @param _lockPeriod Default lock period
     * @param _minDeposit Default minimum deposit
     * @param _maxMembers Default maximum members
     */
    function setDefaultParameters(
        uint256 _lockPeriod,
        uint256 _minDeposit,
        uint256 _maxMembers
    ) external onlyOwner {
        require(_lockPeriod > 0, "SafeMeetFactory: invalid lock period");
        require(_minDeposit > 0, "SafeMeetFactory: invalid min deposit");
        require(_maxMembers > 0, "SafeMeetFactory: invalid max members");

        defaultLockPeriod = _lockPeriod;
        defaultMinDeposit = _minDeposit;
        defaultMaxMembers = _maxMembers;

        emit DefaultParametersUpdated(_lockPeriod, _minDeposit, _maxMembers);
    }

    /**
     * @notice Pauses puddle creation
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses puddle creation
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Withdraws accumulated fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "SafeMeetFactory: no balance");
        payable(owner()).transfer(balance);
    }

    /**
     * @notice Fallback to receive ETH
     */
    receive() external payable {}
}
