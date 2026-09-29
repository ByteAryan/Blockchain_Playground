const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const initialSupply = hre.ethers.parseUnits("100000", 18);

  console.log("Deploying with account:", deployer.address);

  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy(deployer.address, initialSupply);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("MyToken deployed to:", address);

  // Verify on Etherscan for public networks
  if (hre.network.name === "sepolia") {
    console.log("Waiting for confirmations before verifying...");
    await token.deploymentTransaction().wait(5);
    await hre.run("verify:verify", {
      address,
      constructorArguments: [deployer.address, initialSupply],
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
