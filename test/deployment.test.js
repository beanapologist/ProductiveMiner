const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployment", function () {
  it("Should deploy ProductiveMiner contract successfully", async function () {
    const [owner] = await ethers.getSigners();
    
    const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
    const productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.waitForDeployment();
    
    const address = await productiveMiner.getAddress();
    expect(address).to.be.a("string");
    expect(address.length).to.equal(42); // Ethereum address length
    expect(address).to.match(/^0x[a-fA-F0-9]{40}$/); // Valid Ethereum address format
    
    console.log("✅ ProductiveMiner deployed at:", address);
    console.log("✅ Owner address:", owner.address);
  });

  it("Should have correct initial state after deployment", async function () {
    const [owner] = await ethers.getSigners();
    
    const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
    const productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.waitForDeployment();
    
    // Check initial values
    expect(await productiveMiner.owner()).to.equal(owner.address);
    expect(await productiveMiner.maxDifficulty()).to.equal(50);
    expect(await productiveMiner.baseReward()).to.equal(100);
    expect(await productiveMiner.totalDiscoveries()).to.equal(0);
    expect(await productiveMiner.totalRewardsDistributed()).to.equal(0);
    
    console.log("✅ Contract initialized with correct default values");
  });
}); 