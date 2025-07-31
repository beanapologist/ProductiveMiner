# 🦊 MetaMask TestNet Quick Start Guide

## 🚀 Quick Deployment

### 1. Deploy TestNet with MetaMask Integration

```bash
# Run the deployment script
./scripts/deploy-testnet-metamask.sh
```

This script will:
- ✅ Set up the complete TestNet environment
- ✅ Configure MetaMask network settings
- ✅ Start all services (blockchain, API, frontend, monitoring)
- ✅ Initialize test accounts with MINED tokens

### 2. Access the TestNet

Once deployment is complete, access the TestNet at:
- **Frontend**: http://localhost:3001
- **API**: http://localhost:3000
- **Blockchain**: http://localhost:8545
- **Monitoring**: http://localhost:3002 (admin/testnet_admin)

## 🦊 MetaMask Setup

### Step 1: Install MetaMask

1. Visit [MetaMask.io](https://metamask.io/download/)
2. Install the browser extension for your browser
3. Create a new wallet or import existing one

### Step 2: Connect to TestNet

#### Automatic Setup (Recommended)
1. Open your browser and go to http://localhost:3001
2. Navigate to the **Wallet** tab
3. Click the **"Connect MetaMask"** button
4. MetaMask will automatically prompt to add the TestNet network
5. Click **"Approve"** to add the network

#### Manual Setup (If automatic fails)
1. Open MetaMask
2. Click the network dropdown (top of MetaMask)
3. Click **"Add Network"** → **"Add Network Manually"**
4. Fill in these details:
   - **Network Name**: ProductiveMiner TestNet
   - **New RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: MINED
   - **Block Explorer URL**: http://localhost:3001/explorer
5. Click **"Save"**

### Step 3: Import Test Account

The TestNet comes with pre-funded accounts. Import one of these:

**Account 1 (Recommended)**:
- **Address**: `0xFfe7a1c2B61eB2bc64d3932F5Db1DA18CF92fFb9`
- **Private Key**: `0x82ca44f284c3a6026a49fe56eae093d9b5fb58d7af3e207498ceb8e81584abae`
- **Balance**: 1000 MINED

**Account 2**:
- **Address**: `0x111B1c000d6fF7cE7b5e74A51bDA92beEFdcff26`
- **Private Key**: `0x106155f9d37d32cb257f63d549a1d84473ff7fe9fcd4ef2fc1ab2bfdfb5d386e`
- **Balance**: 1000 MINED

#### Import Steps:
1. In MetaMask, click the account icon (top right)
2. Click **"Import Account"**
3. Paste the private key (without the 0x prefix)
4. Click **"Import"**

## 💰 Using the Wallet

### Wallet Features

Once connected, you can:

1. **View Balance**: See your MINED token balance in real-time
2. **Copy Address**: Click the copy button next to your address
3. **Switch Networks**: Automatically switch to TestNet if on wrong network
4. **Disconnect**: Safely disconnect your wallet

### TestNet Features

- **Chain ID**: 1337 (0x539 in hex)
- **Currency**: MINED tokens
- **Block Time**: ~15 seconds
- **Pre-funded Accounts**: 1000 MINED each
- **Faucet**: Available for additional tokens

## 🔧 Troubleshooting

### "MetaMask not detected"
**Solution**: 
- Make sure MetaMask extension is installed
- Refresh the page and try again
- Check if MetaMask is unlocked

### "Wrong Network"
**Solution**:
- Make sure you're connected to "ProductiveMiner TestNet"
- Chain ID should be 1337
- Use the "Switch to TestNet" button in the wallet

### "No accounts found"
**Solution**:
- Import one of the test accounts using the private keys above
- Make sure you're on the correct network (Chain ID: 1337)

### "Insufficient funds"
**Solution**:
- The test accounts have 1000 MINED each
- Use the faucet at http://localhost:3000/faucet
- Import a different test account

### "Connection failed"
**Solution**:
- Check if all services are running: `./scripts/check-services.sh`
- Verify blockchain is accessible: `curl http://localhost:8545`
- Restart the TestNet: `docker-compose -f docker-compose.testnet.yml restart`

## 🧪 Testing MetaMask Integration

Run the integration test to verify everything is working:

```bash
# Test MetaMask integration
node scripts/test-metamask-integration.js
```

This will test:
- ✅ MetaMask availability
- ✅ Network connection
- ✅ Account connection
- ✅ Balance checking
- ✅ Transaction signing
- ✅ Network switching

## 📊 Monitoring

### Service Status
Check if all services are running:
```bash
./scripts/check-services.sh
```

### View Logs
```bash
# View all logs
docker-compose -f docker-compose.testnet.yml logs -f

# View specific service logs
docker-compose -f docker-compose.testnet.yml logs -f testnet-api
docker-compose -f docker-compose.testnet.yml logs -f testnet-blockchain
```

### Grafana Dashboard
Access monitoring dashboard at http://localhost:3002
- **Username**: admin
- **Password**: testnet_admin

## 🛠️ Development

### Useful Commands

```bash
# Start TestNet
./scripts/deploy-testnet-metamask.sh

# Stop TestNet
docker-compose -f docker-compose.testnet.yml down

# Restart services
docker-compose -f docker-compose.testnet.yml restart

# Check service status
./scripts/check-services.sh

# View logs
docker-compose -f docker-compose.testnet.yml logs -f

# Test MetaMask integration
node scripts/test-metamask-integration.js
```

### Configuration Files

- **Environment**: `.env.testnet`
- **MetaMask Network**: `config/metamask-network.json`
- **Docker Compose**: `docker-compose.testnet.yml`

## 🎯 Expected Results

After following this guide, you should have:

- ✅ MetaMask connected to ProductiveMiner TestNet
- ✅ Test account with 1000 MINED tokens
- ✅ Real-time balance display in the wallet
- ✅ Ability to sign transactions
- ✅ Network switching functionality
- ✅ Complete TestNet environment running

## 📞 Need Help?

If you encounter issues:

1. **Check Service Status**: `./scripts/check-services.sh`
2. **View Logs**: `docker-compose -f docker-compose.testnet.yml logs -f`
3. **Test Integration**: `node scripts/test-metamask-integration.js`
4. **Restart Services**: `docker-compose -f docker-compose.testnet.yml restart`
5. **Check Browser Console**: Look for error messages in browser dev tools

## 🚀 Next Steps

Once MetaMask is connected:

1. **Explore the Wallet**: Check your balance and transaction history
2. **Try Mining**: Use the mining interface to earn more MINED tokens
3. **Test Transactions**: Send MINED tokens between accounts
4. **Monitor Performance**: Use the analytics dashboard
5. **Develop**: Build on top of the TestNet infrastructure

---

**🎉 Congratulations!** You now have a fully functional ProductiveMiner TestNet with MetaMask integration ready for development and testing. 