const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ProductiveMiner to Sepolia Testnet...\n");

  // Check environment variables
  const requiredEnvVars = [
    'SEPOLIA_URL',
    'SEPOLIA_PRIVATE_KEY',
    'ETHERSCAN_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error("\nPlease set these variables in your .env file");
    console.error("Run: node scripts/setup-testnet.js for setup instructions");
    process.exit(1);
  }

  console.log("✅ Environment variables configured");

  // Get the contract factory
  const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
  
  console.log("📦 Contract factory loaded");

  // Estimate deployment cost
  const deploymentData = ProductiveMiner.interface.encodeDeploy();
  const estimatedGas = await ethers.provider.estimateGas({
    data: deploymentData
  });

  const gasPrice = await ethers.provider.getFeeData();
  const estimatedCost = ethers.formatEther(estimatedGas * gasPrice.gasPrice);

  console.log(`💰 Estimated deployment cost: ${estimatedCost} ETH`);
  console.log(`⛽ Estimated gas: ${estimatedGas.toString()}`);

  // Check account balance
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceEth = ethers.formatEther(balance);

  console.log(`👤 Deployer address: ${deployer.address}`);
  console.log(`💰 Account balance: ${balanceEth} ETH`);

  if (balance < estimatedGas * gasPrice.gasPrice) {
    console.error("❌ Insufficient balance for deployment");
    console.error(`   Required: ~${estimatedCost} ETH`);
    console.error(`   Available: ${balanceEth} ETH`);
    console.error("\n💡 Get Sepolia ETH from:");
    console.error("   - https://sepoliafaucet.com/");
    console.error("   - https://faucet.sepolia.dev/");
    process.exit(1);
  }

  console.log("✅ Sufficient balance for deployment");

  // Deploy the contract
  console.log("\n🚀 Deploying contract...");
  
  const startTime = Date.now();
  
  const productiveMiner = await ProductiveMiner.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  
  await productiveMiner.waitForDeployment();
  
  const endTime = Date.now();
  const deploymentTime = (endTime - startTime) / 1000;

  const contractAddress = await productiveMiner.getAddress();

  console.log("\n🎉 Contract deployed successfully!");
  console.log("==================================");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`⏱️  Deployment Time: ${deploymentTime.toFixed(2)} seconds`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`🔗 Network: Sepolia Testnet`);

  // Get deployment transaction details
  const deploymentTx = productiveMiner.deploymentTransaction();
  const receipt = await deploymentTx.wait();
  
  console.log(`⛽ Gas Used: ${receipt.gasUsed.toString()}`);
  console.log(`💰 Gas Cost: ${ethers.formatEther(receipt.gasUsed * receipt.gasPrice)} ETH`);
  console.log(`📊 Block Number: ${receipt.blockNumber}`);

  // Verify contract state
  console.log("\n🔍 Verifying contract state...");
  
  const owner = await productiveMiner.owner();
  const maxDifficulty = await productiveMiner.maxDifficulty();
  const baseReward = await productiveMiner.baseReward();
  const quantumSecurityLevel = await productiveMiner.quantumSecurityLevel();

  console.log(`👑 Owner: ${owner}`);
  console.log(`🎯 Max Difficulty: ${maxDifficulty.toString()}`);
  console.log(`💰 Base Reward: ${baseReward.toString()}`);
  console.log(`🔐 Quantum Security Level: ${quantumSecurityLevel.toString()}`);

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: deploymentTime,
    gasUsed: receipt.gasUsed.toString(),
    gasCost: ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
    blockNumber: receipt.blockNumber,
    owner: owner,
    maxDifficulty: maxDifficulty.toString(),
    baseReward: baseReward.toString(),
    quantumSecurityLevel: quantumSecurityLevel.toString(),
    timestamp: new Date().toISOString()
  };

  const fs = require('fs');
  const deploymentPath = './deployment-sepolia.json';
  
  try {
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to: ${deploymentPath}`);
  } catch (error) {
    console.error("❌ Failed to save deployment info:", error.message);
  }

  // Display next steps
  console.log("\n🎯 Next Steps:");
  console.log("===============");
  console.log("");
  console.log("1. 🔍 Verify Contract on Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("");
  console.log("2. ✅ Verify Contract Source:");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
  console.log("");
  console.log("3. 🧪 Test Contract Functions:");
  console.log(`   npx hardhat test --network sepolia`);
  console.log("");
  console.log("4. 📊 Monitor Contract:");
  console.log(`   npx hardhat console --network sepolia`);
  console.log(`   const contract = await ethers.getContractAt("ProductiveMiner", "${contractAddress}")`);
  console.log("");
  console.log("5. 🔗 Update Frontend:");
  console.log(`   Update contract address in your frontend configuration`);
  console.log("");

  console.log("🎉 Deployment complete! Your contract is live on Sepolia testnet.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 