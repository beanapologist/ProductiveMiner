const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Edge & Pressure Testing", function () {
  let productiveMiner;
  let owner;
  let miner1, miner2, miner3, miner4, miner5;
  let addrs;

  beforeEach(async function () {
    [owner, miner1, miner2, miner3, miner4, miner5, ...addrs] = await ethers.getSigners();
    
    const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
    productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.waitForDeployment();
  });

  describe("Edge Case Testing", function () {
    it("Should handle maximum difficulty submissions", async function () {
      console.log("\n🔬 Edge Case: Maximum Difficulty");
      
      const maxDifficulty = await productiveMiner.maxDifficulty();
      const workType = "Prime Pattern Discovery";
      const result = "max_difficulty_result";
      const proofOfWork = "max_difficulty_proof";
      const quantumSecurity = 256;

      // Test at maximum difficulty
      await expect(
        productiveMiner.connect(miner1).submitDiscovery(
          workType,
          Number(maxDifficulty),
          result,
          proofOfWork,
          quantumSecurity
        )
      ).to.emit(productiveMiner, "DiscoverySubmitted");

      // Test exceeding maximum difficulty
      await expect(
        productiveMiner.connect(miner2).submitDiscovery(
          workType,
          Number(maxDifficulty) + 1,
          result,
          proofOfWork,
          quantumSecurity
        )
      ).to.be.revertedWith("Difficulty too high");

      console.log("✅ Maximum difficulty edge case handled correctly");
    });

    it("Should handle minimum quantum security requirements", async function () {
      console.log("\n🔬 Edge Case: Quantum Security Limits");
      
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const result = "test_result";
      const proofOfWork = "test_proof";
      
      // Get current quantum security level
      const quantumSecurityLevel = await productiveMiner.quantumSecurityLevel();
      
      // Test at minimum quantum security
      await expect(
        productiveMiner.connect(miner1).submitDiscovery(
          workType,
          difficulty,
          result,
          proofOfWork,
          Number(quantumSecurityLevel)
        )
      ).to.emit(productiveMiner, "DiscoverySubmitted");

      // Test below minimum quantum security
      await expect(
        productiveMiner.connect(miner2).submitDiscovery(
          workType,
          difficulty,
          result,
          proofOfWork,
          Number(quantumSecurityLevel) - 1
        )
      ).to.be.revertedWith("Insufficient quantum security");

      console.log("✅ Quantum security edge case handled correctly");
    });

    it("Should handle empty and very long strings", async function () {
      console.log("\n🔬 Edge Case: String Length Limits");
      
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const quantumSecurity = 256;

      // Test with empty strings
      await expect(
        productiveMiner.connect(miner1).submitDiscovery(
          workType,
          difficulty,
          "",
          "",
          quantumSecurity
        )
      ).to.emit(productiveMiner, "DiscoverySubmitted");

      // Test with very long strings
      const longResult = "a".repeat(1000);
      const longProof = "b".repeat(1000);

      await expect(
        productiveMiner.connect(miner2).submitDiscovery(
          workType,
          difficulty,
          longResult,
          longProof,
          quantumSecurity
        )
      ).to.emit(productiveMiner, "DiscoverySubmitted");

      console.log("✅ String length edge cases handled");
    });

    it("Should handle concurrent mining sessions", async function () {
      console.log("\n🔬 Edge Case: Concurrent Sessions");
      
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;

      // Start multiple sessions for same miner
      await productiveMiner.connect(miner1).startMiningSession(workType, difficulty);
      await productiveMiner.connect(miner1).startMiningSession(workType, difficulty + 1);
      await productiveMiner.connect(miner1).startMiningSession(workType, difficulty + 2);

      const sessions = await productiveMiner.getMiningSessions(miner1.address);
      expect(sessions.length).to.equal(3);

      // Complete sessions in reverse order
      await productiveMiner.connect(miner1).completeMiningSession(2);
      await productiveMiner.connect(miner1).completeMiningSession(1);
      await productiveMiner.connect(miner1).completeMiningSession(0);

      const completedSessions = await productiveMiner.getMiningSessions(miner1.address);
      expect(completedSessions[0].active).to.be.false;
      expect(completedSessions[1].active).to.be.false;
      expect(completedSessions[2].active).to.be.false;

      console.log("✅ Concurrent sessions handled correctly");
    });
  });

  describe("Pressure Testing", function () {
    it("Should handle high-volume discovery submissions", async function () {
      console.log("\n💪 Pressure Test: High-Volume Submissions");
      
      const numSubmissions = 50;
      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < numSubmissions; i++) {
        const promise = productiveMiner.connect(miner1).submitDiscovery(
          "Prime Pattern Discovery",
          5,
          `result_${i}`,
          `proof_${i}`,
          256
        );
        promises.push(promise);
      }

      await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      const throughput = (numSubmissions / (totalTime / 1000)).toFixed(2);

      console.log(`Processed ${numSubmissions} submissions in ${totalTime}ms`);
      console.log(`Throughput: ${throughput} submissions/second`);
      console.log(`Total discoveries: ${totalDiscoveries.toString()}`);
      console.log(`Average time per submission: ${(totalTime / numSubmissions).toFixed(2)}ms`);

      expect(totalDiscoveries).to.equal(numSubmissions);
      expect(Number(throughput)).to.be.gt(10); // Should handle at least 10 submissions/second
    });

    it("Should handle multiple miners simultaneously", async function () {
      console.log("\n💪 Pressure Test: Multiple Miners");
      
      const miners = [miner1, miner2, miner3, miner4, miner5];
      const submissionsPerMiner = 10;
      const startTime = Date.now();
      const allPromises = [];

      for (let minerIndex = 0; minerIndex < miners.length; minerIndex++) {
        for (let i = 0; i < submissionsPerMiner; i++) {
          const promise = productiveMiner.connect(miners[minerIndex]).submitDiscovery(
            "Prime Pattern Discovery",
            5,
            `miner_${minerIndex}_result_${i}`,
            `miner_${minerIndex}_proof_${i}`,
            256
          );
          allPromises.push(promise);
        }
      }

      await Promise.all(allPromises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      const totalSubmissions = miners.length * submissionsPerMiner;
      const throughput = (totalSubmissions / (totalTime / 1000)).toFixed(2);

      console.log(`Processed ${totalSubmissions} submissions from ${miners.length} miners in ${totalTime}ms`);
      console.log(`Throughput: ${throughput} submissions/second`);
      console.log(`Total discoveries: ${totalDiscoveries.toString()}`);

      expect(totalDiscoveries).to.equal(totalSubmissions);
      expect(Number(throughput)).to.be.gt(20); // Should handle at least 20 submissions/second
    });

    it("Should handle memory-intensive operations", async function () {
      console.log("\n💪 Pressure Test: Memory-Intensive Operations");
      
      const numLargeSubmissions = 20;
      const largeResult = "x".repeat(5000);
      const largeProof = "y".repeat(5000);
      const startTime = Date.now();

      for (let i = 0; i < numLargeSubmissions; i++) {
        await productiveMiner.connect(miner1).submitDiscovery(
          "Prime Pattern Discovery",
          10,
          `${largeResult}_${i}`,
          `${largeProof}_${i}`,
          256
        );
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      console.log(`Processed ${numLargeSubmissions} large submissions in ${totalTime}ms`);
      console.log(`Total discoveries: ${totalDiscoveries.toString()}`);
      console.log(`Average time per large submission: ${(totalTime / numLargeSubmissions).toFixed(2)}ms`);

      expect(totalDiscoveries).to.equal(numLargeSubmissions);
    });
  });

  describe("Stress Testing", function () {
    it("Should handle maximum gas usage scenarios", async function () {
      console.log("\n🔥 Stress Test: Maximum Gas Usage");
      
      const workType = "Prime Pattern Discovery";
      const difficulty = 50; // Maximum difficulty
      const result = "x".repeat(1000); // Large result
      const proofOfWork = "y".repeat(1000); // Large proof
      const quantumSecurity = 512; // High quantum security

      const tx = await productiveMiner.connect(miner1).submitDiscovery(
        workType,
        difficulty,
        result,
        proofOfWork,
        quantumSecurity
      );

      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed;

      console.log(`Gas used for maximum complexity submission: ${gasUsed.toString()}`);
      console.log(`Gas cost: ${ethers.formatEther(gasUsed * receipt.gasPrice)} ETH`);

      // Verify the submission was successful
      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      expect(totalDiscoveries).to.equal(1);

      console.log("✅ Maximum gas usage scenario handled");
    });

    it("Should handle rapid state changes", async function () {
      console.log("\n🔥 Stress Test: Rapid State Changes");
      
      const numCycles = 10;
      const startTime = Date.now();

      for (let cycle = 0; cycle < numCycles; cycle++) {
        // Submit discovery
        await productiveMiner.connect(miner1).submitDiscovery(
          "Prime Pattern Discovery",
          10,
          `cycle_${cycle}_result`,
          `cycle_${cycle}_proof`,
          256
        );

        // Start mining session
        await productiveMiner.connect(miner2).startMiningSession(
          "Prime Pattern Discovery",
          10
        );

        // Complete mining session
        await productiveMiner.connect(miner2).completeMiningSession(cycle);

        // Change parameters
        await productiveMiner.setMaxDifficulty(50 + cycle);
        await productiveMiner.setBaseReward(100 + cycle);
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      console.log(`Completed ${numCycles} full cycles in ${totalTime}ms`);
      console.log(`Average time per cycle: ${(totalTime / numCycles).toFixed(2)}ms`);

      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      const sessions = await productiveMiner.getMiningSessions(miner2.address);

      expect(totalDiscoveries).to.equal(numCycles);
      expect(sessions.length).to.equal(numCycles);

      console.log("✅ Rapid state changes handled correctly");
    });

    it("Should handle network congestion simulation", async function () {
      console.log("\n🔥 Stress Test: Network Congestion Simulation");
      
      const numConcurrentTransactions = 100;
      const startTime = Date.now();
      const promises = [];

      // Submit discoveries with varying complexity
      for (let i = 0; i < numConcurrentTransactions; i++) {
        const difficulty = (i % 10) + 1;
        const quantumSecurity = 256 + (i % 100);
        
        const promise = productiveMiner.connect(miner1).submitDiscovery(
          "Prime Pattern Discovery",
          difficulty,
          `congestion_result_${i}`,
          `congestion_proof_${i}`,
          quantumSecurity
        );
        promises.push(promise);
      }

      await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      const throughput = (numConcurrentTransactions / (totalTime / 1000)).toFixed(2);

      console.log(`Processed ${numConcurrentTransactions} concurrent transactions in ${totalTime}ms`);
      console.log(`Throughput: ${throughput} transactions/second`);
      console.log(`Total discoveries: ${totalDiscoveries.toString()}`);

      expect(totalDiscoveries).to.equal(numConcurrentTransactions);
      expect(Number(throughput)).to.be.gt(50); // Should handle at least 50 transactions/second

      console.log("✅ Network congestion simulation passed");
    });
  });

  describe("Recovery Testing", function () {
    it("Should handle contract state recovery", async function () {
      console.log("\n🔄 Recovery Test: Contract State Recovery");
      
      // Perform various operations
      await productiveMiner.connect(miner1).submitDiscovery(
        "Prime Pattern Discovery",
        10,
        "recovery_test_result",
        "recovery_test_proof",
        256
      );

      await productiveMiner.connect(miner2).startMiningSession(
        "Prime Pattern Discovery",
        10
      );

      await productiveMiner.setMaxDifficulty(75);
      await productiveMiner.setBaseReward(150);

      // Verify state consistency
      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      const totalRewards = await productiveMiner.totalRewardsDistributed();
      const maxDifficulty = await productiveMiner.maxDifficulty();
      const baseReward = await productiveMiner.baseReward();
      const sessions = await productiveMiner.getMiningSessions(miner2.address);

      expect(totalDiscoveries).to.equal(1);
      expect(totalRewards).to.be.gt(0);
      expect(maxDifficulty).to.equal(75);
      expect(baseReward).to.equal(150);
      expect(sessions.length).to.equal(1);

      console.log("✅ Contract state recovery verified");
    });

    it("Should handle error recovery scenarios", async function () {
      console.log("\n🔄 Recovery Test: Error Recovery");
      
      // Test invalid operations and verify recovery
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const result = "test_result";
      const proofOfWork = "test_proof";
      const quantumSecurity = 256;

      // Valid submission
      await productiveMiner.connect(miner1).submitDiscovery(
        workType,
        difficulty,
        result,
        proofOfWork,
        quantumSecurity
      );

      // Invalid submission (should fail)
      await expect(
        productiveMiner.connect(miner2).submitDiscovery(
          workType,
          51, // Exceeds max difficulty
          result,
          proofOfWork,
          quantumSecurity
        )
      ).to.be.revertedWith("Difficulty too high");

      // Verify contract is still functional
      const totalDiscoveries = await productiveMiner.totalDiscoveries();
      expect(totalDiscoveries).to.equal(1);

      // Valid submission after error
      await productiveMiner.connect(miner2).submitDiscovery(
        workType,
        difficulty,
        "recovery_result",
        "recovery_proof",
        quantumSecurity
      );

      const finalDiscoveries = await productiveMiner.totalDiscoveries();
      expect(finalDiscoveries).to.equal(2);

      console.log("✅ Error recovery scenarios handled correctly");
    });
  });
}); 