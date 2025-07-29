const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductiveMinerAdaptive - Basic Tests", function () {
    let ProductiveMinerAdaptive;
    let productiveMiner;
    let owner;
    let miner1;

    beforeEach(async function () {
        [owner, miner1] = await ethers.getSigners();
        
        ProductiveMinerAdaptive = await ethers.getContractFactory("ProductiveMinerAdaptive");
        productiveMiner = await ProductiveMinerAdaptive.deploy();
    });

    describe("Basic Contract Functions", function () {
        it("Should deploy successfully", async function () {
            expect(await productiveMiner.getAddress()).to.not.equal(ethers.ZeroAddress);
        });

        it("Should have correct initial state", async function () {
            const maxDifficulty = await productiveMiner.maxDifficulty();
            const baseReward = await productiveMiner.baseReward();
            const quantumSecurityLevel = await productiveMiner.quantumSecurityLevel();
            
            expect(maxDifficulty).to.equal(50);
            expect(baseReward).to.equal(100);
            expect(quantumSecurityLevel).to.equal(256);
        });

        it("Should create a block successfully", async function () {
            const tx = await productiveMiner.connect(miner1).createBlock(
                "Prime Pattern Discovery",
                25,
                256,
                true
            );

            const receipt = await tx.wait();
            const event = receipt.events?.find(e => e.event === "BlockCreated");
            
            expect(event).to.not.be.undefined;
            expect(event.args.blockNumber).to.equal(1);
            expect(event.args.successful).to.be.true;
        });

        it("Should get adaptive learning state", async function () {
            // Create a block first
            await productiveMiner.connect(miner1).createBlock(
                "Prime Pattern Discovery",
                25,
                256,
                true
            );

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            expect(learningState.totalBlocks).to.equal(1);
            expect(learningState.successfulBlocks).to.equal(1);
            expect(learningState.failedBlocks).to.equal(0);
            expect(learningState.averageAlgorithmEfficiency).to.be.gt(0);
            expect(learningState.averageSecurityStrength).to.be.gt(0);
        });

        it("Should get block learning metrics", async function () {
            await productiveMiner.connect(miner1).createBlock(
                "Prime Pattern Discovery",
                25,
                256,
                true
            );

            const blockMetrics = await productiveMiner.getBlockLearningMetrics(1);
            
            expect(blockMetrics.algorithmEfficiency).to.be.gt(0);
            expect(blockMetrics.securityStrength).to.be.gt(0);
        });

        it("Should allow admin to adjust learning rates", async function () {
            await productiveMiner.connect(owner).setAlgorithmLearningRate(750);
            await productiveMiner.connect(owner).setSecurityLearningRate(600);
            await productiveMiner.connect(owner).setConsensusLearningRate(400);

            const learningState = await productiveMiner.getAdaptiveLearningState();
            expect(learningState._algorithmLearningRate).to.equal(750);
            expect(learningState._securityLearningRate).to.equal(600);
            expect(learningState._consensusLearningRate).to.equal(400);
        });

        it("Should calculate adaptive difficulty", async function () {
            const adaptiveDifficulty = await productiveMiner.calculateAdaptiveDifficulty("Prime Pattern Discovery");
            expect(adaptiveDifficulty).to.be.gte(0);
        });

        it("Should start and complete mining session", async function () {
            // Create a block first to establish learning baseline
            await productiveMiner.connect(miner1).createBlock(
                "Prime Pattern Discovery",
                25,
                256,
                true
            );

            // Start mining session
            const startTx = await productiveMiner.connect(miner1).startMiningSession(
                "Prime Pattern Discovery",
                30
            );
            const startReceipt = await startTx.wait();
            const startEvent = startReceipt.events?.find(e => e.event === "MiningSessionStarted");
            expect(startEvent).to.not.be.undefined;

            // Complete mining session
            const completeTx = await productiveMiner.connect(miner1).completeMiningSession(0);
            const completeReceipt = await completeTx.wait();
            const completeEvent = completeReceipt.events?.find(e => e.event === "MiningSessionCompleted");
            expect(completeEvent).to.not.be.undefined;
        });

        it("Should submit discovery with adaptive metrics", async function () {
            // Create blocks first to establish learning baseline
            for (let i = 0; i < 3; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    25 + i,
                    256 + i * 64,
                    true
                );
            }

            const tx = await productiveMiner.connect(miner1).submitDiscovery(
                "Prime Pattern Discovery",
                30,
                "Advanced prime pattern found",
                "Mathematical proof of pattern",
                384
            );

            const receipt = await tx.wait();
            const event = receipt.events?.find(e => e.event === "DiscoverySubmitted");
            expect(event).to.not.be.undefined;
            expect(event.args.blockNumber).to.be.gt(0);
        });
    });

    describe("Learning Rate Adaptation", function () {
        it("Should increase learning rates for successful blocks", async function () {
            // Create several successful blocks
            for (let i = 0; i < 5; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    25 + i,
                    256 + i * 64,
                    true
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Learning rates should increase due to consistent success
            expect(learningState._algorithmLearningRate).to.be.gt(500);
            expect(learningState._securityLearningRate).to.be.gt(500);
        });

        it("Should decrease learning rates for failed blocks", async function () {
            // Create several failed blocks
            for (let i = 0; i < 5; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    25 + i,
                    256 + i * 64,
                    false
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Learning rates should decrease due to consistent failure
            expect(learningState._algorithmLearningRate).to.be.lt(500);
            expect(learningState._securityLearningRate).to.be.lt(500);
        });
    });

    describe("Block Performance Analysis", function () {
        it("Should analyze block performance patterns", async function () {
            // Create blocks with different performance patterns
            for (let i = 0; i < 10; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    20 + i * 2,
                    256 + i * 32,
                    i % 3 === 0 // 33% success rate
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Should have learned from the performance patterns
            expect(learningState.totalBlocks).to.equal(10);
            expect(learningState.successfulBlocks).to.equal(4); // 33% of 10 ≈ 3-4
            expect(learningState.failedBlocks).to.equal(6);
        });
    });
}); 