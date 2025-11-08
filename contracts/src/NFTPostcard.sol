// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title NFTPostcard
 * @notice ERC-721 contract for minting collectible postcards for SafeMeet milestones
 * @dev Issues NFTs for first-time depositors and various achievement milestones
 *
 * Features:
 * - Mint collectible postcards for achievements
 * - Different card types (First Deposit, Savings Milestone, Loyalty, etc.)
 * - On-chain metadata with customizable URIs
 * - Soulbound option (non-transferable)
 * - Rarity tiers
 */
contract NFTPostcard is ERC721, ERC721Enumerable, Pausable, Ownable {
    // Enums
    enum PostcardType {
        FIRST_DEPOSIT, // First deposit into any puddle
        SAVINGS_MILESTONE, // Reached savings goal
        LOYALTY_1_MONTH, // 1 month of consistent savings
        LOYALTY_6_MONTHS, // 6 months of consistent savings
        LOYALTY_1_YEAR, // 1 year of consistent savings
        GROUP_FOUNDER, // Created a puddle
        SUPER_SAVER, // High savings amount
        YIELD_MASTER, // Generated significant yield
        COMMUNITY_CHAMPION // Special community awards
    }

    enum Rarity {
        COMMON,
        RARE,
        EPIC,
        LEGENDARY
    }

    // Structs
    struct PostcardMetadata {
        PostcardType cardType;
        Rarity rarity;
        uint256 mintedAt;
        string message;
        address puddle; // Associated puddle (if applicable)
        bool isSoulbound; // Cannot be transferred
    }

    // State variables
    uint256 private _tokenIdCounter;

    // Mapping from token ID to metadata
    mapping(uint256 => PostcardMetadata) public postcardMetadata;

    // Mapping to track which cards a user has received
    mapping(address => mapping(PostcardType => bool)) public hasReceivedCard;

    // Mapping of authorized minters (puddle vaults, factory, etc.)
    mapping(address => bool) public authorizedMinters;

    // Base URI for metadata
    string private _baseTokenURI;

    // Card type to rarity mapping
    mapping(PostcardType => Rarity) public cardRarity;

    // Events
    event PostcardMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        PostcardType cardType,
        Rarity rarity
    );
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    event BaseURIUpdated(string newBaseURI);

    /**
     * @notice Constructor to initialize the NFT contract
     * @param initialOwner Owner of the contract
     */
    constructor(
        address initialOwner
    ) ERC721("SafeMeet Postcard", "SMPC") Ownable(initialOwner) {
        // Initialize rarity mappings
        cardRarity[PostcardType.FIRST_DEPOSIT] = Rarity.COMMON;
        cardRarity[PostcardType.SAVINGS_MILESTONE] = Rarity.COMMON;
        cardRarity[PostcardType.LOYALTY_1_MONTH] = Rarity.RARE;
        cardRarity[PostcardType.LOYALTY_6_MONTHS] = Rarity.EPIC;
        cardRarity[PostcardType.LOYALTY_1_YEAR] = Rarity.LEGENDARY;
        cardRarity[PostcardType.GROUP_FOUNDER] = Rarity.RARE;
        cardRarity[PostcardType.SUPER_SAVER] = Rarity.EPIC;
        cardRarity[PostcardType.YIELD_MASTER] = Rarity.EPIC;
        cardRarity[PostcardType.COMMUNITY_CHAMPION] = Rarity.LEGENDARY;
    }

    /**
     * @notice Mints a postcard NFT to a recipient
     * @param recipient Address to receive the NFT
     * @param cardType Type of postcard
     * @param message Custom message on the postcard
     * @param puddle Associated puddle address (use address(0) if none)
     * @param isSoulbound Whether the NFT is soulbound (non-transferable)
     */
    function mintPostcard(
        address recipient,
        PostcardType cardType,
        string memory message,
        address puddle,
        bool isSoulbound
    ) external whenNotPaused returns (uint256) {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "NFTPostcard: not authorized"
        );
        require(recipient != address(0), "NFTPostcard: zero address");

        // Check if user already has this card type (some cards are one-per-user)
        if (_isUniqueCard(cardType)) {
            require(
                !hasReceivedCard[recipient][cardType],
                "NFTPostcard: card already received"
            );
            hasReceivedCard[recipient][cardType] = true;
        }

        // Increment and get new token ID
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        // Mint the NFT
        _safeMint(recipient, tokenId);

        // Store metadata
        postcardMetadata[tokenId] = PostcardMetadata({
            cardType: cardType,
            rarity: cardRarity[cardType],
            mintedAt: block.timestamp,
            message: message,
            puddle: puddle,
            isSoulbound: isSoulbound
        });

        emit PostcardMinted(recipient, tokenId, cardType, cardRarity[cardType]);

        return tokenId;
    }

    /**
     * @notice Mints a first deposit postcard (convenience function)
     * @param recipient Address to receive the NFT
     * @param puddle Associated puddle address
     */
    function mintFirstDepositCard(
        address recipient,
        address puddle
    ) external whenNotPaused returns (uint256) {
        require(authorizedMinters[msg.sender], "NFTPostcard: not authorized");

        return
            this.mintPostcard(
                recipient,
                PostcardType.FIRST_DEPOSIT,
                "Welcome to SafeMeet! Your savings journey begins here.",
                puddle,
                false
            );
    }

    /**
     * @notice Checks if a card type is unique (one per user)
     */
    function _isUniqueCard(PostcardType cardType) internal pure returns (bool) {
        return
            cardType == PostcardType.FIRST_DEPOSIT ||
            cardType == PostcardType.LOYALTY_1_MONTH ||
            cardType == PostcardType.LOYALTY_6_MONTHS ||
            cardType == PostcardType.LOYALTY_1_YEAR;
    }

    /**
     * @notice Override transfer to enforce soulbound tokens
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting and burning
        if (from != address(0) && to != address(0)) {
            require(
                !postcardMetadata[tokenId].isSoulbound,
                "NFTPostcard: soulbound token"
            );
        }

        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Override for ERC721Enumerable
     */
    function _increaseBalance(
        address account,
        uint128 value
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    // View functions

    /**
     * @notice Returns the metadata for a postcard
     * @param tokenId Token ID
     */
    function getPostcardMetadata(
        uint256 tokenId
    )
        external
        view
        returns (
            PostcardType cardType,
            Rarity rarity,
            uint256 mintedAt,
            string memory message,
            address puddle,
            bool isSoulbound
        )
    {
        require(
            _ownerOf(tokenId) != address(0),
            "NFTPostcard: token does not exist"
        );
        PostcardMetadata memory metadata = postcardMetadata[tokenId];

        return (
            metadata.cardType,
            metadata.rarity,
            metadata.mintedAt,
            metadata.message,
            metadata.puddle,
            metadata.isSoulbound
        );
    }

    /**
     * @notice Returns all token IDs owned by an address
     * @param owner Address to query
     */
    function getTokensByOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokens;
    }

    /**
     * @notice Returns all postcards of a specific type owned by an address
     * @param owner Address to query
     * @param cardType Type of postcard
     */
    function getTokensByType(
        address owner,
        PostcardType cardType
    ) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256 count = 0;

        // Count matching tokens
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            if (postcardMetadata[tokenId].cardType == cardType) {
                count++;
            }
        }

        // Build array
        uint256[] memory tokens = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            if (postcardMetadata[tokenId].cardType == cardType) {
                tokens[index] = tokenId;
                index++;
            }
        }

        return tokens;
    }

    /**
     * @notice Checks if a user has received a specific card type
     * @param user Address to check
     * @param cardType Type of postcard
     */
    function hasCard(
        address user,
        PostcardType cardType
    ) external view returns (bool) {
        return hasReceivedCard[user][cardType];
    }

    /**
     * @notice Returns total number of postcards minted
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @notice Returns rarity distribution statistics
     */
    function getRarityStats()
        external
        view
        returns (uint256 common, uint256 rare, uint256 epic, uint256 legendary)
    {
        uint256 total = _tokenIdCounter;

        for (uint256 i = 1; i <= total; i++) {
            if (_ownerOf(i) != address(0)) {
                Rarity rarity = postcardMetadata[i].rarity;

                if (rarity == Rarity.COMMON) common++;
                else if (rarity == Rarity.RARE) rare++;
                else if (rarity == Rarity.EPIC) epic++;
                else if (rarity == Rarity.LEGENDARY) legendary++;
            }
        }

        return (common, rare, epic, legendary);
    }

    // Admin functions

    /**
     * @notice Authorizes an address to mint postcards
     * @param minter Address to authorize
     */
    function authorizeMinter(address minter) external onlyOwner {
        require(minter != address(0), "NFTPostcard: zero address");
        require(!authorizedMinters[minter], "NFTPostcard: already authorized");

        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @notice Revokes minting authorization
     * @param minter Address to revoke
     */
    function revokeMinter(address minter) external onlyOwner {
        require(authorizedMinters[minter], "NFTPostcard: not authorized");

        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    /**
     * @notice Sets the base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @notice Updates the rarity for a card type
     * @param cardType Type of postcard
     * @param rarity New rarity level
     */
    function setCardRarity(
        PostcardType cardType,
        Rarity rarity
    ) external onlyOwner {
        cardRarity[cardType] = rarity;
    }

    /**
     * @notice Pauses minting
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses minting
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // Override functions required by Solidity

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, uint256(tokenId)))
                : "";
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
