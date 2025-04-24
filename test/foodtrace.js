const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FoodTrace Contract", function () {
  let foodTrace;
  let admin;
  let trustedAgency;
  let nonTrustedAgency;

  beforeEach(async function () {
    // Get signers (admin, trusted agency, non-trusted agency)
    [admin, trustedAgency, nonTrustedAgency] = await ethers.getSigners();

    // Deploy the FoodTrace contract
    const FoodTrace = await ethers.getContractFactory("FoodTrace");
    foodTrace = await FoodTrace.deploy();

    // Add the deployer (admin) as a trusted agency
    await foodTrace.addTrustedAgency(admin.address);
  });

  it("should deploy the contract and set the deployer as trusted", async function () {
    // Check if the deployer is a trusted agency
    const isTrusted = await foodTrace.isTrusted(admin.address);
    expect(isTrusted).to.be.true;
  });

  it("should assign roles correctly and restrict actions based on roles", async function () {
    // Add the trusted agency and assign a role
    await foodTrace.addTrustedAgency(trustedAgency.address);
    await foodTrace.assignRole(trustedAgency.address, 1); // Role: Farmer

    // Verify the assigned role (Farmer)
    const role = await foodTrace.getRole(trustedAgency.address);
    expect(role).to.equal(1); // Farmer role

    // Try to create a batch as the trusted agency (should be allowed)
    await foodTrace.connect(trustedAgency).createBatch("Batch 1", "Location 1", 1633024800, "metadataHash");

    // Try to create a batch as non-trusted agency (should fail)
    await expect(
      foodTrace.connect(nonTrustedAgency).createBatch("Batch 2", "Location 2", 1633024800, "metadataHash")
    ).to.be.revertedWith("Not trusted agency");
  });

  it("should create, transfer ownership, and archive a batch", async function () {
    // Add trusted agency and create a batch
    await foodTrace.addTrustedAgency(trustedAgency.address);
    await foodTrace.connect(trustedAgency).createBatch("Batch 1", "Location 1", 1633024800, "metadataHash");

    // Get the batch details and verify
    const batch = await foodTrace.getBatch(0);
    expect(batch.name).to.equal("Batch 1");
    expect(batch.currentOwner).to.equal(trustedAgency.address);

    // Transfer ownership of the batch
    await foodTrace.connect(trustedAgency).transferOwnership(0, nonTrustedAgency.address);

    // Verify ownership transfer
    const updatedBatch = await foodTrace.getBatch(0);
    expect(updatedBatch.currentOwner).to.equal(nonTrustedAgency.address);

    // Archive the batch
    await foodTrace.connect(nonTrustedAgency).archiveBatch(0);

    // Verify the batch is archived
    const archivedBatch = await foodTrace.getBatch(0);
    expect(archivedBatch.isArchived).to.be.true;
  });

  it("should add and retrieve batch events", async function () {
    // Add trusted agency and create a batch
    await foodTrace.addTrustedAgency(trustedAgency.address);
    await foodTrace.connect(trustedAgency).createBatch("Batch 1", "Location 1", 1633024800, "metadataHash");

    // Add an event for the batch
    await foodTrace.connect(trustedAgency).addBatchEvent(0, 1, "Location 1", "Harvested event");

    // Retrieve the events for the batch
    const events = await foodTrace.getEvents(0);

    // Verify the event details
    expect(events.length).to.equal(1);
    expect(events[0].eventType).to.equal(1); // Harvested event
    expect(events[0].location).to.equal("Location 1");
  });

  it("should add and remove trusted agencies", async function () {
    // Add a new trusted agency
    await foodTrace.addTrustedAgency(trustedAgency.address);
    let isTrusted = await foodTrace.isTrusted(trustedAgency.address);
    expect(isTrusted).to.be.true;

    // Remove the trusted agency
    await foodTrace.removeTrustedAgency(trustedAgency.address);
    isTrusted = await foodTrace.isTrusted(trustedAgency.address);
    expect(isTrusted).to.be.false;
  });
});
