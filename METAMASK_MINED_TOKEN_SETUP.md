# 🦊 Adding MINED Token to MetaMask

## ✅ **Quick Setup Guide**

### **1. Connect to TestNet**
First, make sure you're connected to the ProductiveMiner TestNet:
- **Network Name**: ProductiveMiner TestNet
- **RPC URL**: http://localhost:8545
- **Chain ID**: 1337
- **Currency Symbol**: MINED

### **2. Add MINED Token to MetaMask**

#### **Option A: Automatic Addition (Recommended)**
1. Go to the **Wallet** tab in the TestNet
2. Click **"Connect MetaMask"** 
3. MetaMask should automatically prompt to add the MINED token
4. Click **"Add Token"** when prompted

#### **Option B: Manual Addition**
1. Open MetaMask
2. Click **"Import tokens"** at the bottom
3. Go to **"Custom Token"** tab
4. Enter the MINED token contract address:
   ```
   0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```

5. MetaMask should auto-fill:
   - **Token Symbol**: MINED
   - **Token Decimal**: 18

6. Click **"Add Custom Token"**

### **3. MINED Token Details**

```json
{
  "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "token_name": "ProductiveMiner Token",
  "token_symbol": "MINED",
  "decimals": 18,
  "total_supply": "1000000000000000000000000",
  "network": "ProductiveMiner TestNet"
}
```

### **4. Check Your Balance**

After adding the token:
1. Your MINED balance should appear in MetaMask
2. You can see your balance in the TestNet Wallet tab
3. The balance updates in real-time as you mine

### **5. Test Accounts with MINED**

Use these pre-funded accounts:

**Account 1**:
- **Address**: `0xFfe7a1c2B61eB2bc64d3932F5Db1DA18CF92fFb9`
- **Private Key**: `0x82ca44f284c3a6026a49fe56eae093d9b5fb58d7af3e207498ceb8e81584abae`
- **MINED Balance**: 1000 MINED

**Account 2**:
- **Address**: `0x111B1c000d6fF7cE7b5e74A51bDA92beEFdcff26`
- **Private Key**: `0x106155f9d37d32cb257f63d549a1d84473ff7fe9fcd4ef2fc1ab2bfdfb5d386e`
- **MINED Balance**: 1000 MINED

### **6. Troubleshooting**

#### **Token Not Showing**
- Make sure you're on the correct network (Chain ID: 1337)
- Try refreshing the page
- Check if the token contract is deployed

#### **Wrong Network**
- Switch to "ProductiveMiner TestNet" in MetaMask
- Use the "Switch to TestNet" button in the wallet

#### **No Balance Showing**
- Import one of the test accounts with pre-funded MINED
- Check the faucet for free MINED tokens
- Verify the blockchain is running

### **7. Faucet for Free MINED**

If you need more MINED tokens:
1. Visit the faucet section
2. Enter your wallet address
3. Click "Request MINED"
4. Wait for confirmation
5. Check your MetaMask balance

---

**🎯 The MINED token should now appear in your MetaMask wallet with your current balance!**

## **🔧 Technical Details**

The MINED token is a standard ERC-20 token with:
- **Name**: ProductiveMiner Token
- **Symbol**: MINED
- **Decimals**: 18
- **Total Supply**: 1,000,000 MINED tokens
- **Network**: ProductiveMiner TestNet (Chain ID: 1337)

The token contract includes:
- Standard ERC-20 functions (transfer, balanceOf, etc.)
- Minting capability for rewards
- Pre-funded test accounts
- Integration with the ProductiveMiner Solidarity Contract 