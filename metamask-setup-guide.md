# 🔗 MetaMask Connection Guide

## 🚨 Current Issue
The frontend is failing to connect to MetaMask because the network configuration doesn't match the local blockchain.

## 📊 Current Blockchain Configuration
- **Chain ID**: 1337 (0x539 in hex)
- **Network ID**: 9999
- **RPC URL**: http://localhost:8545
- **Currency Symbol**: MINED
- **Block Explorer**: http://localhost:3001/explorer

## 🛠️ Step-by-Step Setup

### 1. Install MetaMask
If you haven't already, install MetaMask:
- **Chrome/Firefox**: Visit https://metamask.io/download/
- **Mobile**: Download from App Store/Google Play

### 2. Add Custom Network to MetaMask

#### Method 1: Automatic (Recommended)
1. Open your browser and go to http://localhost:3001
2. Click "🦊 Connect MetaMask" button
3. MetaMask should automatically prompt to add the network
4. Click "Approve" to add the TestNet network

#### Method 2: Manual Network Addition
1. Open MetaMask
2. Click the network dropdown (top of MetaMask)
3. Click "Add Network" → "Add Network Manually"
4. Fill in these details:
   - **Network Name**: ProductiveMiner TestNet
   - **New RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: MINED
   - **Block Explorer URL**: http://localhost:3001/explorer
5. Click "Save"

### 3. Import Test Account
The blockchain has pre-funded accounts. Import one of these private keys:

**Account 1 (Recommended)**:
- **Address**: 0xFfe7a1c2B61eB2bc64d3932F5Db1DA18CF92fFb9
- **Private Key**: 0x82ca44f284c3a6026a49fe56eae093d9b5fb58d7af3e207498ceb8e81584abae
- **Balance**: 1000 ETH

**Account 2**:
- **Address**: 0x111B1c000d6fF7cE7b5e74A51bDA92beEFdcff26
- **Private Key**: 0x106155f9d37d32cb257f63d549a1d84473ff7fe9fcd4ef2fc1ab2bfdfb5d386e
- **Balance**: 1000 ETH

### 4. Import Steps
1. In MetaMask, click the account icon (top right)
2. Click "Import Account"
3. Paste the private key (without the 0x prefix)
4. Click "Import"

### 5. Switch to TestNet Network
1. In MetaMask, click the network dropdown
2. Select "ProductiveMiner TestNet"
3. Verify the network shows "Chain ID: 1337"

## 🔧 Troubleshooting

### Issue: "Failed to connect to local blockchain"
**Solution**: 
1. Ensure all Docker containers are running:
   ```bash
   ./scripts/check-services.sh
   ```

2. Check if blockchain is accessible:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
   --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
   http://localhost:8545
   ```

### Issue: "Wrong Network" in MetaMask
**Solution**:
1. Make sure you're connected to "ProductiveMiner TestNet"
2. Chain ID should be 1337
3. If not, manually add the network using the details above

### Issue: "No accounts found"
**Solution**:
1. Import one of the test accounts using the private keys above
2. Make sure you're on the correct network (Chain ID: 1337)

### Issue: "Insufficient funds"
**Solution**:
1. The test accounts have 1000 ETH each
2. If you're using a different account, import one of the test accounts

## 🎯 Expected Result
After following these steps:
- ✅ MetaMask should connect to the local blockchain
- ✅ You should see your account address in the frontend
- ✅ Balance should show MINED tokens
- ✅ You can start mining and trading

## 📞 Need Help?
If you're still having issues:
1. Check the browser console for error messages
2. Verify all services are running: `./scripts/check-services.sh`
3. Try refreshing the page and reconnecting
4. Make sure you're using the correct network in MetaMask 