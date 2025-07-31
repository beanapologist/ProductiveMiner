import React, { useState, useEffect } from 'react';
import './Wallet.css';
import metamaskService from '../services/metamask';

const Wallet = ({ sharedData }) => {
  const { apiService, formatNumber, formatCurrency } = sharedData;
  
  const [walletData, setWalletData] = useState({
    totalValue: 12500.50,
    totalMined: 15000,
    averagePrice: 0.83,
    currentPrice: 0.85,
    unrealizedPnL: 300.50,
    unrealizedPnLPercent: 2.4,
    realizedPnL: 1250.75,
    totalFees: 45.25
  });

  const [miningEarnings, setMiningEarnings] = useState({
    totalMined: 11907,
    totalRewards: 1907,
    blocksMined: 6,
    averageReward: 318,
    lastMiningReward: 86,
    miningHistory: []
  });

  const [stakingEarnings, setStakingEarnings] = useState({
    totalStaked: 0,
    stakingRewards: 0,
    stakingAPY: 8.5,
    totalValidators: 0,
    averageCommission: 5.0,
    stakingHistory: []
  });

  const [holdings, setHoldings] = useState([
    {
      id: 1,
      type: 'MINED',
      amount: 15000,
      averagePrice: 0.83,
      currentPrice: 0.85,
      currentValue: 12750,
      unrealizedPnL: 300,
      unrealizedPnLPercent: 2.4
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN001',
      type: 'buy',
      amount: 5000,
      price: 0.80,
      total: 4000,
      date: '2024-01-15',
      time: '14:30:25',
      status: 'completed'
    },
    {
      id: 'TXN002',
      type: 'buy',
      amount: 3000,
      price: 0.82,
      total: 2460,
      date: '2024-01-16',
      time: '09:15:42',
      status: 'completed'
    },
    {
      id: 'TXN003',
      type: 'sell',
      amount: 1000,
      price: 0.88,
      total: 880,
      date: '2024-01-17',
      time: '16:45:18',
      status: 'completed'
    },
    {
      id: 'TXN004',
      type: 'buy',
      amount: 7000,
      price: 0.85,
      total: 5950,
      date: '2024-01-18',
      time: '11:20:33',
      status: 'completed'
    }
  ]);

  const [performanceData, setPerformanceData] = useState({
    daily: { change: 2.4, value: 12500.50 },
    weekly: { change: 8.7, value: 11850.25 },
    monthly: { change: 15.2, value: 10850.75 },
    yearly: { change: 45.8, value: 8575.50 }
  });

  // MetaMask state
  const [metamaskState, setMetamaskState] = useState({
    isConnected: false,
    currentAccount: null,
    currentNetwork: null,
    balance: 0,
    minedTokenBalance: 0,
    isConnecting: false,
    error: null
  });

  // MetaMask event listeners
  useEffect(() => {
    const unsubscribe = metamaskService.onStateChange((state) => {
      setMetamaskState(prev => ({
        ...prev,
        isConnected: state.isConnected,
        currentAccount: state.currentAccount,
        currentNetwork: state.currentNetwork
      }));
    });

    return unsubscribe;
  }, []);

  // Fetch MetaMask balance when connected
  useEffect(() => {
    const fetchMetamaskBalance = async () => {
      if (metamaskState.isConnected && metamaskState.currentAccount) {
        try {
          const [balanceResult, minedTokenResult] = await Promise.all([
            metamaskService.getBalance(),
            metamaskService.getMinedTokenBalance()
          ]);
          
          if (balanceResult.success) {
            setMetamaskState(prev => ({
              ...prev,
              balance: balanceResult.balance
            }));
          }
          
          if (minedTokenResult.success) {
            setMetamaskState(prev => ({
              ...prev,
              minedTokenBalance: minedTokenResult.balance
            }));
          }
        } catch (error) {
          console.error('Error fetching MetaMask balance:', error);
        }
      }
    };

    fetchMetamaskBalance();
    
    // Set up periodic balance updates
    const interval = setInterval(fetchMetamaskBalance, 5000);
    return () => clearInterval(interval);
  }, [metamaskState.isConnected, metamaskState.currentAccount]);

  // Fetch real wallet data from backend
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [balanceData, rewardsHistory] = await Promise.all([
          apiService.getBalance(),
          apiService.getRewardsHistory()
        ]);

        // Update mining earnings from balance data
        setMiningEarnings(prev => ({
          ...prev,
          totalMined: balanceData.MINED || 0,
          totalRewards: balanceData.totalMined || 0,
          lastMiningReward: balanceData.totalMined > prev.totalRewards ? 
            balanceData.totalMined - prev.totalRewards : prev.lastMiningReward,
          miningHistory: balanceData.miningHistory || []
        }));

        // Update staking earnings
        setStakingEarnings(prev => ({
          ...prev,
          totalStaked: balanceData.totalStaked || 0,
          stakingRewards: balanceData.stakingRewards || 0,
          stakingHistory: balanceData.stakingHistory || []
        }));

        // Update wallet data
        setWalletData(prev => ({
          ...prev,
          totalMined: balanceData.MINED || 0,
          totalValue: (balanceData.MINED || 0) * prev.currentPrice
        }));

      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();

    // Set up periodic updates
    const interval = setInterval(() => {
      fetchWalletData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [apiService]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWalletData(prev => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = Math.max(0.50, Math.min(1.50, prev.currentPrice + priceChange));
        const newTotalValue = prev.totalMined * newPrice;
        const newUnrealizedPnL = newTotalValue - (prev.totalMined * prev.averagePrice);
        
        return {
          ...prev,
          currentPrice: newPrice,
          totalValue: newTotalValue,
          unrealizedPnL: newUnrealizedPnL,
          unrealizedPnLPercent: ((newUnrealizedPnL / (prev.totalMined * prev.averagePrice)) * 100)
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // MetaMask connection functions
  const connectMetamask = async () => {
    setMetamaskState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      const result = await metamaskService.connect();
      if (result.success) {
        console.log('✅ MetaMask connected successfully');
      } else {
        setMetamaskState(prev => ({ 
          ...prev, 
          error: result.error || 'Failed to connect to MetaMask' 
        }));
      }
    } catch (error) {
      setMetamaskState(prev => ({ 
        ...prev, 
        error: error.message || 'Connection failed' 
      }));
    } finally {
      setMetamaskState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectMetamask = () => {
    metamaskService.disconnect();
  };

  const switchToTestnet = async () => {
    try {
      await metamaskService.switchToTestnet();
    } catch (error) {
      setMetamaskState(prev => ({ 
        ...prev, 
        error: 'Failed to switch to TestNet network' 
      }));
    }
  };

  const addMinedTokenToMetaMask = async () => {
    try {
      const result = await metamaskService.addMinedTokenToMetaMask();
      if (result.success) {
        console.log('✅ MINED token added to MetaMask');
      } else {
        console.error('❌ Failed to add MINED token:', result.error);
      }
    } catch (error) {
      console.error('Error adding MINED token to MetaMask:', error);
    }
  };

  // formatCurrency and formatNumber are already available from sharedData

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <h1>💰 Wallet</h1>
        <p>Your $MINED token holdings and earnings</p>
      </div>

      {/* MetaMask Wallet Section */}
      <div className="metamask-section">
        <div className="metamask-header">
          <h2>🦊 MetaMask Wallet</h2>
          <p>Connect your MetaMask wallet to interact with the TestNet</p>
        </div>

        {!metamaskService.isMetaMaskAvailable() ? (
          <div className="metamask-not-available">
            <div className="alert alert-warning">
              <h3>⚠️ MetaMask Not Detected</h3>
              <p>Please install MetaMask extension to connect your wallet.</p>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Install MetaMask
              </a>
            </div>
          </div>
        ) : (
          <div className="metamask-content">
            {!metamaskState.isConnected ? (
              <div className="metamask-connect">
                <div className="connect-card">
                  <div className="card-icon">🦊</div>
                  <h3>Connect MetaMask</h3>
                  <p>Connect your MetaMask wallet to access your TestNet tokens</p>
                  <button 
                    className={`btn btn-primary ${metamaskState.isConnecting ? 'loading' : ''}`}
                    onClick={connectMetamask}
                    disabled={metamaskState.isConnecting}
                  >
                    {metamaskState.isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                  {metamaskState.error && (
                    <div className="error-message">
                      {metamaskState.error}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="metamask-connected">
                <div className="wallet-info">
                  <div className="account-info">
                    <div className="account-address">
                      <span className="label">Account:</span>
                      <span className="address">{metamaskService.formatAddress(metamaskState.currentAccount)}</span>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigator.clipboard.writeText(metamaskState.currentAccount)}
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
                    <div className="network-info">
                      <span className="label">Network:</span>
                      <span className={`network ${metamaskState.currentNetwork === '0x539' ? 'correct' : 'wrong'}`}>
                        {metamaskService.getNetworkName(metamaskState.currentNetwork)}
                      </span>
                      {metamaskState.currentNetwork !== '0x539' && (
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={switchToTestnet}
                        >
                          Switch to TestNet
                        </button>
                      )}
                    </div>
                    <div className="balance-info">
                      <span className="label">ETH Balance:</span>
                      <span className="balance">
                        {metamaskService.formatBalance(metamaskState.balance)} ETH
                      </span>
                    </div>
                    <div className="mined-token-info">
                      <span className="label">MINED Token:</span>
                      <span className="balance">
                        {metamaskService.formatBalance(metamaskState.minedTokenBalance)} MINED
                      </span>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={addMinedTokenToMetaMask}
                        title="Add MINED token to MetaMask"
                      >
                        ➕ Add Token
                      </button>
                    </div>
                  </div>
                  <div className="wallet-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={disconnectMetamask}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wallet Overview */}
      <div className="wallet-overview">
        <div className="overview-card primary">
          <div className="card-header">
            <h3>Total Balance</h3>
            <span className="value">{formatCurrency(walletData.totalValue)}</span>
          </div>
          <div className="card-content">
            <div className="metric-row">
              <span>Total MINED:</span>
              <span>{formatNumber(walletData.totalMined)}</span>
            </div>
            <div className="metric-row">
              <span>Average Price:</span>
              <span>{formatCurrency(walletData.averagePrice)}</span>
            </div>
            <div className="metric-row">
              <span>Current Price:</span>
              <span>{formatCurrency(walletData.currentPrice)}</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <h3>Unrealized P&L</h3>
            <span className={`value ${walletData.unrealizedPnL >= 0 ? 'positive' : 'negative'}`}>
              {walletData.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(walletData.unrealizedPnL)}
            </span>
          </div>
          <div className="card-content">
            <div className="metric-row">
              <span>Percentage:</span>
              <span className={walletData.unrealizedPnLPercent >= 0 ? 'positive' : 'negative'}>
                {walletData.unrealizedPnLPercent >= 0 ? '+' : ''}{walletData.unrealizedPnLPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <h3>Realized P&L</h3>
            <span className="value positive">{formatCurrency(walletData.realizedPnL)}</span>
          </div>
          <div className="card-content">
            <div className="metric-row">
              <span>Total Fees:</span>
              <span className="negative">{formatCurrency(walletData.totalFees)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staking Overview - Prominent Section */}
      {stakingEarnings.totalStaked > 0 && (
        <div className="staking-overview">
          <div className="staking-hero">
            <div className="staking-hero-content">
              <h2>🏛️ Your Staking Portfolio</h2>
              <p>Track your staked tokens and earned rewards</p>
            </div>
            <div className="staking-hero-stats">
              <div className="stat-item">
                <span className="stat-value">{formatNumber(stakingEarnings.totalStaked)}</span>
                <span className="stat-label">Total Staked</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatNumber(stakingEarnings.stakingRewards)}</span>
                <span className="stat-label">Earned Rewards</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stakingEarnings.stakingAPY}%</span>
                <span className="stat-label">Current APY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Cards */}
      <div className="earnings-section">
        <h3>Earnings</h3>
        <div className="earnings-grid">
          {/* Mining Earnings Card */}
          <div className="earnings-card mining">
            <div className="card-header">
              <h3>⛏️ Mining Earnings</h3>
              <span className="value">{formatNumber(miningEarnings.totalMined)} MINED</span>
            </div>
            <div className="card-content">
              <div className="metric-row">
                <span>Total Rewards:</span>
                <span>{formatNumber(miningEarnings.totalRewards)}</span>
              </div>
              <div className="metric-row">
                <span>Blocks Mined:</span>
                <span>{miningEarnings.blocksMined}</span>
              </div>
              <div className="metric-row">
                <span>Average Reward:</span>
                <span>{formatNumber(miningEarnings.averageReward)}</span>
              </div>
              <div className="metric-row">
                <span>Last Reward:</span>
                <span>{formatNumber(miningEarnings.lastMiningReward)}</span>
              </div>
            </div>
            <div className="card-footer">
              <span className="label">Mining History</span>
              <span className="count">{miningEarnings.miningHistory.length} transactions</span>
            </div>
          </div>

          {/* Staking Earnings Card */}
          <div className="earnings-card staking">
            <div className="card-header">
              <h3>🏛️ Staking Earnings</h3>
              <span className="value">{formatNumber(stakingEarnings.stakingRewards)} MINED</span>
            </div>
            <div className="card-content">
              <div className="metric-row">
                <span>Total Staked:</span>
                <span>{formatNumber(stakingEarnings.totalStaked)}</span>
              </div>
              <div className="metric-row">
                <span>APY Rate:</span>
                <span>{stakingEarnings.stakingAPY}%</span>
              </div>
              <div className="metric-row">
                <span>Validators:</span>
                <span>{stakingEarnings.totalValidators}</span>
              </div>
              <div className="metric-row">
                <span>Avg Commission:</span>
                <span>{stakingEarnings.averageCommission}%</span>
              </div>
            </div>
            <div className="card-footer">
              <span className="label">Staking History</span>
              <span className="count">{stakingEarnings.stakingHistory.length} transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h3>Performance</h3>
        <div className="performance-grid">
          <div className="performance-card">
            <span className="period">24h</span>
            <span className={`change ${performanceData.daily.change >= 0 ? 'positive' : 'negative'}`}>
              {performanceData.daily.change >= 0 ? '+' : ''}{performanceData.daily.change.toFixed(1)}%
            </span>
            <span className="value">{formatCurrency(performanceData.daily.value)}</span>
          </div>
          <div className="performance-card">
            <span className="period">7d</span>
            <span className={`change ${performanceData.weekly.change >= 0 ? 'positive' : 'negative'}`}>
              {performanceData.weekly.change >= 0 ? '+' : ''}{performanceData.weekly.change.toFixed(1)}%
            </span>
            <span className="value">{formatCurrency(performanceData.weekly.value)}</span>
          </div>
          <div className="performance-card">
            <span className="period">30d</span>
            <span className={`change ${performanceData.monthly.change >= 0 ? 'positive' : 'negative'}`}>
              {performanceData.monthly.change >= 0 ? '+' : ''}{performanceData.monthly.change.toFixed(1)}%
            </span>
            <span className="value">{formatCurrency(performanceData.monthly.value)}</span>
          </div>
          <div className="performance-card">
            <span className="period">1y</span>
            <span className={`change ${performanceData.yearly.change >= 0 ? 'positive' : 'negative'}`}>
              {performanceData.yearly.change >= 0 ? '+' : ''}{performanceData.yearly.change.toFixed(1)}%
            </span>
            <span className="value">{formatCurrency(performanceData.yearly.value)}</span>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="holdings-section">
        <h3>Holdings</h3>
        <div className="holdings-table">
          <div className="table-header">
            <span>Asset</span>
            <span>Amount</span>
            <span>Average Price</span>
            <span>Current Price</span>
            <span>Current Value</span>
            <span>Unrealized P&L</span>
          </div>
          {holdings.map((holding) => (
            <div key={holding.id} className="holding-row">
              <div className="asset-info">
                <span className="asset-symbol">{holding.type}</span>
                <span className="asset-name">ProductiveMiner Token</span>
              </div>
              <span className="amount">{formatNumber(holding.amount)}</span>
              <span className="avg-price">{formatCurrency(holding.averagePrice)}</span>
              <span className="current-price">{formatCurrency(holding.currentPrice)}</span>
              <span className="current-value">{formatCurrency(holding.currentValue)}</span>
              <div className="pnl-info">
                <span className={`pnl-amount ${holding.unrealizedPnL >= 0 ? 'positive' : 'negative'}`}>
                  {holding.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(holding.unrealizedPnL)}
                </span>
                <span className={`pnl-percent ${holding.unrealizedPnLPercent >= 0 ? 'positive' : 'negative'}`}>
                  {holding.unrealizedPnLPercent >= 0 ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="transactions-section">
        <h3>Transaction History</h3>
        <div className="transactions-table">
          <div className="table-header">
            <span>Date</span>
            <span>Type</span>
            <span>Amount</span>
            <span>Price</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {transactions.map((transaction) => (
            <div key={transaction.id} className={`transaction-row ${transaction.type}`}>
              <div className="date-info">
                <span className="date">{formatDate(transaction.date)}</span>
                <span className="time">{transaction.time}</span>
              </div>
              <span className={`type ${transaction.type}`}>{transaction.type.toUpperCase()}</span>
              <span className="amount">{formatNumber(transaction.amount)} MINED</span>
              <span className="price">{formatCurrency(transaction.price)}</span>
              <span className="total">{formatCurrency(transaction.total)}</span>
              <span className={`status ${transaction.status}`}>{transaction.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet; 