const hre = require("hardhat");

async function main() {
  // Get signers
  const [deployer, farmer, transporter, warehouse, retailer] = await hre.ethers.getSigners();
  console.log(" Deployer address:", deployer.address);

  // Deploy the contract
  const FoodTrace = await hre.ethers.getContractFactory("FoodTrace");
  const foodTrace = await FoodTrace.deploy();
  await foodTrace.waitForDeployment();

  const address = await foodTrace.getAddress();
  console.log("FoodTrace deployed at:", address);

  // Add deployer as trusted agency
  const tx1 = await foodTrace.addTrustedAgency(deployer.address);
  await tx1.wait();
  console.log(" Deployer added as Trusted Agency");

  // Assign deployer as Admin
  const tx2 = await foodTrace.assignRole(deployer.address, 0);
  await tx2.wait();
  console.log(" Deployer assigned Role: Admin");

  // Assign roles to others
  const assignRoles = [
    { address: farmer.address, role: 1, name: "Farmer" },
    { address: transporter.address, role: 2, name: "Manufaturer" },
    { address: transporter.address, role: 3, name: "Transporter" },
    { address: warehouse.address, role: 4, name: "Warehouse" },
    { address: retailer.address, role: 5, name: "Retailer" },
  ];

  for (const user of assignRoles) {
    const tx = await foodTrace.assignRole(user.address, user.role);
    await tx.wait();
    console.log(` ${user.name} assigned role successfully`);
  }

  // Verification
  const isTrusted = await foodTrace.isTrusted(deployer.address);
  console.log(" Is deployer trusted agency? =>", isTrusted);

  const role = await foodTrace.userRoles(deployer.address);
  console.log(" Deployer's role =>", role.toString());

  // Create a test batch
  await foodTrace.addTrustedAgency(farmer.address); console.log(" Farmer added as Trusted Agency");
  const expiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 1 week from now
  const foodTraceAsFarmer = foodTrace.connect(farmer);
  const tx3 = await foodTraceAsFarmer.createBatch("Test Tomatoes", "Punjab", expiry);
  await tx3.wait();
  console.log(" Sample batch created with ID 0");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(" Deployment failed:", err);
    process.exit(1);
  });

