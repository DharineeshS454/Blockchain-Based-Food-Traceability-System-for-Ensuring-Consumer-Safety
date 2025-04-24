// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FoodTrace {
    enum Role { None, Farmer, Manufaturer, Transporter, Warehouse, Retailer, Consumer }
    enum EventType { Harvested, Processed, Packed, Transported, Stored, Sold }

    struct Batch {
        uint256 id;
        string name;
        address currentOwner;
        string location;
        uint256 timestamp;
        uint256 expiryDate;
    }

    struct Event {
        uint256 batchId;
        EventType eventType;
        string location;
        uint256 timestamp;
        string additionalData;
    }

    uint256 public nextBatchId;
    address public admin;

    mapping(address => Role) public userRoles;
    mapping(address => bool) public trustedAgencies;
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => Event[]) public batchEvents;
    mapping(address => uint256[]) public userBatches;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyTrusted() {
        require(trustedAgencies[msg.sender], "Not trusted agency");
        _;
    }


    event BatchCreated(uint256 batchId, string name, address indexed owner);
    event BatchEvent(uint256 batchId, EventType eventType, string location);
    

    constructor() {
        admin = msg.sender;
        trustedAgencies[msg.sender] = true;
    }

    // 🔐 Role Management
    function assignRole(address user, Role role) external onlyAdmin {
        userRoles[user] = role;
    }

    function addTrustedAgency(address agency) external onlyAdmin {
        trustedAgencies[agency] = true;
    }

    function removeTrustedAgency(address agency) external onlyAdmin {
        trustedAgencies[agency] = false;
    }

    // 🛠 Batch Operations
    function createBatch(
        string memory name,
        string memory location,
        uint256 expiryDate
    ) external onlyTrusted {
        require(userRoles[msg.sender] == Role.Farmer, "Only Farmer can create batches");

        uint256 batchId = nextBatchId++;
        batches[batchId] = Batch(batchId, name, msg.sender, location, block.timestamp, expiryDate);
        userBatches[msg.sender].push(batchId);
        emit BatchCreated(batchId, name, msg.sender);
    }


    function addBatchEvent(
        uint256 batchId,
        EventType eventType,
        string memory location,
        string memory additionalData
        ) external onlyTrusted {
            require(!isBatchExpired(batchId), "Batch expired");
            //Role-based restrictions:
            if (eventType == EventType.Harvested ) {
                require(userRoles[msg.sender] == Role.Farmer, "Only Farmer can add this event");
            } else if (eventType == EventType.Processed || eventType == EventType.Packed) {
                require(userRoles[msg.sender] == Role.Manufaturer, "Only Manufaturer can add this event");
            } else if (eventType == EventType.Transported) {
                require(userRoles[msg.sender] == Role.Transporter, "Only Transporter can add this event");
            } else if (eventType == EventType.Stored) {
                require(userRoles[msg.sender] == Role.Warehouse, "Only Warehouse can add this event");
            } else if (eventType == EventType.Sold ) {
                require(userRoles[msg.sender] == Role.Retailer, "Only Retailer can add this event");
            }
            batchEvents[batchId].push(Event(batchId, eventType, location, block.timestamp, additionalData));
            emit BatchEvent(batchId, eventType, location);
        }


    // ✅ Extra Logic
    function isBatchExpired(uint256 batchId) public view returns (bool) {
        return block.timestamp > batches[batchId].expiryDate;
    }

    // 🧾 Getters
    function getBatch(uint256 batchId) external view returns (Batch memory) {
        return batches[batchId];
    }

    function getEvents(uint256 batchId) external view returns (Event[] memory) {
        return batchEvents[batchId];
    }

    function getUserBatches(address user) external view returns (uint256[] memory) {
        return userBatches[user];
    }

    function getRole(address user) external view returns (Role) {
        return userRoles[user];
    }

    function isTrusted(address agency) external view returns (bool) {
        return trustedAgencies[agency];
    }

    function getBatchDetails(uint256 batchId) public view returns (
        string memory name,
        address currentOwner,
        string memory location,
        uint256 expiryDate
    ) {
        Batch memory batch = batches[batchId];
        return (
            batch.name,
            batch.currentOwner,
            batch.location,
            batch.expiryDate
        );
    }
}
