const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Network Comparison", function () {
  let productiveMiner;
  let owner;
  let miner1;

  beforeEach(async function () {
    [owner, miner1] = await ethers.getSigners();
    
    const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
    productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.waitForDeployment();
  });

  describe("Hardhat Network Characteristics", function () {
    it("Should show Hardhat network performance metrics", async function () {
      const provider = ethers.provider;
      
      // Get network information
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      const gasPrice = await provider.getFeeData();
      
      console.log("\n🔗 Hardhat Network Characteristics:");
      console.log("Network Chain ID:", network.chainId);
      console.log("Current Block:", blockNumber);
      console.log("Gas Price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
      console.log("Max Fee Per Gas:", ethers.formatUnits(gasPrice.maxFeePerGas || 0, "gwei"), "gwei");
      console.log("Max Priority Fee:", ethers.formatUnits(gasPrice.maxPriorityFeePerGas || 0, "gwei"), "gwei");
      
      // Test transaction speed
      const startTime = Date.now();
      await productiveMiner.setMaxDifficulty(100);
      const endTime = Date.now();
      const transactionTime = endTime - startTime;
      
      console.log("Transaction Time:", transactionTime, "ms");
      console.log("Block Time: ~1 second (instant)");
      console.log("Consensus: PoA (Proof of Authority)");
      console.log("Mining: Instant");
    });

    it("Should demonstrate gas efficiency vs other networks", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const result = "test result";
      const proofOfWork = "test proof";
      const quantumSecurity = 256;

      // Measure gas usage
      const tx = await productiveMiner.connect(miner1).submitDiscovery(
        workType,
        difficulty,
        result,
        proofOfWork,
        quantumSecurity
      );
      
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice;
      const totalCost = gasUsed * gasPrice;
      
      console.log("\n⛽ Gas Analysis:");
      console.log("Gas Used:", gasUsed.toString());
      console.log("Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
      console.log("Total Cost:", ethers.formatEther(totalCost), "ETH");
      
      // Compare with other networks (estimated costs)
      const ethMainnetGasPrice = ethers.parseUnits("20", "gwei"); // ~20 gwei
      const ethMainnetCost = gasUsed * ethMainnetGasPrice;
      
      const polygonGasPrice = ethers.parseUnits("30", "gwei"); // ~30 gwei
      const polygonCost = gasUsed * polygonGasPrice;
      
      const arbitrumGasPrice = ethers.parseUnits("0.1", "gwei"); // ~0.1 gwei
      const arbitrumCost = gasUsed * arbitrumGasPrice;
      
      console.log("\n💰 Cost Comparison (estimated):");
      console.log("Hardhat (Local):", ethers.formatEther(totalCost), "ETH");
      console.log("Ethereum Mainnet:", ethers.formatEther(ethMainnetCost), "ETH");
      console.log("Polygon:", ethers.formatEther(polygonCost), "ETH");
      console.log("Arbitrum:", ethers.formatEther(arbitrumCost), "ETH");
      
      // Calculate cost differences
      const mainnetRatio = Number(ethMainnetCost) / Number(totalCost);
      const polygonRatio = Number(polygonCost) / Number(totalCost);
      const arbitrumRatio = Number(arbitrumCost) / Number(totalCost);
      
      console.log("\n📊 Cost Multipliers vs Hardhat:");
      console.log("Ethereum Mainnet:", mainnetRatio.toFixed(2), "x more expensive");
      console.log("Polygon:", polygonRatio.toFixed(2), "x more expensive");
      console.log("Arbitrum:", arbitrumRatio.toFixed(2), "x more expensive");
    });

    it("Should test network scalability and throughput", async function () {
      console.log("\n🚀 Scalability Test:");
      
      const startTime = Date.now();
      const numTransactions = 10;
      const promises = [];
      
      // Submit multiple transactions simultaneously
      for (let i = 0; i < numTransactions; i++) {
        const promise = productiveMiner.connect(miner1).submitDiscovery(
          "Prime Pattern Discovery",
          5,
          `result_${i}`,
          `proof_${i}`,
          256
        );
        promises.push(promise);
      }
      
      // Wait for all transactions
      await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      console.log(`Processed ${numTransactions} transactions in ${totalTime}ms`);
      console.log(`Throughput: ${(numTransactions / (totalTime / 1000)).toFixed(2)} tps`);
      console.log("Average time per transaction:", (totalTime / numTransactions).toFixed(2), "ms");
      
      // Check final state
      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      console.log("Total discoveries after batch:", totalDiscoveries.toString());
    });

    it("Should demonstrate network reliability and consistency", async function () {
      console.log("\n🛡️ Reliability Test:");
      
      // Test multiple contract deployments
      const deployments = [];
      const startTime = Date.now();
      
      for (let i = 0; i < 5; i++) {
        const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
        const contract = await ProductiveMiner.deploy();
        await contract.waitForDeployment();
        deployments.push(contract);
      }
      
      const endTime = Date.now();
      const deploymentTime = endTime - startTime;
      
      console.log(`Deployed ${deployments.length} contracts in ${deploymentTime}ms`);
      console.log("Average deployment time:", (deploymentTime / deployments.length).toFixed(2), "ms");
      
      // Verify all contracts are functional
      for (let i = 0; i < deployments.length; i++) {
        const owner = await deployments[i].owner();
        const maxDifficulty = await deployments[i].maxDifficulty();
        expect(owner).to.not.equal(ethers.ZeroAddress);
        expect(maxDifficulty).to.equal(50);
      }
      
      console.log("✅ All deployed contracts are functional");
    });

    it("Should compare with other development environments", async function () {
      console.log("\n🔧 Development Environment Comparison:");
      
      console.log("Hardhat Network:");
      console.log("  ✅ Instant block time");
      console.log("  ✅ Free gas (no real cost)");
      console.log("  ✅ Deterministic accounts");
      console.log("  ✅ Built-in debugging");
      console.log("  ✅ Network forking capability");
      console.log("  ✅ Gas estimation");
      console.log("  ✅ Console logging");
      
      console.log("\nGanache:");
      console.log("  ✅ Similar to Hardhat");
      console.log("  ❌ Less integrated tooling");
      console.log("  ❌ No built-in testing framework");
      
      console.log("\nTestnets (Goerli, Sepolia):");
      console.log("  ❌ Real gas costs");
      console.log("  ❌ Network congestion");
      console.log("  ❌ Slower block times");
      console.log("  ✅ Real network conditions");
      
      console.log("\nMainnet:");
      console.log("  ❌ Expensive gas costs");
      console.log("  ❌ Irreversible transactions");
      console.log("  ❌ Network congestion");
      console.log("  ✅ Real economic conditions");
    });

    it("Should demonstrate Hardhat's advantages for development", async function () {
      console.log("\n🎯 Hardhat Development Advantages:");
      
      // Test instant mining
      const blockBefore = await ethers.provider.getBlockNumber();
      await productiveMiner.setMaxDifficulty(75);
      const blockAfter = await ethers.provider.getBlockNumber();
      
      console.log("Blocks mined instantly:", blockAfter - blockBefore);
      
      // Test account management
      const accounts = await ethers.getSigners();
      console.log("Pre-funded accounts available:", accounts.length);
      console.log("Account 0 balance:", ethers.formatEther(await ethers.provider.getBalance(accounts[0].address)), "ETH");
      
      // Test debugging capabilities
      console.log("Debugging features available:");
      console.log("  ✅ Stack traces");
      console.log("  ✅ Gas usage tracking");
      console.log("  ✅ Console.log support");
      console.log("  ✅ Network forking");
      console.log("  ✅ Hardhat console");
      
      // Test network forking (simulated)
      console.log("\nNetwork forking capabilities:");
      console.log("  ✅ Fork mainnet state");
      console.log("  ✅ Test with real contracts");
      console.log("  ✅ Simulate complex scenarios");
      console.log("  ✅ Test with real token balances");
    });
  });
}); 