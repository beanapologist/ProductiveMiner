const { ethers } = require('ethers');

async function checkMinedBalance() {
    console.log('💰 Checking MINED Token Balance...');
    
    // Contract addresses
    const MINED_TOKEN_ADDRESS = '0x29Da977Cd0b3C5326fc02EcC8D0C7efC294290E2';
    
    // Connect to local blockchain
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    
    // MINED Token ABI (just the functions we need)
    const minedTokenABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        'function totalSupply() view returns (uint256)'
    ];
    
    try {
        const minedToken = new ethers.Contract(MINED_TOKEN_ADDRESS, minedTokenABI, provider);
        
        // Get token info
        const name = await minedToken.name();
        const symbol = await minedToken.symbol();
        const decimals = await minedToken.decimals();
        const totalSupply = await minedToken.totalSupply();
        
        console.log('\n📋 MINED Token Info:');
        console.log('   Name:', name);
        console.log('   Symbol:', symbol);
        console.log('   Decimals:', decimals);
        console.log('   Total Supply:', ethers.formatUnits(totalSupply, decimals), 'MINED');
        console.log('   Contract Address:', MINED_TOKEN_ADDRESS);
        
        // Check balances for test accounts
        const testAccounts = [
            '0xFfe7a1c2B61eB2bc64d3932F5Db1DA18CF92fFb9', // Deployer
            '0x111B1c000d6fF7cE7b5e74A51bDA92beEFdcff26', // Test account 1
            '0x7008ff5f7c7769221dad22c3a5445cceee1291ad', // Test account 2
            '0x638d19668f502e8dc04e5d01d987d336ff451e8a', // Test account 3
            '0x75c121a56e99af6254ffb574fa57f9f33db4dcf1'  // Test account 4
        ];
        
        console.log('\n💰 Account Balances:');
        for (let i = 0; i < testAccounts.length; i++) {
            const account = testAccounts[i];
            const balance = await minedToken.balanceOf(account);
            const formattedBalance = ethers.formatUnits(balance, decimals);
            
            console.log(`   Account ${i + 1}: ${formattedBalance} MINED`);
            console.log(`   Address: ${account}`);
            console.log('');
        }
        
        // Check Solidarity contract balance
        const solidarityAddress = '0x05D277F6FB68EB0460f4488608C747EaEdDC7429';
        const solidarityBalance = await minedToken.balanceOf(solidarityAddress);
        const formattedSolidarityBalance = ethers.formatUnits(solidarityBalance, decimals);
        
        console.log('🏛️ Solidarity Contract Balance:');
        console.log(`   ${formattedSolidarityBalance} MINED`);
        console.log(`   Address: ${solidarityAddress}`);
        
    } catch (error) {
        console.error('❌ Error checking balance:', error.message);
    }
}

// Run the function
checkMinedBalance()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    }); 