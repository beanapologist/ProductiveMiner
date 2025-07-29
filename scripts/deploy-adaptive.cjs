const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying ProductiveMinerAdaptive with Block-Based Learning...\n");

    // Get the contract factory
    const ProductiveMinerAdaptive = await ethers.getContractFactory("ProductiveMinerAdaptive");
    
    console.log("📦 Contract factory loaded");

    // Deploy the contract
    console.log("🚀 Deploying contract...");
    
    const startTime = Date.now();
    
    const productiveMinerAdaptive = await ProductiveMinerAdaptive.deploy();
    
    console.log("⏳ Waiting for deployment confirmation...");
    
    await productiveMinerAdaptive.waitForDeployment();
    
    const endTime = Date.now();
    const deploymentTime = (endTime - startTime) / 1000;

    const contractAddress = await productiveMinerAdaptive.getAddress();

    console.log("\n🎉 ProductiveMinerAdaptive deployed successfully!");
    console.log("================================================");
    console.log(`📍 Contract Address: ${contractAddress}`);
    console.log(`⏱️  Deployment Time: ${deploymentTime.toFixed(2)} seconds`);
    console.log(`🔗 Network: ${network.name}`);

    // Get deployment transaction details
    const deploymentTx = productiveMinerAdaptive.deploymentTransaction();
    const receipt = await deploymentTx.wait();
    
    console.log(`⛽ Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`💰 Gas Cost: ${ethers.formatEther(receipt.gasUsed * receipt.gasPrice)} ETH`);
    console.log(`📊 Block Number: ${receipt.blockNumber}`);

    // Verify contract state
    console.log("\n🔍 Verifying adaptive learning state...");
    
    const owner = await productiveMinerAdaptive.owner();
    const maxDifficulty = await productiveMinerAdaptive.maxDifficulty();
    const baseReward = await productiveMinerAdaptive.baseReward();
    const quantumSecurityLevel = await productiveMinerAdaptive.quantumSecurityLevel();
    const algorithmLearningRate = await productiveMinerAdaptive.algorithmLearningRate();
    const securityLearningRate = await productiveMinerAdaptive.securityLearningRate();
    const consensusLearningRate = await productiveMinerAdaptive.consensusLearningRate();

    console.log(`👑 Owner: ${owner}`);
    console.log(`🎯 Max Difficulty: ${maxDifficulty.toString()}`);
    console.log(`💰 Base Reward: ${baseReward.toString()}`);
    console.log(`🔐 Quantum Security Level: ${quantumSecurityLevel.toString()}`);
    console.log(`🧠 Algorithm Learning Rate: ${algorithmLearningRate.toString()}`);
    console.log(`🛡️  Security Learning Rate: ${securityLearningRate.toString()}`);
    console.log(`⚡ Consensus Learning Rate: ${consensusLearningRate.toString()}`);

    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        contractAddress: contractAddress,
        deployer: owner,
        deploymentTime: deploymentTime,
        gasUsed: receipt.gasUsed.toString(),
        gasCost: ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
        blockNumber: receipt.blockNumber,
        maxDifficulty: maxDifficulty.toString(),
        baseReward: baseReward.toString(),
        quantumSecurityLevel: quantumSecurityLevel.toString(),
        algorithmLearningRate: algorithmLearningRate.toString(),
        securityLearningRate: securityLearningRate.toString(),
        consensusLearningRate: consensusLearningRate.toString(),
        timestamp: new Date().toISOString()
    };

    const fs = require('fs');
    const deploymentPath = './deployment-adaptive.json';
    
    try {
        fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
        console.log(`\n💾 Deployment info saved to: ${deploymentPath}`);
    } catch (error) {
        console.error("❌ Failed to save deployment info:", error.message);
    }

    // Display next steps
    console.log("\n🎯 Next Steps for Adaptive Learning System:");
    console.log("===========================================");
    console.log("");
    console.log("1. 🧪 Test Block-Based Learning:");
    console.log(`   npx hardhat test test/adaptive-learning.test.js`);
    console.log("");
    console.log("2. 🚀 Create Test Blocks:");
    console.log(`   npx hardhat console`);
    console.log(`   const contract = await ethers.getContractAt("ProductiveMinerAdaptive", "${contractAddress}")`);
    console.log(`   await contract.createBlock("Prime Pattern Discovery", 25, 256, true)`);
    console.log("");
    console.log("3. 📊 Monitor Learning Metrics:");
    console.log(`   const learningState = await contract.getAdaptiveLearningState()`);
    console.log(`   console.log(learningState)`);
    console.log("");
    console.log("4. 🔧 Adjust Learning Parameters:");
    console.log(`   await contract.setAlgorithmLearningRate(750)`);
    console.log(`   await contract.setSecurityLearningRate(600)`);
    console.log("");
    console.log("5. 🐳 Deploy to Docker:");
    console.log(`   docker-compose up -d`);
    console.log("");

    console.log("🎉 Adaptive learning system is ready for deployment!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }); 