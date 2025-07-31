const { ethers } = require('ethers');

async function addMinedToMetaMask() {
    console.log('🦊 Adding MINED Token to MetaMask...');
    
    // Contract addresses
    const MINED_TOKEN_ADDRESS = '0x29Da977Cd0b3C5326fc02EcC8D0C7efC294290E2';
    const SOLIDARITY_CONTRACT_ADDRESS = '0x05D277F6FB68EB0460f4488608C747EaEdDC7429';
    
    // Check if MetaMask is available
    if (typeof window === 'undefined' || !window.ethereum) {
        console.log('❌ MetaMask not detected. Please install MetaMask extension.');
        return;
    }
    
    try {
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length === 0) {
            console.log('❌ No accounts found. Please connect MetaMask.');
            return;
        }
        
        const userAddress = accounts[0];
        console.log('✅ Connected to MetaMask:', userAddress);
        
        // Add MINED token to MetaMask
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: MINED_TOKEN_ADDRESS,
                    symbol: 'MINED',
                    decimals: 18,
                    image: 'https://productive-miner.com/logo.png'
                }
            }
        });
        
        if (wasAdded) {
            console.log('✅ MINED token added to MetaMask!');
            console.log('📋 Token Details:');
            console.log('   Address:', MINED_TOKEN_ADDRESS);
            console.log('   Symbol: MINED');
            console.log('   Decimals: 18');
        } else {
            console.log('❌ User rejected adding MINED token');
        }
        
        // Check MINED token balance
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const minedToken = new ethers.Contract(
            MINED_TOKEN_ADDRESS,
            [
                'function balanceOf(address owner) view returns (uint256)',
                'function name() view returns (string)',
                'function symbol() view returns (string)',
                'function decimals() view returns (uint8)'
            ],
            provider
        );
        
        try {
            const balance = await minedToken.balanceOf(userAddress);
            const name = await minedToken.name();
            const symbol = await minedToken.symbol();
            const decimals = await minedToken.decimals();
            
            console.log('\n💰 MINED Token Balance:');
            console.log('   Name:', name);
            console.log('   Symbol:', symbol);
            console.log('   Balance:', ethers.utils.formatUnits(balance, decimals), 'MINED');
            console.log('   Raw Balance:', balance.toString());
        } catch (error) {
            console.log('⚠️ Could not fetch MINED token balance:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run if called directly
if (typeof window !== 'undefined') {
    addMinedToMetaMask();
}

module.exports = { addMinedToMetaMask }; 