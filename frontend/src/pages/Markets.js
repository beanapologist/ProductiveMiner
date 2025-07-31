import React, { useState, useEffect } from 'react';
import './Markets.css';

const Markets = ({ sharedData }) => {
  const [markets, setMarkets] = useState([
    {
      pair: 'MINED/USD',
      price: 0.85,
      change24h: 2.4,
      volume24h: 1250000,
      marketCap: 85000000,
      high24h: 0.92,
      low24h: 0.78,
      isActive: true
    },
    {
      pair: 'MINED/ETH',
      price: 0.00042,
      change24h: -1.2,
      volume24h: 850000,
      marketCap: 42000000,
      high24h: 0.00045,
      low24h: 0.00038,
      isActive: true
    },
    {
      pair: 'MINED/BTC',
      price: 0.000012,
      change24h: 5.8,
      volume24h: 650000,
      marketCap: 12000000,
      high24h: 0.000013,
      low24h: 0.000011,
      isActive: true
    },
    {
      pair: 'MINED/USDT',
      price: 0.85,
      change24h: 1.7,
      volume24h: 450000,
      marketCap: 85000000,
      high24h: 0.89,
      low24h: 0.82,
      isActive: false
    }
  ]);

  const [marketStats, setMarketStats] = useState({
    totalVolume24h: 3150000,
    totalMarketCap: 232000000,
    activePairs: 3,
    totalPairs: 4
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prev => prev.map(market => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = Math.max(0.50, Math.min(1.50, market.price + priceChange));
        const newChange24h = market.change24h + (Math.random() - 0.5) * 2;
        
        return {
          ...market,
          price: newPrice,
          change24h: newChange24h,
          volume24h: market.volume24h + (Math.random() - 0.5) * 10000
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price, pair) => {
    if (pair.includes('ETH')) {
      return `${price.toFixed(6)} ETH`;
    } else if (pair.includes('BTC')) {
      return `${price.toFixed(8)} BTC`;
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(price);
    }
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}K`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  return (
    <div className="markets-page">
      <div className="markets-header">
        <h1>🌐 Markets</h1>
        <p>All available trading pairs for $MINED token</p>
      </div>

      {/* Market Overview */}
      <div className="market-overview">
        <div className="overview-card">
          <div className="card-header">
            <h3>Total Volume (24h)</h3>
            <span className="value">{formatVolume(marketStats.totalVolume24h)}</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-header">
            <h3>Total Market Cap</h3>
            <span className="value">{formatMarketCap(marketStats.totalMarketCap)}</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-header">
            <h3>Active Pairs</h3>
            <span className="value">{marketStats.activePairs}/{marketStats.totalPairs}</span>
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="markets-section">
        <h3>Available Markets</h3>
        <div className="markets-table">
          <div className="table-header">
            <span>Pair</span>
            <span>Price</span>
            <span>24h Change</span>
            <span>24h Volume</span>
            <span>Market Cap</span>
            <span>24h High</span>
            <span>24h Low</span>
            <span>Status</span>
          </div>
          {markets.map((market, index) => (
            <div key={index} className={`market-row ${market.isActive ? 'active' : 'inactive'}`}>
              <div className="pair-info">
                <span className="pair-symbol">{market.pair}</span>
                <span className="pair-name">
                  {market.pair.includes('USD') ? 'US Dollar' :
                   market.pair.includes('ETH') ? 'Ethereum' :
                   market.pair.includes('BTC') ? 'Bitcoin' :
                   market.pair.includes('USDT') ? 'Tether' : 'Unknown'}
                </span>
              </div>
              <span className="price">{formatPrice(market.price, market.pair)}</span>
              <span className={`change ${market.change24h >= 0 ? 'positive' : 'negative'}`}>
                {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
              </span>
              <span className="volume">{formatVolume(market.volume24h)}</span>
              <span className="market-cap">{formatMarketCap(market.marketCap)}</span>
              <span className="high">{formatPrice(market.high24h, market.pair)}</span>
              <span className="low">{formatPrice(market.low24h, market.pair)}</span>
              <span className={`status ${market.isActive ? 'active' : 'inactive'}`}>
                {market.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Details */}
      <div className="market-details">
        <h3>Market Details</h3>
        <div className="details-grid">
          <div className="detail-card">
            <h4>MINED/USD</h4>
            <p>The primary trading pair for $MINED token against US Dollar. This is the most liquid pair with the highest trading volume.</p>
            <div className="detail-stats">
              <span>Volume: {formatVolume(1250000)}</span>
              <span>Market Cap: {formatMarketCap(85000000)}</span>
            </div>
          </div>
          <div className="detail-card">
            <h4>MINED/ETH</h4>
            <p>Trade $MINED tokens against Ethereum. Popular among DeFi users and Ethereum ecosystem participants.</p>
            <div className="detail-stats">
              <span>Volume: {formatVolume(850000)}</span>
              <span>Market Cap: {formatMarketCap(42000000)}</span>
            </div>
          </div>
          <div className="detail-card">
            <h4>MINED/BTC</h4>
            <p>Trade $MINED tokens against Bitcoin. Appeals to Bitcoin maximalists and crypto traditionalists.</p>
            <div className="detail-stats">
              <span>Volume: {formatVolume(650000)}</span>
              <span>Market Cap: {formatMarketCap(12000000)}</span>
            </div>
          </div>
          <div className="detail-card">
            <h4>MINED/USDT</h4>
            <p>Trade $MINED tokens against Tether. Coming soon - stablecoin trading pair for reduced volatility.</p>
            <div className="detail-stats">
              <span>Volume: {formatVolume(450000)}</span>
              <span>Market Cap: {formatMarketCap(85000000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Pairs Info */}
      <div className="trading-pairs-info">
        <h3>Trading Pairs Information</h3>
        <div className="info-content">
          <div className="info-section">
            <h4>Supported Currencies</h4>
            <ul>
              <li><strong>USD:</strong> US Dollar - Primary fiat trading pair</li>
              <li><strong>ETH:</strong> Ethereum - Major cryptocurrency pair</li>
              <li><strong>BTC:</strong> Bitcoin - Leading cryptocurrency pair</li>
              <li><strong>USDT:</strong> Tether - Stablecoin pair (coming soon)</li>
            </ul>
          </div>
          <div className="info-section">
            <h4>Trading Features</h4>
            <ul>
              <li>Real-time price updates</li>
              <li>Advanced order types (Market, Limit, Stop Loss)</li>
              <li>Professional trading interface</li>
              <li>24/7 market availability</li>
              <li>Low trading fees</li>
            </ul>
          </div>
          <div className="info-section">
            <h4>Market Hours</h4>
            <ul>
              <li>24/7 trading available</li>
              <li>No market closures</li>
              <li>Global access</li>
              <li>Real-time settlement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets; 