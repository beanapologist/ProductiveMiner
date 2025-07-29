const { ethers } = require('hardhat');

async function migrateContracts() {
    console.log('🚀 Migrating contracts to Besu...');
    
    // Connect to Besu
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    
    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log('📝 Deploying contracts with account:', deployer.address);
    
    // Deploy ProductiveMiner contract
    const ProductiveMiner = await ethers.getContractFactory('ProductiveMiner');
    const productiveMiner = await ProductiveMiner.deploy();
    await productiveMiner.deployed();
    
    console.log('✅ ProductiveMiner deployed to:', productiveMiner.address);
    
    // Deploy ProductiveMinerAdaptive contract
    const ProductiveMinerAdaptive = await ethers.getContractFactory('ProductiveMinerAdaptive');
    const productiveMinerAdaptive = await ProductiveMinerAdaptive.deploy();
    await productiveMinerAdaptive.deployed();
    
    console.log('✅ ProductiveMinerAdaptive deployed to:', productiveMinerAdaptive.address);
    
    // Verify contracts
    console.log('🔍 Verifying contracts...');
    try {
        await hre.run('verify:verify', {
            address: productiveMiner.address,
            constructorArguments: [],
        });
        console.log('✅ ProductiveMiner verified');
    } catch (error) {
        console.log('⚠️  ProductiveMiner verification failed:', error.message);
    }
    
    try {
        await hre.run('verify:verify', {
            address: productiveMinerAdaptive.address,
            constructorArguments: [],
        });
        console.log('✅ ProductiveMinerAdaptive verified');
    } catch (error) {
        console.log('⚠️  ProductiveMinerAdaptive verification failed:', error.message);
    }
    
    // Save deployment info
    const deploymentInfo = {
        network: 'besu',
        chainId: 1337,
        contracts: {
            ProductiveMiner: productiveMiner.address,
            ProductiveMinerAdaptive: productiveMinerAdaptive.address
        },
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };
    
    require('fs').writeFileSync(
        './deployment-besu.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('📄 Deployment info saved to: deployment-besu.json');
    console.log('🎉 Contract migration completed!');
}

migrateContracts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
