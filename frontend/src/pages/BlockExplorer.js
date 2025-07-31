import React, { useState, useEffect } from 'react';
import './BlockExplorer.css';

const BlockExplorer = ({ sharedData }) => {
  const { blockchainData, formatNumber, formatCurrency, apiService, networkStats } = sharedData;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blockDetails, setBlockDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Real blockchain data state
  const [blocks, setBlocks] = useState([]);
  const [statistics, setStatistics] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    totalRewards: 0,
    averageBlockTime: 0,
    averageGasUsed: 0,
    averageGasPrice: '0',
    totalGasUsed: 0,
    networkHashRate: '0 GH/s',
    difficulty: 0,
    uncleCount: 0,
    orphanedBlocks: 0
  });

  // Fetch real blockchain data function
  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      const [blocksData, statsData, networkStatsData] = await Promise.all([
        apiService.getBlocks(1, 20),
        apiService.getBlockchainStats(),
        apiService.getNetworkStats()
      ]);

      // Update blocks with real data
      console.log('🔍 Fetched blocks data:', blocksData);
      console.log('🔍 Blocks array:', blocksData.latestBlocks || []);
      console.log('🔍 Number of blocks:', (blocksData.latestBlocks || []).length);
      setBlocks(blocksData.latestBlocks || []);

      // Update statistics with real data
      setStatistics({
        totalBlocks: blocksData.totalBlocks || 0,
        totalTransactions: statsData.totalTransactions || 0,
        totalRewards: networkStatsData.totalRewards || 0,
        averageBlockTime: networkStatsData.averageBlockTime || 0,
        averageGasUsed: 21000, // Default gas used
        averageGasPrice: '20000000000', // Default gas price
        totalGasUsed: (statsData.totalTransactions || 0) * 21000,
        networkHashRate: networkStatsData.networkHashRate || '0 GH/s',
        difficulty: 25, // Default difficulty
        uncleCount: 0,
        orphanedBlocks: 0
      });

    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and set up periodic updates
  useEffect(() => {
    console.log('🔍 BlockExplorer useEffect triggered');
    fetchBlockchainData();

    // Set up periodic updates
    const interval = setInterval(() => {
      console.log('🔍 BlockExplorer periodic update triggered');
      fetchBlockchainData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [apiService]);

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
    setBlockDetails(block);
  };

  const filteredBlocks = blocks.filter(block => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    switch (filterType) {
      case 'number':
        return block.height.toString().includes(query);
      case 'hash':
        return block.hash.toLowerCase().includes(query);
      case 'miner':
        return block.miner.toLowerCase().includes(query);
      default:
        return (
          block.height.toString().includes(query) ||
          block.hash.toLowerCase().includes(query) ||
          block.miner.toLowerCase().includes(query)
        );
    }
  });

  const sortedBlocks = [...filteredBlocks].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'number':
        comparison = a.height - b.height;
        break;
      case 'timestamp':
        comparison = new Date(a.timestamp) - new Date(b.timestamp);
        break;
      case 'transactions':
        comparison = a.transactions - b.transactions;
        break;
      case 'reward':
        comparison = a.reward - b.reward;
        break;
      default:
        comparison = a.height - b.height;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const formatHash = (hash) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  console.log('🔍 BlockExplorer render - blocks length:', blocks.length);
  console.log('🔍 BlockExplorer render - blocks:', blocks);
  console.log('🔍 BlockExplorer render - statistics:', statistics);
  
  return (
    <div className="block-explorer">
      <div className="explorer-header">
        <h1>🔍 Block Explorer</h1>
        <p>Explore blocks, transactions, and blockchain data in real-time</p>
      </div>

      {/* Statistics Overview */}
      <div className="explorer-stats">
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>Total Blocks</h3>
            <div className="stat-value">{formatNumber(statistics.totalBlocks)}</div>
            <div className="stat-details">
              <span>Height: {formatNumber(statistics.totalBlocks)}</span>
              <span>Avg Time: {statistics.averageBlockTime}s</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Transactions</h3>
            <div className="stat-value">{formatNumber(statistics.totalTransactions)}</div>
            <div className="stat-details">
              <span>Avg Gas: {formatNumber(statistics.averageGasUsed)}</span>
              <span>Gas Price: {formatNumber(parseInt(statistics.averageGasPrice) / 1e9)} Gwei</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Rewards</h3>
            <div className="stat-value">{formatCurrency(statistics.totalRewards)}</div>
            <div className="stat-details">
              <span>Block Reward: {formatCurrency(50)}</span>
              <span>Avg Reward: {formatCurrency(statistics.totalRewards / Math.max(statistics.totalBlocks, 1))}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Network Stats</h3>
            <div className="stat-value">{statistics.networkHashRate}</div>
            <div className="stat-details">
              <span>Difficulty: {formatNumber(statistics.difficulty)}</span>
              <span>Gas Used: {formatNumber(statistics.totalGasUsed)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-group">
            <input 
              type="text" 
              placeholder="Search by block number, hash, or miner address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="number">Block Number</option>
              <option value="hash">Block Hash</option>
              <option value="miner">Miner Address</option>
            </select>
            <button onClick={handleSearch} className="search-btn" disabled={loading}>
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>

          <div className="sort-controls">
            <label>Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="number">Block Number</option>
              <option value="timestamp">Timestamp</option>
              <option value="transactions">Transactions</option>
              <option value="reward">Reward</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="sort-order-btn"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      </div>

      {/* Blocks List */}
      <div className="blocks-section">
        <div className="blocks-header">
          <h2>Recent Blocks</h2>
          <div className="blocks-controls">
            <div className="blocks-count">
              Showing {sortedBlocks.length} of {blocks.length} blocks
            </div>
            <button 
              onClick={fetchBlockchainData} 
              className="refresh-btn"
              disabled={loading}
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        <div className="blocks-list">
          {console.log('🔍 Rendering blocks:', sortedBlocks.length, 'blocks')}
          {sortedBlocks.length > 0 ? (
            sortedBlocks.map((block, index) => (
              <div 
                key={index} 
                className={`block-item ${selectedBlock?.height === block.height ? 'selected' : ''}`}
                onClick={() => handleBlockClick(block)}
              >
                <div className="block-header">
                  <div className="block-number">
                    <span className="number">#{block.height}</span>
                    <span className="confirmations">6 confirmations</span>
                  </div>
                  <div className="block-time">
                    {formatTimestamp(block.timestamp)}
                  </div>
                </div>

                <div className="block-details">
                  <div className="detail-row">
                    <span className="label">Hash:</span>
                    <span className="value hash">{formatHash(block.hash)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Miner:</span>
                    <span className="value address">{formatAddress(block.miner)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Transactions:</span>
                    <span className="value">{block.transactions}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Reward:</span>
                    <span className="value">{formatCurrency(block.reward)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Size:</span>
                    <span className="value">{block.size}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Gas Used:</span>
                    <span className="value">{formatNumber(block.gasUsed)} / {formatNumber(block.gasLimit)}</span>
                  </div>
                </div>

                <div className="block-actions">
                  <button className="btn-view">👁️ View Details</button>
                  <button className="btn-copy">📋 Copy Hash</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-blocks">
              <p>No blocks found matching your search criteria</p>
              <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Block Details Modal */}
      {selectedBlock && (
        <div className="block-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Block #{selectedBlock.height} Details</h2>
              <button 
                onClick={() => setSelectedBlock(null)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-group">
                  <h3>Block Information</h3>
                  <div className="detail-item">
                    <span className="label">Block Number:</span>
                    <span className="value">#{selectedBlock.height}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Hash:</span>
                    <span className="value hash">{selectedBlock.hash}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Timestamp:</span>
                    <span className="value">{formatTimestamp(selectedBlock.timestamp)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Work Type:</span>
                    <span className="value">{selectedBlock.workType}</span>
                  </div>
                </div>

                <div className="detail-group">
                  <h3>Mining Information</h3>
                  <div className="detail-item">
                    <span className="label">Miner:</span>
                    <span className="value address">{selectedBlock.miner}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Reward:</span>
                    <span className="value">{formatCurrency(selectedBlock.reward)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Size:</span>
                    <span className="value">{selectedBlock.size}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Difficulty:</span>
                    <span className="value">{selectedBlock.difficulty}</span>
                  </div>
                </div>

                <div className="detail-group">
                  <h3>Gas Information</h3>
                  <div className="detail-item">
                    <span className="label">Gas Used:</span>
                    <span className="value">{formatNumber(selectedBlock.gasUsed)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Gas Limit:</span>
                    <span className="value">{formatNumber(selectedBlock.gasLimit)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Gas Used %:</span>
                    <span className="value">{((selectedBlock.gasUsed / selectedBlock.gasLimit) * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <div className="detail-group">
                  <h3>Network Information</h3>
                  <div className="detail-item">
                    <span className="label">Network Hash Rate:</span>
                    <span className="value">{statistics.networkHashRate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Average Block Time:</span>
                    <span className="value">{statistics.averageBlockTime}s</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total Blocks:</span>
                    <span className="value">{formatNumber(statistics.totalBlocks)}</span>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="transactions-section">
                <h3>Transactions ({selectedBlock.transactions})</h3>
                <div className="transactions-list">
                  <div className="transaction-item">
                    <div className="tx-header">
                      <span className="tx-hash">Block #{selectedBlock.height} Transactions</span>
                      <span className="tx-status confirmed">✓ Confirmed</span>
                    </div>
                    <div className="tx-details">
                      <div className="tx-row">
                        <span className="label">Transaction Count:</span>
                        <span className="value">{selectedBlock.transactions}</span>
                      </div>
                      <div className="tx-row">
                        <span className="label">Block Reward:</span>
                        <span className="value">{formatCurrency(selectedBlock.reward)}</span>
                      </div>
                      <div className="tx-row">
                        <span className="label">Work Type:</span>
                        <span className="value">{selectedBlock.workType}</span>
                      </div>
                      <div className="tx-row">
                        <span className="label">Miner:</span>
                        <span className="value address">{formatAddress(selectedBlock.miner)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-copy-all">📋 Copy All Data</button>
              <button className="btn-export">📄 Export JSON</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockExplorer; 