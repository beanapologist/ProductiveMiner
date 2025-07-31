# 🦊 Adding MINED Token to MetaMask

## ✅ **Quick Setup**

### **Step 1: Connect to TestNet**
1. Open MetaMask
2. Click **"Add Network"** or **"Add Network Manually"**
3. Enter these details:
   - **Network Name**: ProductiveMiner TestNet
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: MINED
   - **Block Explorer URL**: http://localhost:3001/explorer

### **Step 2: Add MINED Token**
1. In MetaMask, click **"Import tokens"** at the bottom
2. Go to **"Custom Token"** tab
3. Enter the token contract address:
   ```
   0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```
4. MetaMask should auto-fill:
   - **Token Symbol**: MINED
   - **Token Decimal**: 18
5. Click **"Add Custom Token"**

### **Step 3: Import Test Account (Optional)**
To get some MINED tokens for testing:

**Account 1**:
- **Address**: `0xFfe7a1c2B61eB2bc64d3932F5Db1DA18CF92fFb9`
- **Private Key**: `0x82ca44f284c3a6026a49fe56eae093d9b5fb58d7af3e207498ceb8e81584abae`

**Account 2**:
- **Address**: `0x111B1c000d6fF7cE7b5e74A51bDA92beEFdcff26`
- **Private Key**: `0x106155f9d37d32cb257f63d549a1d84473ff7fe9fcd4ef2fc1ab2bfdfb5d386e`

### **Step 4: Check Your Balance**
After adding the token:
1. Your MINED balance should appear in MetaMask
2. You can also check it in the TestNet Wallet tab
3. The balance updates in real-time as you mine

## **🔧 Troubleshooting**

### **Token Not Showing**
- Make sure you're on the correct network (Chain ID: 1337)
- Try refreshing the page
- Check if the blockchain is running

### **Wrong Network**
- Switch to "ProductiveMiner TestNet" in MetaMask
- Use the "Switch to TestNet" button in the wallet

### **No Balance Showing**
- Import one of the test accounts with pre-funded MINED
- Check the faucet for free MINED tokens
- Verify the blockchain is running

## **🎯 What You Should See**

After successful setup:
- ✅ MINED token appears in your MetaMask wallet
- ✅ Token balance shows your MINED holdings
- ✅ You can send/receive MINED tokens
- ✅ Balance updates as you mine or earn rewards

## **📱 Frontend Integration**

The TestNet frontend now includes:
- **MINED Token Balance Display**: Shows your current MINED token balance
- **Add Token Button**: One-click button to add MINED token to MetaMask
- **Real-time Updates**: Balance updates automatically
- **Network Detection**: Automatically detects and switches to TestNet

---

**🎉 Your MINED tokens should now be visible in MetaMask!** 