import React from 'react';
import './BlockExplorer.css';

const BlockExplorer = ({ sharedData }) => {
  const { blockchainData, formatNumber } = sharedData;

  return (
    <div className="block-explorer">
      <div className="explorer-header">
        <h1>🔍 Block Explorer</h1>
        <p>Explore blocks, transactions, and blockchain data</p>
      </div>

      <div className="explorer-stats">
        <div className="stat-card">
          <h3>Total Blocks</h3>
          <div className="stat-value">{formatNumber(blockchainData.totalBlocks)}</div>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <div className="stat-value">{formatNumber(blockchainData.totalTransactions)}</div>
        </div>
        <div className="stat-card">
          <h3>Total Rewards</h3>
          <div className="stat-value">{formatNumber(blockchainData.totalRewards)}</div>
        </div>
        <div className="stat-card">
          <h3>Avg Block Time</h3>
          <div className="stat-value">{blockchainData.avgBlockTime}s</div>
        </div>
      </div>

      <div className="explorer-content">
        <div className="search-section">
          <h2>Search Blocks</h2>
          <div className="search-form">
            <input 
              type="text" 
              placeholder="Search by block number, hash, or address..."
              className="search-input"
            />
            <button className="search-btn">🔍 Search</button>
            <button className="refresh-btn">🔄 Refresh</button>
          </div>
        </div>

        <div className="blocks-section">
          <h2>Recent Blocks</h2>
          <div className="blocks-list">
            {blockchainData.latestBlocks.length > 0 ? (
              blockchainData.latestBlocks.map((block, index) => (
                <div key={index} className="block-item">
                  <div className="block-header">
                    <span className="block-number">#{block.number}</span>
                    <span className="block-time">{block.timestamp}</span>
                  </div>
                  <div className="block-details">
                    <span>Hash: {block.hash}</span>
                    <span>Transactions: {block.transactions}</span>
                    <span>Reward: {block.reward}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-blocks">
                <p>No blocks mined yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockExplorer; 