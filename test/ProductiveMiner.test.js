const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductiveMiner", function () {
  let productiveMiner;
  let owner;
  let miner1;
  let miner2;
  let addrs;

  beforeEach(async function () {
    [owner, miner1, miner2, ...addrs] = await ethers.getSigners();
    
    const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
    productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await productiveMiner.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct default values", async function () {
      expect(await productiveMiner.maxDifficulty()).to.equal(50);
      expect(await productiveMiner.baseReward()).to.equal(100);
      expect(await productiveMiner.blockTime()).to.equal(30);
      expect(await productiveMiner.quantumSecurityLevel()).to.equal(256);
      expect(await productiveMiner.totalDiscoveries()).to.equal(0);
      expect(await productiveMiner.totalRewardsDistributed()).to.equal(0);
    });

    it("Should initialize supported work types", async function () {
      expect(await productiveMiner.workTypes("Prime Pattern Discovery")).to.be.true;
      expect(await productiveMiner.workTypes("Riemann Zero Computation")).to.be.true;
      expect(await productiveMiner.workTypes("Yang-Mills Field Theory")).to.be.true;
      expect(await productiveMiner.workTypes("Goldbach Conjecture Verification")).to.be.true;
      expect(await productiveMiner.workTypes("Navier-Stokes Simulation")).to.be.true;
      expect(await productiveMiner.workTypes("Birch-Swinnerton-Dyer")).to.be.true;
      expect(await productiveMiner.workTypes("Elliptic Curve Cryptography")).to.be.true;
      expect(await productiveMiner.workTypes("Lattice Cryptography")).to.be.true;
      expect(await productiveMiner.workTypes("Poincaré Conjecture")).to.be.true;
    });
  });

  describe("submitDiscovery", function () {
    it("Should submit a discovery successfully", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const result = "2, 3, 5, 7, 11, 13, 17, 19, 23, 29";
      const proofOfWork = "sha256_hash_of_result";
      const quantumSecurity = 256;

      await expect(
        productiveMiner.connect(miner1).submitDiscovery(
          workType,
          difficulty,
          result,
          proofOfWork,
          quantumSecurity
        )
      ).to.emit(productiveMiner, "DiscoverySubmitted");

      expect(await productiveMiner.totalDiscoveries()).to.equal(1);
      expect(await productiveMiner.totalRewardsDistributed()).to.be.gt(0);
    });

    it("Should fail with unsupported work type", async function () {
      const workType = "Unsupported Work Type";
      const difficulty = 10;
      const result = "test result";
      const proofOfWork = "test proof";
      const quantumSecurity = 256;

      await expect(
        productiveMiner.connect(miner1).submitDiscovery(
          workType,
          difficulty,
          result,
          proofOfWork,
          quantumSecurity
        )
      ).to.be.revertedWith("Work type not supported");
    });

    it("Should fail with difficulty too high", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 51; // Higher than maxDifficulty
      const result = "test result";
      const proofOfWork = "test proof";
      const quantumSecurity = 256;

      await expect(
        productiveMiner.connect(miner1).submitDiscovery(
          workType,
          difficulty,
          result,
          proofOfWork,
          quantumSecurity
        )
      ).to.be.revertedWith("Difficulty too high");
    });

    it("Should fail with insufficient quantum security", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const result = "test result";
      const proofOfWork = "test proof";
      const quantumSecurity = 128; // Lower than quantumSecurityLevel

      await expect(
        productiveMiner.connect(miner1).submitDiscovery(
          workType,
          difficulty,
          result,
          proofOfWork,
          quantumSecurity
        )
      ).to.be.revertedWith("Insufficient quantum security");
    });
  });

  describe("startMiningSession", function () {
    it("Should start a mining session successfully", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;

      await expect(
        productiveMiner.connect(miner1).startMiningSession(workType, difficulty)
      ).to.emit(productiveMiner, "MiningSessionStarted");

      const sessions = await productiveMiner.getMiningSessions(miner1.address);
      expect(sessions.length).to.equal(1);
      expect(sessions[0].workType).to.equal(workType);
      expect(sessions[0].difficulty).to.equal(difficulty);
      expect(sessions[0].active).to.be.true;
    });

    it("Should fail with unsupported work type", async function () {
      const workType = "Unsupported Work Type";
      const difficulty = 10;

      await expect(
        productiveMiner.connect(miner1).startMiningSession(workType, difficulty)
      ).to.be.revertedWith("Work type not supported");
    });

    it("Should fail with difficulty too high", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 51;

      await expect(
        productiveMiner.connect(miner1).startMiningSession(workType, difficulty)
      ).to.be.revertedWith("Difficulty too high");
    });
  });

  describe("completeMiningSession", function () {
    it("Should complete a mining session successfully", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;

      await productiveMiner.connect(miner1).startMiningSession(workType, difficulty);
      
      await expect(
        productiveMiner.connect(miner1).completeMiningSession(0)
      ).to.emit(productiveMiner, "MiningSessionCompleted");

      const sessions = await productiveMiner.getMiningSessions(miner1.address);
      expect(sessions[0].active).to.be.false;
      expect(sessions[0].endTime).to.be.gt(0);
    });

    it("Should fail with invalid session index", async function () {
      await expect(
        productiveMiner.connect(miner1).completeMiningSession(0)
      ).to.be.revertedWith("Invalid session index");
    });

    it("Should fail with inactive session", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;

      await productiveMiner.connect(miner1).startMiningSession(workType, difficulty);
      await productiveMiner.connect(miner1).completeMiningSession(0);

      await expect(
        productiveMiner.connect(miner1).completeMiningSession(0)
      ).to.be.revertedWith("Session not active");
    });
  });

  describe("calculateReward", function () {
    it("Should calculate reward correctly", async function () {
      const difficulty = 10;
      const quantumSecurity = 256;
      
      const reward = await productiveMiner.calculateReward(difficulty, quantumSecurity);
      const expectedReward = 100 * difficulty + (quantumSecurity / 256) * 10;
      
      expect(reward).to.equal(expectedReward);
    });

    it("Should calculate higher reward for higher quantum security", async function () {
      const difficulty = 10;
      const quantumSecurity1 = 256;
      const quantumSecurity2 = 512;
      
      const reward1 = await productiveMiner.calculateReward(difficulty, quantumSecurity1);
      const reward2 = await productiveMiner.calculateReward(difficulty, quantumSecurity2);
      
      expect(reward2).to.be.gt(reward1);
    });
  });

  describe("Admin functions", function () {
    it("Should allow owner to set max difficulty", async function () {
      const newMaxDifficulty = 100;
      await productiveMiner.setMaxDifficulty(newMaxDifficulty);
      expect(await productiveMiner.maxDifficulty()).to.equal(newMaxDifficulty);
    });

    it("Should allow owner to set base reward", async function () {
      const newBaseReward = 200;
      await productiveMiner.setBaseReward(newBaseReward);
      expect(await productiveMiner.baseReward()).to.equal(newBaseReward);
    });

    it("Should allow owner to set block time", async function () {
      const newBlockTime = 60;
      await productiveMiner.setBlockTime(newBlockTime);
      expect(await productiveMiner.blockTime()).to.equal(newBlockTime);
    });

    it("Should allow owner to set quantum security level", async function () {
      const newLevel = 512;
      await productiveMiner.setQuantumSecurityLevel(newLevel);
      expect(await productiveMiner.quantumSecurityLevel()).to.equal(newLevel);
    });

    it("Should allow owner to add work type", async function () {
      const newWorkType = "New Mathematical Problem";
      await productiveMiner.addWorkType(newWorkType);
      expect(await productiveMiner.workTypes(newWorkType)).to.be.true;
    });

    it("Should allow owner to remove work type", async function () {
      const workType = "Prime Pattern Discovery";
      await productiveMiner.removeWorkType(workType);
      expect(await productiveMiner.workTypes(workType)).to.be.false;
    });

    it("Should not allow non-owner to call admin functions", async function () {
      await expect(
        productiveMiner.connect(miner1).setMaxDifficulty(100)
      ).to.be.revertedWithCustomError(productiveMiner, "OwnableUnauthorizedAccount");
    });
  });

  describe("View functions", function () {
    it("Should return miner rewards correctly", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const result = "test result";
      const proofOfWork = "test proof";
      const quantumSecurity = 256;

      await productiveMiner.connect(miner1).submitDiscovery(
        workType,
        difficulty,
        result,
        proofOfWork,
        quantumSecurity
      );

      const rewards = await productiveMiner.getMinerRewards(miner1.address);
      expect(rewards).to.be.gt(0);
    });

    it("Should return mining sessions correctly", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;

      await productiveMiner.connect(miner1).startMiningSession(workType, difficulty);
      
      const sessions = await productiveMiner.getMiningSessions(miner1.address);
      expect(sessions.length).to.equal(1);
      expect(sessions[0].miner).to.equal(miner1.address);
      expect(sessions[0].workType).to.equal(workType);
      expect(sessions[0].difficulty).to.equal(difficulty);
    });

    it("Should return discovery correctly", async function () {
      const workType = "Prime Pattern Discovery";
      const difficulty = 10;
      const result = "test result";
      const proofOfWork = "test proof";
      const quantumSecurity = 256;

      await productiveMiner.connect(miner1).submitDiscovery(
        workType,
        difficulty,
        result,
        proofOfWork,
        quantumSecurity
      );

      // Get the latest block to get the timestamp
      const latestBlock = await ethers.provider.getBlock("latest");
      
      // Calculate the discovery ID using abi.encodePacked to match the contract
      const discoveryId = ethers.keccak256(
        ethers.solidityPacked(
          ["address", "string", "uint256", "string", "string", "uint256", "uint256"],
          [miner1.address, workType, difficulty, result, proofOfWork, quantumSecurity, latestBlock.timestamp]
        )
      );

      const discovery = await productiveMiner.getDiscovery(discoveryId);
      expect(discovery.miner).to.equal(miner1.address);
      expect(discovery.workType).to.equal(workType);
      expect(discovery.difficulty).to.equal(difficulty);
      expect(discovery.result).to.equal(result);
      expect(discovery.proofOfWork).to.equal(proofOfWork);
      expect(discovery.quantumSecurity).to.equal(quantumSecurity);
      expect(discovery.verified).to.be.false;
    });
  });
}); 