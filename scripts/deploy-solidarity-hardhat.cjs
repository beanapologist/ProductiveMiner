const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('🚀 Deploying ProductiveMiner Solidarity Contract using Hardhat...');
    
    // Get the signer
    const [deployer] = await hre.ethers.getSigners();
    console.log('📋 Deployer address:', deployer.address);
    
    // Check deployer balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log('💰 Deployer balance:', hre.ethers.formatEther(balance), 'ETH');
    if (balance === 0n) {
        console.error('❌ Deployer has no balance. Please fund the account.');
        return;
    }
    
    try {
        // Deploy MINED Token
        console.log('🔧 Deploying MINED Token...');
        const MINEDToken = await hre.ethers.getContractFactory("MINEDToken");
        const minedToken = await MINEDToken.deploy();
        const minedTokenAddress = await minedToken.getAddress();
        console.log('✅ MINED Token deployed to:', minedTokenAddress);
        
        // Deploy Solidarity Contract
        console.log('🔧 Deploying ProductiveMiner Solidarity Contract...');
        const ProductiveMinerSolidarity = await hre.ethers.getContractFactory("ProductiveMinerSolidarity");
        const solidarity = await ProductiveMinerSolidarity.deploy(minedTokenAddress);
        const solidarityAddress = await solidarity.getAddress();
        console.log('✅ Solidarity Contract deployed to:', solidarityAddress);
        
        // Initialize the contract
        await initializeContract(solidarity, minedToken, deployer);
        
        // Save deployment info
        const deploymentInfo = {
            minedToken: {
                address: minedTokenAddress,
                name: 'ProductiveMiner Token',
                symbol: 'MINED',
                decimals: 18
            },
            solidarityContract: {
                address: solidarityAddress,
                name: 'ProductiveMiner Solidarity',
                network: 'ProductiveMiner TestNet',
                chainId: 1337
            },
            deployer: deployer.address,
            deployedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(__dirname, '../deployment-solidarity.json'),
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log('📄 Deployment info saved to deployment-solidarity.json');
        console.log('\n🎯 Next Steps:');
        console.log('1. Add MINED token to MetaMask using address:', minedTokenAddress);
        console.log('2. Connect to the Solidarity Contract at:', solidarityAddress);
        console.log('3. Join the solidarity community through the frontend');
        
        return { minedToken, solidarity, deploymentInfo };
        
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        throw error;
    }
}

async function initializeContract(solidarity, minedToken, deployer) {
    console.log('🔧 Initializing Solidarity Contract...');
    
    try {
        // Add some test work types
        const addWorkTypeTx = await solidarity.addWorkType("Quantum Cryptography");
        await addWorkTypeTx.wait();
        console.log('✅ Added Quantum Cryptography work type');
        
        const addWorkTypeTx2 = await solidarity.addWorkType("Machine Learning Optimization");
        await addWorkTypeTx2.wait();
        console.log('✅ Added Machine Learning Optimization work type');
        
        // Fund the reward pool with some tokens
        const fundAmount = hre.ethers.parseEther("10000"); // 10,000 MINED tokens
        const solidarityAddress = await solidarity.getAddress();
        const approveTx = await minedToken.approve(solidarityAddress, fundAmount);
        await approveTx.wait();
        console.log('✅ Approved tokens for solidarity contract');
        
        const depositTx = await solidarity.depositToRewardPool(fundAmount);
        await depositTx.wait();
        console.log('✅ Funded reward pool with 10,000 MINED tokens');
        
        // Join as a test member
        const joinTx = await solidarity.joinSolidarity("Prime Pattern Discovery");
        await joinTx.wait();
        console.log('✅ Joined solidarity as test member');
        
    } catch (error) {
        console.log('⚠️ Some initialization steps failed:', error.message);
        console.log('💡 This is normal if the contract functions are not fully implemented yet');
    }
}

// Execute deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('❌ Deployment failed:', error);
            process.exit(1);
        });
}

module.exports = { main }; 