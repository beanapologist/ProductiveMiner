import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ sharedData }) => {
  console.log('Exchange Dashboard sharedData:', sharedData);

  const {
    blockchainData,
    miningState,
    validatorsData,
    discoveriesData,
    systemHealth,
    formatNumber,
    formatBitStrength,
    formatCurrency
  } = sharedData;

  // Exchange-specific state
  const [exchangeData, setExchangeData] = useState({
    currentPrice: 0.85,
    priceChange24h: 0.12,
    priceChangePercent: 14.12,
    volume24h: 1250000,
    marketCap: 85000000,
    circulatingSupply: 100000000,
    totalSupply: 1000000000,
    high24h: 0.92,
    low24h: 0.78,
    lastUpdated: new Date()
  });

  // Fetch real-time trading data
  useEffect(() => {
    if (!sharedData.isConnected) return;

    const fetchTradingData = async () => {
      try {
        const status = await sharedData.apiService.getSystemStatus();
        if (status.trading) {
          setExchangeData(prev => ({
            ...prev,
            currentPrice: status.trading.price || prev.currentPrice,
            priceChange24h: status.trading.change24h || prev.priceChange24h,
            priceChangePercent: ((status.trading.price - (status.trading.price - status.trading.change24h)) / (status.trading.price - status.trading.change24h)) * 100 || prev.priceChangePercent,
            volume24h: status.trading.volume24h || prev.volume24h,
            high24h: status.trading.high24h || prev.high24h,
            low24h: status.trading.low24h || prev.low24h,
            lastUpdated: new Date()
          }));
        }
      } catch (error) {
        console.error('Error fetching trading data:', error);
      }
    };

    // Initial fetch
    fetchTradingData();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchTradingData, 10000);

    return () => clearInterval(interval);
  }, [sharedData.isConnected, sharedData.apiService]);

  const [orderBook, setOrderBook] = useState({
    bids: [
      { price: 0.84, amount: 50000, total: 42000 },
      { price: 0.83, amount: 75000, total: 62250 },
      { price: 0.82, amount: 100000, total: 82000 },
      { price: 0.81, amount: 125000, total: 101250 },
      { price: 0.80, amount: 150000, total: 120000 }
    ],
    asks: [
      { price: 0.86, amount: 45000, total: 38700 },
      { price: 0.87, amount: 70000, total: 60900 },
      { price: 0.88, amount: 95000, total: 83600 },
      { price: 0.89, amount: 120000, total: 106800 },
      { price: 0.90, amount: 145000, total: 130500 }
    ]
  });

  const [recentTrades, setRecentTrades] = useState([
    { time: '14:32:15', price: 0.85, amount: 2500, type: 'buy' },
    { time: '14:31:42', price: 0.84, amount: 1800, type: 'sell' },
    { time: '14:31:18', price: 0.85, amount: 3200, type: 'buy' },
    { time: '14:30:55', price: 0.86, amount: 1500, type: 'sell' },
    { time: '14:30:23', price: 0.85, amount: 4200, type: 'buy' },
    { time: '14:29:58', price: 0.84, amount: 2800, type: 'sell' },
    { time: '14:29:31', price: 0.85, amount: 1900, type: 'buy' },
    { time: '14:29:05', price: 0.86, amount: 3600, type: 'sell' }
  ]);

  const [tradingForm, setTradingForm] = useState({
    type: 'buy',
    amount: '',
    price: '',
    total: ''
  });

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeData(prev => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = Math.max(0.50, Math.min(1.50, prev.currentPrice + priceChange));
        const priceChangePercent = ((newPrice - prev.currentPrice) / prev.currentPrice) * 100;
        
        return {
          ...prev,
          currentPrice: newPrice,
          priceChange24h: newPrice - 0.73, // Assuming 24h ago price was 0.73
          priceChangePercent: priceChangePercent,
          lastUpdated: new Date(),
          volume24h: prev.volume24h + Math.random() * 10000,
          marketCap: newPrice * prev.circulatingSupply
        };
      });

      // Update order book
      setOrderBook(prev => ({
        bids: prev.bids.map(bid => ({
          ...bid,
          amount: bid.amount + (Math.random() - 0.5) * 1000,
          total: (bid.amount + (Math.random() - 0.5) * 1000) * bid.price
        })),
        asks: prev.asks.map(ask => ({
          ...ask,
          amount: ask.amount + (Math.random() - 0.5) * 1000,
          total: (ask.amount + (Math.random() - 0.5) * 1000) * ask.price
        }))
      }));

      // Add new trades
      setRecentTrades(prev => {
        const newTrade = {
          time: new Date().toLocaleTimeString(),
          price: exchangeData.currentPrice + (Math.random() - 0.5) * 0.02,
          amount: Math.floor(Math.random() * 5000) + 500,
          type: Math.random() > 0.5 ? 'buy' : 'sell'
        };
        return [newTrade, ...prev.slice(0, 7)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [exchangeData.currentPrice]);

  const handleTradingFormChange = (field, value) => {
    setTradingForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate total when amount or price changes
      if (field === 'amount' || field === 'price') {
        const amount = parseFloat(updated.amount) || 0;
        const price = parseFloat(updated.price) || 0;
        updated.total = (amount * price).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleTrade = () => {
    // Simulate trade execution
    alert(`Order placed: ${tradingForm.type.toUpperCase()} ${tradingForm.amount} MINED at $${tradingForm.price}`);
    setTradingForm({ type: 'buy', amount: '', price: '', total: '' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>💎 $MINED Token Exchange</h1>
        <p>Live trading for ProductiveMiner's revolutionary blockchain token</p>
      </div>

      {/* Price Ticker */}
      <div className="price-ticker">
        <div className="ticker-main">
          <div className="ticker-symbol">
            <h2>$MINED</h2>
            <span className="ticker-name">ProductiveMiner Token</span>
          </div>
          <div className="ticker-price">
            <span className="current-price">{formatPrice(exchangeData.currentPrice)}</span>
            <span className={`price-change ${exchangeData.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
              {exchangeData.priceChangePercent >= 0 ? '+' : ''}{exchangeData.priceChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="ticker-stats">
          <div className="stat-item">
            <span className="stat-label">24h Volume</span>
            <span className="stat-value">{formatVolume(exchangeData.volume24h)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">{formatVolume(exchangeData.marketCap)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">{formatNumber(exchangeData.circulatingSupply)} MINED</span>
          </div>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="trading-interface">
        <div className="trading-left">
          {/* Order Book */}
          <div className="order-book">
            <h3>Order Book</h3>
            <div className="order-book-header">
              <span>Price (USD)</span>
              <span>Amount (MINED)</span>
              <span>Total (USD)</span>
            </div>
            <div className="asks">
              {orderBook.asks.slice().reverse().map((ask, index) => (
                <div key={`ask-${index}`} className="order-row ask">
                  <span className="price">{formatPrice(ask.price)}</span>
                  <span className="amount">{formatNumber(ask.amount)}</span>
                  <span className="total">{formatPrice(ask.total)}</span>
                </div>
              ))}
            </div>
            <div className="current-price-row">
              <span className="current-price-label">Current Price</span>
              <span className="current-price-value">{formatPrice(exchangeData.currentPrice)}</span>
            </div>
            <div className="bids">
              {orderBook.bids.map((bid, index) => (
                <div key={`bid-${index}`} className="order-row bid">
                  <span className="price">{formatPrice(bid.price)}</span>
                  <span className="amount">{formatNumber(bid.amount)}</span>
                  <span className="total">{formatPrice(bid.total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="recent-trades">
            <h3>Recent Trades</h3>
            <div className="trades-header">
              <span>Time</span>
              <span>Price</span>
              <span>Amount</span>
            </div>
            <div className="trades-list">
              {recentTrades.map((trade, index) => (
                <div key={index} className={`trade-row ${trade.type}`}>
                  <span className="time">{trade.time}</span>
                  <span className="price">{formatPrice(trade.price)}</span>
                  <span className="amount">{formatNumber(trade.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="trading-right">
          {/* Trading Form */}
          <div className="trading-form">
            <h3>Trade $MINED</h3>
            <div className="form-tabs">
              <button 
                className={`tab ${tradingForm.type === 'buy' ? 'active' : ''}`}
                onClick={() => setTradingForm(prev => ({ ...prev, type: 'buy' }))}
              >
                Buy
              </button>
              <button 
                className={`tab ${tradingForm.type === 'sell' ? 'active' : ''}`}
                onClick={() => setTradingForm(prev => ({ ...prev, type: 'sell' }))}
              >
                Sell
              </button>
            </div>
            
            <div className="form-group">
              <label>Amount (MINED)</label>
              <input
                type="number"
                value={tradingForm.amount}
                onChange={(e) => handleTradingFormChange('amount', e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Price (USD)</label>
              <input
                type="number"
                value={tradingForm.price}
                onChange={(e) => handleTradingFormChange('price', e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Total (USD)</label>
              <input
                type="number"
                value={tradingForm.total}
                readOnly
                placeholder="0.00"
              />
            </div>
            
            <button 
              className={`trade-button ${tradingForm.type}`}
              onClick={handleTrade}
              disabled={!tradingForm.amount || !tradingForm.price}
            >
              {tradingForm.type.toUpperCase()} MINED
            </button>
          </div>

          {/* Market Stats */}
          <div className="market-stats">
            <h3>Market Statistics</h3>
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-label">24h High</span>
                <span className="stat-value">{formatPrice(exchangeData.high24h)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">24h Low</span>
                <span className="stat-value">{formatPrice(exchangeData.low24h)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Supply</span>
                <span className="stat-value">{formatNumber(exchangeData.totalSupply)} MINED</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Updated</span>
                <span className="stat-value">{exchangeData.lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Status */}
      <div className="network-status-section">
        <h3>🔗 Network Status</h3>
        <div className="status-grid">
          <div className="status-card">
            <span className="status-label">Block Height</span>
            <span className="status-value">{blockchainData?.height || 0}</span>
          </div>
          <div className="status-card">
            <span className="status-label">Active Miners</span>
            <span className="status-value">{miningState?.activeSessions?.length || 0}</span>
          </div>
          <div className="status-card">
            <span className="status-label">Validators</span>
            <span className="status-value">{validatorsData?.validators?.length || 0}</span>
          </div>
          <div className="status-card">
            <span className="status-label">System Status</span>
            <span className={`status-value ${systemHealth?.status || 'loading'}`}>
              {(systemHealth?.status || 'LOADING').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 