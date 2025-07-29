const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Simple Test for ProductiveMinerAdaptive...\n");

    // Get the deployed contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const ProductiveMinerAdaptive = await ethers.getContractFactory("ProductiveMinerAdaptive");
    const contract = ProductiveMinerAdaptive.attach(contractAddress);

    console.log("📦 Contract loaded at:", contractAddress);

    // Test basic functions first
    console.log("\n🔍 Testing basic functions...");
    
    try {
        const maxDifficulty = await contract.maxDifficulty();
        console.log("✅ Max Difficulty:", maxDifficulty.toString());
    } catch (error) {
        console.log("❌ Max Difficulty failed:", error.message);
    }

    try {
        const baseReward = await contract.baseReward();
        console.log("✅ Base Reward:", baseReward.toString());
    } catch (error) {
        console.log("❌ Base Reward failed:", error.message);
    }

    try {
        const quantumSecurityLevel = await contract.quantumSecurityLevel();
        console.log("✅ Quantum Security Level:", quantumSecurityLevel.toString());
    } catch (error) {
        console.log("❌ Quantum Security Level failed:", error.message);
    }

    try {
        const algorithmLearningRate = await contract.algorithmLearningRate();
        console.log("✅ Algorithm Learning Rate:", algorithmLearningRate.toString());
    } catch (error) {
        console.log("❌ Algorithm Learning Rate failed:", error.message);
    }

    // Test the problematic function
    console.log("\n🔍 Testing getAdaptiveLearningState...");
    try {
        const state = await contract.getAdaptiveLearningState();
        console.log("✅ getAdaptiveLearningState succeeded");
        console.log("Total Blocks:", state.totalBlocks.toString());
        console.log("Successful Blocks:", state.successfulBlocks.toString());
        console.log("Failed Blocks:", state.failedBlocks.toString());
        console.log("Average Algorithm Efficiency:", state.averageAlgorithmEfficiency.toString());
        console.log("Average Security Strength:", state.averageSecurityStrength.toString());
        console.log("Current Learning Rate:", state.currentLearningRate.toString());
    } catch (error) {
        console.log("❌ getAdaptiveLearningState failed:", error.message);
    }

    // Test the learning rates function
    console.log("\n🔍 Testing getLearningRates...");
    try {
        const rates = await contract.getLearningRates();
        console.log("✅ getLearningRates succeeded");
        console.log("Algorithm Learning Rate:", rates._algorithmLearningRate.toString());
        console.log("Security Learning Rate:", rates._securityLearningRate.toString());
        console.log("Consensus Learning Rate:", rates._consensusLearningRate.toString());
    } catch (error) {
        console.log("❌ getLearningRates failed:", error.message);
    }

    console.log("\n🎉 Simple test complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }); 