import React, { useState, useEffect } from 'react';
import './Trading.css';

const Trading = ({ sharedData }) => {
  const [tradingData, setTradingData] = useState({
    currentPrice: 0.85,
    priceChange24h: 0.12,
    priceChangePercent: 14.12,
    volume24h: 1250000,
    high24h: 0.92,
    low24h: 0.78
  });

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

  const [tradingForm, setTradingForm] = useState({
    type: 'buy',
    orderType: 'market',
    amount: '',
    price: '',
    total: '',
    stopLoss: '',
    takeProfit: ''
  });

  const [tradeHistory, setTradeHistory] = useState([
    { time: '14:32:15', price: 0.85, amount: 2500, type: 'buy', orderId: 'TXN001' },
    { time: '14:31:42', price: 0.84, amount: 1800, type: 'sell', orderId: 'TXN002' },
    { time: '14:31:18', price: 0.85, amount: 3200, type: 'buy', orderId: 'TXN003' },
    { time: '14:30:55', price: 0.86, amount: 1500, type: 'sell', orderId: 'TXN004' },
    { time: '14:30:23', price: 0.85, amount: 4200, type: 'buy', orderId: 'TXN005' }
  ]);

  const [openOrders, setOpenOrders] = useState([
    { orderId: 'ORD001', type: 'buy', amount: 1000, price: 0.84, status: 'pending', time: '14:25:30' },
    { orderId: 'ORD002', type: 'sell', amount: 500, price: 0.87, status: 'pending', time: '14:20:15' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTradingData(prev => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = Math.max(0.50, Math.min(1.50, prev.currentPrice + priceChange));
        return {
          ...prev,
          currentPrice: newPrice,
          priceChange24h: newPrice - 0.73,
          priceChangePercent: ((newPrice - prev.currentPrice) / prev.currentPrice) * 100
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTradingFormChange = (field, value) => {
    setTradingForm(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'amount' || field === 'price') {
        const amount = parseFloat(updated.amount) || 0;
        const price = parseFloat(updated.price) || 0;
        updated.total = (amount * price).toFixed(2);
      }
      
      return updated;
    });
  };

  const handlePlaceOrder = () => {
    const newOrder = {
      orderId: `ORD${Date.now()}`,
      type: tradingForm.type,
      amount: parseFloat(tradingForm.amount),
      price: parseFloat(tradingForm.price),
      status: 'pending',
      time: new Date().toLocaleTimeString()
    };
    
    setOpenOrders(prev => [newOrder, ...prev]);
    setTradingForm({ type: 'buy', orderType: 'market', amount: '', price: '', total: '', stopLoss: '', takeProfit: '' });
    alert(`Order placed: ${tradingForm.type.toUpperCase()} ${tradingForm.amount} MINED at $${tradingForm.price}`);
  };

  const handleCancelOrder = (orderId) => {
    setOpenOrders(prev => prev.filter(order => order.orderId !== orderId));
    alert(`Order ${orderId} cancelled`);
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
    <div className="trading-page">
      <div className="trading-header">
        <h1>📈 Advanced Trading</h1>
        <p>Professional trading interface for $MINED token</p>
      </div>

      {/* Price Overview */}
      <div className="price-overview">
        <div className="price-main">
          <div className="price-info">
            <h2>$MINED</h2>
            <span className="current-price">{formatPrice(tradingData.currentPrice)}</span>
            <span className={`price-change ${tradingData.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
              {tradingData.priceChangePercent >= 0 ? '+' : ''}{tradingData.priceChangePercent.toFixed(2)}%
            </span>
          </div>
          <div className="price-stats">
            <div className="stat">
              <span className="label">24h High</span>
              <span className="value">{formatPrice(tradingData.high24h)}</span>
            </div>
            <div className="stat">
              <span className="label">24h Low</span>
              <span className="value">{formatPrice(tradingData.low24h)}</span>
            </div>
            <div className="stat">
              <span className="label">24h Volume</span>
              <span className="value">{formatVolume(tradingData.volume24h)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="trading-layout">
        <div className="trading-left">
          {/* Order Book */}
          <div className="order-book-section">
            <h3>Order Book</h3>
            <div className="order-book">
              <div className="order-book-header">
                <span>Price (USD)</span>
                <span>Amount (MINED)</span>
                <span>Total (USD)</span>
              </div>
              <div className="asks">
                {orderBook.asks.slice().reverse().map((ask, index) => (
                  <div key={`ask-${index}`} className="order-row ask">
                    <span className="price">{formatPrice(ask.price)}</span>
                    <span className="amount">{ask.amount.toLocaleString()}</span>
                    <span className="total">{formatPrice(ask.total)}</span>
                  </div>
                ))}
              </div>
              <div className="current-price-row">
                <span className="current-price-label">Current Price</span>
                <span className="current-price-value">{formatPrice(tradingData.currentPrice)}</span>
              </div>
              <div className="bids">
                {orderBook.bids.map((bid, index) => (
                  <div key={`bid-${index}`} className="order-row bid">
                    <span className="price">{formatPrice(bid.price)}</span>
                    <span className="amount">{bid.amount.toLocaleString()}</span>
                    <span className="total">{formatPrice(bid.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade History */}
          <div className="trade-history-section">
            <h3>Trade History</h3>
            <div className="trade-history">
              <div className="history-header">
                <span>Time</span>
                <span>Price</span>
                <span>Amount</span>
                <span>Type</span>
              </div>
              <div className="history-list">
                {tradeHistory.map((trade, index) => (
                  <div key={index} className={`history-row ${trade.type}`}>
                    <span className="time">{trade.time}</span>
                    <span className="price">{formatPrice(trade.price)}</span>
                    <span className="amount">{trade.amount.toLocaleString()}</span>
                    <span className="type">{trade.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="trading-right">
          {/* Trading Form */}
          <div className="trading-form-section">
            <h3>Place Order</h3>
            <div className="trading-form">
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
                <label>Order Type</label>
                <select 
                  value={tradingForm.orderType}
                  onChange={(e) => handleTradingFormChange('orderType', e.target.value)}
                >
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop Loss</option>
                </select>
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

              {tradingForm.orderType !== 'market' && (
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
              )}

              <div className="form-group">
                <label>Total (USD)</label>
                <input
                  type="number"
                  value={tradingForm.total}
                  readOnly
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Stop Loss (USD)</label>
                <input
                  type="number"
                  value={tradingForm.stopLoss}
                  onChange={(e) => handleTradingFormChange('stopLoss', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Take Profit (USD)</label>
                <input
                  type="number"
                  value={tradingForm.takeProfit}
                  onChange={(e) => handleTradingFormChange('takeProfit', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <button 
                className={`place-order-btn ${tradingForm.type}`}
                onClick={handlePlaceOrder}
                disabled={!tradingForm.amount || (tradingForm.orderType !== 'market' && !tradingForm.price)}
              >
                {tradingForm.type.toUpperCase()} MINED
              </button>
            </div>
          </div>

          {/* Open Orders */}
          <div className="open-orders-section">
            <h3>Open Orders</h3>
            <div className="open-orders">
              {openOrders.length > 0 ? (
                openOrders.map((order) => (
                  <div key={order.orderId} className="order-item">
                    <div className="order-info">
                      <div className="order-header">
                        <span className={`order-type ${order.type}`}>{order.type.toUpperCase()}</span>
                        <span className="order-id">{order.orderId}</span>
                      </div>
                      <div className="order-details">
                        <span>Amount: {order.amount.toLocaleString()} MINED</span>
                        <span>Price: {formatPrice(order.price)}</span>
                        <span>Time: {order.time}</span>
                      </div>
                    </div>
                    <button 
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order.orderId)}
                    >
                      Cancel
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-orders">
                  <p>No open orders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading; 