const hre = require("hardhat");

async function main() {
  console.log("Deploying ProductiveMiner contract...");

  // Get the contract factory
  const ProductiveMiner = await hre.ethers.getContractFactory("ProductiveMiner");
  
  // Deploy the contract
  const productiveMiner = await ProductiveMiner.deploy();
  
  // Wait for deployment to finish
  await productiveMiner.deployed();

  console.log("ProductiveMiner deployed to:", productiveMiner.address);
  
  // Log deployment information
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", productiveMiner.address);
  console.log("Deployer:", (await hre.ethers.getSigners())[0].address);
  
  // Verify contract on Etherscan (if not on localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await productiveMiner.deployTransaction.wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: productiveMiner.address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: productiveMiner.address,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };
  
  console.log("Deployment completed successfully!");
  console.log("Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 