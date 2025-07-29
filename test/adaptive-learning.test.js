const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductiveMinerAdaptive - Block-Based Learning", function () {
    let ProductiveMinerAdaptive;
    let productiveMiner;
    let owner;
    let miner1, miner2, miner3;
    let validator1, validator2, validator3;

    beforeEach(async function () {
        [owner, miner1, miner2, miner3, validator1, validator2, validator3] = await ethers.getSigners();
        
        ProductiveMinerAdaptive = await ethers.getContractFactory("ProductiveMinerAdaptive");
        productiveMiner = await ProductiveMinerAdaptive.deploy();
    });

    describe("Block-Based Learning System", function () {
        it("Should create blocks and learn from them", async function () {
            // Create initial blocks to establish learning baseline
            await productiveMiner.connect(miner1).createBlock(
                "Prime Pattern Discovery",
                25,
                256,
                true
            );

            await productiveMiner.connect(miner2).createBlock(
                "Riemann Zero Computation",
                30,
                512,
                true
            );

            await productiveMiner.connect(miner3).createBlock(
                "Yang-Mills Field Theory",
                35,
                384,
                false
            );

            // Check adaptive learning state
            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            expect(learningState.totalBlocks).to.equal(3);
            expect(learningState.successfulBlocks).to.equal(2);
            expect(learningState.failedBlocks).to.equal(1);
            expect(learningState.averageAlgorithmEfficiency).to.be.gt(0);
            expect(learningState.averageSecurityStrength).to.be.gt(0);
        });

        it("Should adapt algorithm efficiency based on block performance", async function () {
            // Create blocks with varying algorithm efficiency
            for (let i = 0; i < 5; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    20 + i * 5,
                    256 + i * 64,
                    i % 2 === 0 // Alternating success/failure
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Algorithm efficiency should adapt based on block performance
            expect(learningState.averageAlgorithmEfficiency).to.be.gt(0);
            expect(learningState.algorithmLearningRate).to.be.gt(0);
        });

        it("Should adapt security strength based on block requirements", async function () {
            // Create blocks with increasing security requirements
            for (let i = 0; i < 5; i++) {
                await productiveMiner.connect(miner2).createBlock(
                    "Lattice Cryptography",
                    25 + i * 3,
                    256 + i * 128,
                    true
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Security strength should adapt based on block requirements
            expect(learningState.averageSecurityStrength).to.be.gt(256);
            expect(learningState.securityLearningRate).to.be.gt(0);
        });

        it("Should calculate adaptive difficulty based on block learning", async function () {
            // Create several blocks to establish learning baseline
            for (let i = 0; i < 10; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    20 + i,
                    256 + i * 32,
                    i > 5 // More successful blocks later
                );
            }

            // Check adaptive difficulty calculation
            const adaptiveDifficulty = await productiveMiner.calculateAdaptiveDifficulty("Prime Pattern Discovery");
            expect(adaptiveDifficulty).to.be.gt(0);
        });

        it("Should track block learning metrics", async function () {
            await productiveMiner.connect(miner1).createBlock(
                "Riemann Zero Computation",
                30,
                512,
                true
            );

            const blockMetrics = await productiveMiner.getBlockLearningMetrics(1);
            
            expect(blockMetrics.algorithmEfficiency).to.be.gt(0);
            expect(blockMetrics.securityStrength).to.be.gt(0);
            expect(blockMetrics.consensusTime).to.equal(0); // Will be updated after consensus
            expect(blockMetrics.validatorParticipation).to.equal(0); // Will be updated after validation
        });
    });

    describe("Adaptive Discovery Submission", function () {
        beforeEach(async function () {
            // Create some blocks first to establish learning baseline
            for (let i = 0; i < 5; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    25 + i,
                    256 + i * 64,
                    true
                );
            }
        });

        it("Should submit discovery with block-based adaptive metrics", async function () {
            const tx = await productiveMiner.connect(miner1).submitDiscovery(
                "Prime Pattern Discovery",
                30,
                "Advanced prime pattern found",
                "Mathematical proof of pattern",
                384
            );

            const receipt = await tx.wait();
            
            // Check for DiscoverySubmitted event with block-based metrics
            const event = receipt.events?.find(e => e.event === "DiscoverySubmitted");
            expect(event).to.not.be.undefined;
            expect(event.args.blockNumber).to.be.gt(0);
            expect(event.args.algorithmEfficiency).to.be.gt(0);
            expect(event.args.securityStrength).to.be.gt(0);
        });

        it("Should create validation task with adaptive learning", async function () {
            await productiveMiner.connect(miner1).submitDiscovery(
                "Riemann Zero Computation",
                35,
                "New zero computation result",
                "Complex mathematical proof",
                512
            );

            // Check for ValidationTaskCreated event with adaptive metrics
            // Note: In a real implementation, we'd check the actual validation task
            const totalDiscoveries = await productiveMiner.totalDiscoveries();
            expect(totalDiscoveries).to.equal(1);
        });
    });

    describe("Adaptive Mining Sessions", function () {
        beforeEach(async function () {
            // Create blocks to establish learning baseline
            for (let i = 0; i < 3; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    25 + i * 5,
                    256 + i * 64,
                    true
                );
            }
        });

        it("Should start mining session with block-based adaptive difficulty", async function () {
            const tx = await productiveMiner.connect(miner1).startMiningSession(
                "Prime Pattern Discovery",
                30
            );

            const receipt = await tx.wait();
            
            // Check for MiningSessionStarted event with block-based metrics
            const event = receipt.events?.find(e => e.event === "MiningSessionStarted");
            expect(event).to.not.be.undefined;
            expect(event.args.blockNumber).to.be.gt(0);
            expect(event.args.algorithmEfficiency).to.be.gt(0);
        });

        it("Should complete mining session with learning cycles", async function () {
            await productiveMiner.connect(miner1).startMiningSession(
                "Riemann Zero Computation",
                35
            );

            const tx = await productiveMiner.connect(miner1).completeMiningSession(0);
            const receipt = await tx.wait();
            
            // Check for MiningSessionCompleted event with learning cycles
            const event = receipt.events?.find(e => e.event === "MiningSessionCompleted");
            expect(event).to.not.be.undefined;
            expect(event.args.blockNumber).to.be.gt(0);
            expect(event.args.learningCycles).to.be.gt(0);
        });
    });

    describe("Adaptive Learning Parameters", function () {
        it("Should allow admin to adjust learning rates", async function () {
            await productiveMiner.connect(owner).setAlgorithmLearningRate(750);
            await productiveMiner.connect(owner).setSecurityLearningRate(600);
            await productiveMiner.connect(owner).setConsensusLearningRate(400);

            // Create a block to see the effects
            await productiveMiner.connect(miner1).createBlock(
                "Prime Pattern Discovery",
                25,
                256,
                true
            );

            const learningState = await productiveMiner.getAdaptiveLearningState();
            expect(learningState.algorithmLearningRate).to.equal(750);
        });

        it("Should allow admin to adjust block learning window", async function () {
            await productiveMiner.connect(owner).setBlockLearningWindow(50);
            await productiveMiner.connect(owner).setMinimumBlockConfidence(900);

            // These parameters affect how the system learns from blocks
            // The effects would be visible in subsequent block creation
            expect(await productiveMiner.blockLearningWindow()).to.equal(50);
            expect(await productiveMiner.minimumBlockConfidence()).to.equal(900);
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

        it("Should adapt to changing network conditions", async function () {
            // Simulate changing network conditions
            const workTypes = ["Prime Pattern Discovery", "Riemann Zero Computation", "Lattice Cryptography"];
            
            for (let i = 0; i < 15; i++) {
                const workType = workTypes[i % workTypes.length];
                const difficulty = 20 + (i % 10) * 3;
                const security = 256 + (i % 5) * 64;
                const success = i > 7; // Better performance in later blocks
                
                await productiveMiner.connect(miner1).createBlock(
                    workType,
                    difficulty,
                    security,
                    success
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // System should have adapted to the changing conditions
            expect(learningState.totalBlocks).to.equal(15);
            expect(learningState.successfulBlocks).to.be.gt(learningState.failedBlocks);
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
                    true // All successful
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Learning rates should increase due to consistent success
            expect(learningState.algorithmLearningRate).to.be.gt(500);
            expect(learningState.securityLearningRate).to.be.gt(500);
        });

        it("Should decrease learning rates for failed blocks", async function () {
            // Create several failed blocks
            for (let i = 0; i < 5; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    25 + i,
                    256 + i * 64,
                    false // All failed
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Learning rates should decrease due to consistent failure
            expect(learningState.algorithmLearningRate).to.be.lt(500);
            expect(learningState.securityLearningRate).to.be.lt(500);
        });
    });

    describe("Security Adaptation", function () {
        it("Should adapt security requirements based on block performance", async function () {
            // Create blocks with increasing security requirements
            for (let i = 0; i < 8; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Lattice Cryptography",
                    25 + i * 2,
                    256 + i * 128,
                    i > 3 // Better performance with higher security
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Security strength should adapt based on performance
            expect(learningState.averageSecurityStrength).to.be.gt(256);
            expect(learningState.securityLearningRate).to.be.gt(0);
        });

        it("Should maintain quantum resistance through adaptation", async function () {
            // Create blocks with quantum-resistant requirements
            for (let i = 0; i < 5; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Elliptic Curve Cryptography",
                    30 + i,
                    512 + i * 128, // High quantum security
                    true
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Should maintain high security levels
            expect(learningState.averageSecurityStrength).to.be.gt(512);
        });
    });

    describe("Consensus Adaptation", function () {
        it("Should adapt consensus parameters based on block performance", async function () {
            // Create blocks with varying consensus times
            for (let i = 0; i < 6; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    25 + i,
                    256 + i * 64,
                    i % 2 === 0
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Consensus learning should adapt based on performance
            expect(learningState.consensusAdaptationRate).to.be.gt(0);
        });
    });

    describe("Edge Cases and Error Handling", function () {
        it("Should handle first block creation correctly", async function () {
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
        });

        it("Should handle rapid block creation", async function () {
            // Create blocks rapidly
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(
                    productiveMiner.connect(miner1).createBlock(
                        "Prime Pattern Discovery",
                        25 + i,
                        256 + i * 32,
                        true
                    )
                );
            }

            await Promise.all(promises);

            const learningState = await productiveMiner.getAdaptiveLearningState();
            expect(learningState.totalBlocks).to.equal(10);
        });

        it("Should handle extreme difficulty values", async function () {
            await productiveMiner.connect(miner1).createBlock(
                "Prime Pattern Discovery",
                50, // Maximum difficulty
                1024, // High security
                true
            );

            const learningState = await productiveMiner.getAdaptiveLearningState();
            expect(learningState.totalBlocks).to.equal(1);
        });
    });

    describe("Performance Metrics", function () {
        it("Should track comprehensive learning metrics", async function () {
            // Create diverse blocks
            for (let i = 0; i < 10; i++) {
                await productiveMiner.connect(miner1).createBlock(
                    "Prime Pattern Discovery",
                    20 + i * 3,
                    256 + i * 64,
                    i % 2 === 0
                );
            }

            const learningState = await productiveMiner.getAdaptiveLearningState();
            
            // Should have comprehensive metrics
            expect(learningState.totalBlocks).to.equal(10);
            expect(learningState.successfulBlocks).to.equal(5);
            expect(learningState.failedBlocks).to.equal(5);
            expect(learningState.averageAlgorithmEfficiency).to.be.gt(0);
            expect(learningState.averageSecurityStrength).to.be.gt(0);
            expect(learningState.currentLearningRate).to.be.gt(0);
        });

        it("Should provide detailed block metrics", async function () {
            await productiveMiner.connect(miner1).createBlock(
                "Riemann Zero Computation",
                30,
                512,
                true
            );

            const blockMetrics = await productiveMiner.getBlockLearningMetrics(1);
            
            expect(blockMetrics.algorithmEfficiency).to.be.gt(0);
            expect(blockMetrics.securityStrength).to.be.gt(0);
        });
    });
}); 