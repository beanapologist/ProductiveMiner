// MetaMask integration service for ProductiveMiner TestNet
import { getContractAddresses, MINED_TOKEN_ADDRESS } from '../config/contracts';

class MetaMaskService {
  constructor() {
    this.isConnected = false;
    this.currentAccount = null;
    this.currentNetwork = null;
    this.listeners = [];
    this.provider = null;
    
    // TestNet configuration
    this.testnetConfig = {
      chainId: '0x539', // 1337 in hex
      chainName: 'ProductiveMiner TestNet',
      nativeCurrency: {
        name: 'MINED',
        symbol: 'MINED',
        decimals: 18
      },
      rpcUrls: ['http://localhost:8545'],
      blockExplorerUrls: ['http://localhost:3000/explorer']
    };

    // MINED Token configuration
    this.minedTokenConfig = {
      address: MINED_TOKEN_ADDRESS,
      name: 'ProductiveMiner Token',
      symbol: 'MINED',
      decimals: 18,
      totalSupply: '1000000000000000000000000'
    };

    // Initialize MetaMask connection
    this.initialize();
  }

  // Initialize MetaMask connection
  async initialize() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        this.provider = window.ethereum;
        console.log('🦊 MetaMask detected');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check if already connected
        const accounts = await this.provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          this.currentAccount = accounts[0];
          this.isConnected = true;
          this.notifyListeners();
        }
        
        // Check current network
        await this.checkNetwork();
        
      } else {
        console.log('⚠️ MetaMask not detected');
        this.notifyListeners();
      }
    } catch (error) {
      console.error('MetaMask initialization error:', error);
      this.notifyListeners();
    }
  }

  // Set up MetaMask event listeners
  setupEventListeners() {
    if (!this.provider) return;

    // Account changes
    this.provider.on('accountsChanged', (accounts) => {
      console.log('🔄 MetaMask accounts changed:', accounts);
      this.currentAccount = accounts.length > 0 ? accounts[0] : null;
      this.isConnected = accounts.length > 0;
      this.notifyListeners();
    });

    // Network changes
    this.provider.on('chainChanged', (chainId) => {
      console.log('🔄 MetaMask network changed:', chainId);
      this.currentNetwork = chainId;
      this.notifyListeners();
    });

    // Connection status
    this.provider.on('connect', (connectInfo) => {
      console.log('✅ MetaMask connected:', connectInfo);
      this.isConnected = true;
      this.notifyListeners();
    });

    this.provider.on('disconnect', (error) => {
      console.log('❌ MetaMask disconnected:', error);
      this.isConnected = false;
      this.currentAccount = null;
      this.notifyListeners();
    });
  }

  // Connect to MetaMask
  async connect() {
    try {
      if (!this.provider) {
        throw new Error('MetaMask not detected. Please install MetaMask extension.');
      }

      console.log('🔗 Connecting to MetaMask...');
      
      // Request account access
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        this.currentAccount = accounts[0];
        this.isConnected = true;
        
        // Check and switch to correct network
        await this.switchToTestnet();
        
        console.log('✅ MetaMask connected successfully');
        this.notifyListeners();
        return { success: true, account: this.currentAccount };
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      this.notifyListeners();
      return { success: false, error: error.message };
    }
  }

  // Disconnect from MetaMask
  disconnect() {
    this.isConnected = false;
    this.currentAccount = null;
    this.currentNetwork = null;
    this.notifyListeners();
  }

  // Check current network
  async checkNetwork() {
    try {
      if (!this.provider) return null;

      const chainId = await this.provider.request({ method: 'eth_chainId' });
      this.currentNetwork = chainId;
      
      console.log('🌐 Current network:', chainId);
      this.notifyListeners();
      
      return chainId;
    } catch (error) {
      console.error('Network check error:', error);
      return null;
    }
  }

  // Switch to TestNet network
  async switchToTestnet() {
    try {
      if (!this.provider) {
        throw new Error('MetaMask not available');
      }

      const currentChainId = await this.provider.request({ method: 'eth_chainId' });
      
      if (currentChainId !== this.testnetConfig.chainId) {
        console.log('🔄 Switching to TestNet network...');
        
        try {
          // Try to switch to the network
          await this.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: this.testnetConfig.chainId }]
          });
        } catch (switchError) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            console.log('➕ Adding TestNet network to MetaMask...');
            await this.provider.request({
              method: 'wallet_addEthereumChain',
              params: [this.testnetConfig]
            });
          } else {
            throw switchError;
          }
        }
        
        console.log('✅ Switched to TestNet network');
      }
      
      this.currentNetwork = this.testnetConfig.chainId;
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Network switch error:', error);
      return false;
    }
  }

  // Get account balance
  async getBalance(address = null) {
    try {
      if (!this.provider || !this.isConnected) {
        throw new Error('MetaMask not connected');
      }

      const targetAddress = address || this.currentAccount;
      if (!targetAddress) {
        throw new Error('No account address available');
      }

      const balance = await this.provider.request({
        method: 'eth_getBalance',
        params: [targetAddress, 'latest']
      });

      // Convert from wei to MINED tokens (assuming 18 decimals)
      const balanceInTokens = parseInt(balance, 16) / Math.pow(10, 18);
      
      return {
        success: true,
        balance: balanceInTokens,
        balanceWei: balance,
        address: targetAddress
      };
    } catch (error) {
      console.error('Balance check error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get MINED token balance
  async getMinedTokenBalance(address = null) {
    try {
      if (!this.provider || !this.isConnected) {
        throw new Error('MetaMask not connected');
      }

      const targetAddress = address || this.currentAccount;
      if (!targetAddress) {
        throw new Error('No account address available');
      }

      // ERC-20 balanceOf function call
      const data = '0x70a08231' + '000000000000000000000000' + targetAddress.slice(2);
      
      const result = await this.provider.request({
        method: 'eth_call',
        params: [{
          to: this.minedTokenConfig.address,
          data: data
        }, 'latest']
      });

      // Convert from wei to MINED tokens
      const balanceInTokens = parseInt(result, 16) / Math.pow(10, this.minedTokenConfig.decimals);
      
      return {
        success: true,
        balance: balanceInTokens,
        balanceWei: result,
        address: targetAddress,
        tokenAddress: this.minedTokenConfig.address
      };
    } catch (error) {
      console.error('MINED token balance check error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add MINED token to MetaMask
  async addMinedTokenToMetaMask() {
    try {
      if (!this.provider || !this.isConnected) {
        throw new Error('MetaMask not connected');
      }

      console.log('➕ Adding MINED token to MetaMask...');

      const wasAdded = await this.provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: this.minedTokenConfig.address,
            symbol: this.minedTokenConfig.symbol,
            decimals: this.minedTokenConfig.decimals,
            image: 'https://productive-miner.com/logo.png' // Optional
          }
        }
      });

      if (wasAdded) {
        console.log('✅ MINED token added to MetaMask');
        return { success: true };
      } else {
        console.log('❌ User rejected adding MINED token');
        return { success: false, error: 'User rejected adding token' };
      }
    } catch (error) {
      console.error('Add MINED token error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send transaction
  async sendTransaction(transaction) {
    try {
      if (!this.provider || !this.isConnected) {
        throw new Error('MetaMask not connected');
      }

      if (!this.currentAccount) {
        throw new Error('No account selected');
      }

      console.log('📤 Sending transaction:', transaction);

      const txHash = await this.provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: this.currentAccount,
          to: transaction.to,
          value: transaction.value ? `0x${parseInt(transaction.value * Math.pow(10, 18)).toString(16)}` : '0x0',
          data: transaction.data || '0x',
          gas: transaction.gas || '0x5208', // 21000 gas
          gasPrice: transaction.gasPrice || '0x3b9aca00' // 1 gwei
        }]
      });

      console.log('✅ Transaction sent:', txHash);
      return { success: true, hash: txHash };
    } catch (error) {
      console.error('Transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign message
  async signMessage(message) {
    try {
      if (!this.provider || !this.isConnected) {
        throw new Error('MetaMask not connected');
      }

      if (!this.currentAccount) {
        throw new Error('No account selected');
      }

      const signature = await this.provider.request({
        method: 'personal_sign',
        params: [message, this.currentAccount]
      });

      return { success: true, signature };
    } catch (error) {
      console.error('Message signing error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get transaction history
  async getTransactionHistory(address = null, limit = 10) {
    try {
      const targetAddress = address || this.currentAccount;
      if (!targetAddress) {
        throw new Error('No account address available');
      }

      // This would typically call your backend API
      // For now, return mock data
      return {
        success: true,
        transactions: [
          {
            hash: '0x1234567890abcdef',
            from: targetAddress,
            to: '0xContractAddress',
            value: '1000000000000000000', // 1 MINED
            gas: '21000',
            gasPrice: '1000000000',
            timestamp: Date.now(),
            status: 'confirmed'
          }
        ]
      };
    } catch (error) {
      console.error('Transaction history error:', error);
      return { success: false, error: error.message };
    }
  }

  // Event listeners
  onStateChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    const state = {
      isConnected: this.isConnected,
      currentAccount: this.currentAccount,
      currentNetwork: this.currentNetwork,
      provider: this.provider
    };
    
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('MetaMask listener error:', error);
      }
    });
  }

  // Get current state
  getState() {
    return {
      isConnected: this.isConnected,
      currentAccount: this.currentAccount,
      currentNetwork: this.currentNetwork,
      provider: this.provider
    };
  }

  // Check if MetaMask is available
  isMetaMaskAvailable() {
    return typeof window.ethereum !== 'undefined';
  }

  // Get network name from chain ID
  getNetworkName(chainId) {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten Testnet',
      '0x4': 'Rinkeby Testnet',
      '0x5': 'Goerli Testnet',
      '0x539': 'ProductiveMiner TestNet'
    };
    return networks[chainId] || 'Unknown Network';
  }

  // Format address for display
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Format balance for display
  formatBalance(balance, decimals = 4) {
    if (balance === null || balance === undefined) return '0';
    return parseFloat(balance).toFixed(decimals);
  }


}

// Create singleton instance
const metamaskService = new MetaMaskService();

export default metamaskService; 