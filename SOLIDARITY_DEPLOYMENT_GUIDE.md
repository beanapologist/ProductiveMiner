# ProductiveMiner Solidarity Contract Deployment Guide

## Overview

The ProductiveMinerSolidarity contract is a comprehensive smart contract that governs community participation, collaborative research, and equitable reward distribution for mathematical computation work.

## Contract Features

### Core Functionality
- **Member Management**: Join solidarity community with expertise areas
- **Computational Results Processing**: Submit and verify mathematical work results
- **Collaborative Projects**: Create and manage research projects
- **Governance**: Proposal creation and voting system
- **Reward Distribution**: Multi-pool reward system with solidarity bonuses

### Mathematical Work Types Supported
- Prime Pattern Discovery
- Riemann Zero Computation
- Yang-Mills Field Theory
- Goldbach Conjecture Verification
- Navier-Stokes Simulation
- Birch-Swinnerton-Dyer
- Elliptic Curve Cryptography
- Lattice Cryptography
- Poincare Conjecture

## Deployment Steps

### Step 1: Prerequisites

1. **Install Dependencies**
   ```bash
   npm install @openzeppelin/contracts ethers hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Ensure Local Blockchain is Running**
   ```bash
   # Check if blockchain is accessible
   curl -X POST -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
     http://localhost:8545
   ```

### Step 2: Compile Contracts

1. **Fix Hardhat Configuration**
   ```bash
   # Rename config file for ESM compatibility
   mv hardhat.config.js hardhat.config.cjs
   ```

2. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

### Step 3: Deploy Contracts

#### Option A: Using Hardhat (Recommended)

1. **Create Deployment Script**
   ```javascript
   // scripts/deploy-solidarity-hardhat.js
   const hre = require("hardhat");

   async function main() {
     // Deploy MINED Token
     const MINEDToken = await hre.ethers.getContractFactory("MINEDToken");
     const minedToken = await MINEDToken.deploy();
     await minedToken.deployed();
     console.log("MINED Token deployed to:", minedToken.address);

     // Deploy Solidarity Contract
     const ProductiveMinerSolidarity = await hre.ethers.getContractFactory("ProductiveMinerSolidarity");
     const solidarity = await ProductiveMinerSolidarity.deploy(minedToken.address);
     await solidarity.deployed();
     console.log("Solidarity Contract deployed to:", solidarity.address);

     return { minedToken, solidarity };
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

2. **Run Deployment**
   ```bash
   npx hardhat run scripts/deploy-solidarity-hardhat.js --network localhost
   ```

#### Option B: Using Ethers Directly

1. **Create Direct Deployment Script**
   ```javascript
   // scripts/deploy-solidarity-direct.js
   const { ethers } = require('ethers');
   const fs = require('fs');

   async function deploy() {
     const provider = new ethers.JsonRpcProvider('http://localhost:8545');
     const wallet = new ethers.Wallet('0x82ca44f284c3a6026a49fe56eae093d9b5fb58d7af3e207498ceb8e81584abae', provider);

     // Load compiled artifacts
     const minedTokenArtifact = require('../artifacts/contracts/MINEDToken.sol/MINEDToken.json');
     const solidarityArtifact = require('../artifacts/contracts/ProductiveMinerSolidarity.sol/ProductiveMinerSolidarity.json');

     // Deploy MINED Token
     const minedTokenFactory = new ethers.ContractFactory(
       minedTokenArtifact.abi,
       minedTokenArtifact.bytecode,
       wallet
     );
     const minedToken = await minedTokenFactory.deploy();
     await minedToken.deployed();

     // Deploy Solidarity Contract
     const solidarityFactory = new ethers.ContractFactory(
       solidarityArtifact.abi,
       solidarityArtifact.bytecode,
       wallet
     );
     const solidarity = await solidarityFactory.deploy(minedToken.address);
     await solidarity.deployed();

     console.log('MINED Token:', minedToken.address);
     console.log('Solidarity Contract:', solidarity.address);

     return { minedToken, solidarity };
   }

   deploy().catch(console.error);
   ```

### Step 4: Initialize Contract

After deployment, initialize the contract with basic setup:

```javascript
async function initializeContract(solidarity, minedToken, wallet) {
  // Add work types
  await solidarity.addWorkType("Quantum Cryptography");
  await solidarity.addWorkType("Machine Learning Optimization");

  // Fund reward pool
  const fundAmount = ethers.parseEther("10000");
  await minedToken.approve(solidarity.address, fundAmount);
  await solidarity.depositToRewardPool(fundAmount);

  // Join as test member
  await solidarity.joinSolidarity("Prime Pattern Discovery");
}
```

## Contract Interaction Examples

### 1. Join Solidarity Community
```javascript
await solidarityContract.joinSolidarity("Prime Pattern Discovery");
```

### 2. Submit Computational Results
```javascript
const workType = "Prime Pattern Discovery";
const totalRecords = 1000;
const computationTime = 5000; // milliseconds
const accuracy = 9970; // 99.70%
const patternsDiscovered = ["twin_primes", "cousin_primes"];

await solidarityContract.submitComputationalResult(
  workType,
  totalRecords,
  computationTime,
  accuracy,
  patternsDiscovered
);
```

### 3. Create Collaborative Project
```javascript
const title = "Advanced Prime Pattern Research";
const description = "Collaborative research on prime number patterns";
const workTypes = ["Prime Pattern Discovery", "Riemann Zero Computation"];
const participants = [address1, address2, address3];
const budget = ethers.parseEther("1000");
const difficulty = 75;

await solidarityContract.createProject(
  title,
  description,
  workTypes,
  participants,
  budget,
  difficulty
);
```

### 4. Create Governance Proposal
```javascript
const title = "Increase Pattern Discovery Bonus";
const description = "Proposal to increase bonus for pattern discoveries";

await solidarityContract.createProposal(title, description);
```

## MetaMask Integration

### Add MINED Token to MetaMask
1. Open MetaMask
2. Go to "Import tokens"
3. Add token with contract address from deployment
4. Token details:
   - Name: ProductiveMiner Token
   - Symbol: MINED
   - Decimals: 18

### Connect to Solidarity Contract
1. Add custom network:
   - Network Name: ProductiveMiner TestNet
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

## Troubleshooting

### Common Issues

1. **Compilation Errors**
   - Ensure OpenZeppelin contracts are installed
   - Check Solidity version compatibility
   - Verify import paths

2. **Deployment Failures**
   - Check blockchain connection
   - Verify account has sufficient funds
   - Ensure correct bytecode format

3. **Gas Estimation Errors**
   - Check contract constructor parameters
   - Verify ABI matches bytecode
   - Ensure all dependencies are compiled

### Debug Commands

```bash
# Check blockchain status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545

# Check account balance
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xFfe7a1c2B61eB2bc64d3932F5Db1DA18CF92fFb9","latest"],"id":1}' \
  http://localhost:8545

# Compile with verbose output
npx hardhat compile --verbose
```

## Next Steps

After successful deployment:

1. **Frontend Integration**: Connect the deployed contracts to your frontend application
2. **Testing**: Create comprehensive tests for all contract functions
3. **Documentation**: Update API documentation with contract addresses
4. **Monitoring**: Set up monitoring for contract events and transactions

## Contract Addresses

After deployment, save the contract addresses:

```json
{
  "minedToken": {
    "address": "0x...",
    "name": "ProductiveMiner Token",
    "symbol": "MINED"
  },
  "solidarityContract": {
    "address": "0x...",
    "name": "ProductiveMiner Solidarity"
  }
}
```

## Support

For issues with deployment or contract interaction, check:
1. Hardhat documentation
2. OpenZeppelin contracts documentation
3. Ethers.js documentation
4. Project logs and error messages 