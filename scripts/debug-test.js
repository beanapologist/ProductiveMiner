const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Debug Test for ProductiveMinerAdaptive...\n");

    // Get the deployed contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const ProductiveMinerAdaptive = await ethers.getContractFactory("ProductiveMinerAdaptive");
    const contract = ProductiveMinerAdaptive.attach(contractAddress);

    console.log("📦 Contract loaded at:", contractAddress);

    // Test getAdaptiveLearningState
    console.log("\n🔍 Testing getAdaptiveLearningState...");
    try {
        const state = await contract.getAdaptiveLearningState();
        console.log("✅ getAdaptiveLearningState succeeded");
        console.log("Raw state object:", state);
        console.log("Total Blocks:", state.totalBlocks);
        console.log("Successful Blocks:", state.successfulBlocks);
        console.log("Failed Blocks:", state.failedBlocks);
        console.log("Average Algorithm Efficiency:", state.averageAlgorithmEfficiency);
        console.log("Average Security Strength:", state.averageSecurityStrength);
        console.log("Current Learning Rate:", state.currentLearningRate);
    } catch (error) {
        console.log("❌ getAdaptiveLearningState failed:", error.message);
    }

    console.log("\n🎉 Debug test complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }); 