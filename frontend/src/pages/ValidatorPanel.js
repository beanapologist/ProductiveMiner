import React, { useState, useEffect } from 'react';
import './ValidatorPanel.css';

const ValidatorPanel = ({ sharedData }) => {
  const { validatorsData, formatNumber, formatCurrency, apiService } = sharedData;

  const [validators, setValidators] = useState([]);
  const [stats, setStats] = useState({
    totalValidators: 0,
    activeValidators: 0,
    totalStaked: 0,
    averageUptime: '0%',
    totalRewards: 0,
    totalBlocksValidated: 0,
    consensusRate: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Staking modal state
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [stakingAmount, setStakingAmount] = useState('');
  const [stakingLoading, setStakingLoading] = useState(false);
  const [stakingError, setStakingError] = useState('');
  const [stakingSuccess, setStakingSuccess] = useState('');

  // Fetch validators data from backend
  const fetchValidatorsData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getValidators();
      
      setValidators(data.validators || []);
      setStats({
        totalValidators: data.stats?.totalValidators || 0,
        activeValidators: data.stats?.activeValidators || 0,
        totalStaked: data.stats?.totalStaked || 0,
        averageUptime: data.stats?.averageUptime || '0%',
        totalRewards: data.stats?.totalRewards || 0,
        totalBlocksValidated: data.stats?.totalBlocksValidated || 0,
        consensusRate: data.stats?.consensusRate || 0
      });
    } catch (error) {
      console.error('Error fetching validators data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValidatorsData();

    // Set up periodic updates
    const interval = setInterval(() => {
      fetchValidatorsData();
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [apiService]);

  const formatAddress = (address) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  const getValidatorType = (validator) => {
    if (validator.id.toString().includes('enterprise')) return 'Enterprise';
    if (validator.id.toString().includes('institutional')) return 'Institutional';
    if (validator.id.toString().includes('community')) return 'Community';
    if (validator.id <= 15) return 'Core';
    return 'Dynamic';
  };

  const getValidatorTypeColor = (type) => {
    switch (type) {
      case 'Core': return '#10b981';
      case 'Enterprise': return '#3b82f6';
      case 'Institutional': return '#8b5cf6';
      case 'Community': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Staking functions
  const handleStake = async () => {
    if (!stakingAmount || parseFloat(stakingAmount) <= 0) {
      setStakingError('Please enter a valid amount');
      return;
    }

    setStakingLoading(true);
    setStakingError('');
    setStakingSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/staking/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(stakingAmount)
        })
      });

      const data = await response.json();

      if (data.success) {
        setStakingSuccess(`Successfully staked ${formatNumber(stakingAmount)} MINED tokens!`);
        setStakingAmount('');
        setShowStakingModal(false);
        
        // Refresh validators data to show updated stats
        setTimeout(() => {
          fetchValidatorsData();
        }, 1000);
      } else {
        setStakingError(data.error || 'Failed to stake tokens');
      }
    } catch (error) {
      console.error('Staking error:', error);
      setStakingError('Network error. Please try again.');
    } finally {
      setStakingLoading(false);
    }
  };

  const openStakingModal = () => {
    setShowStakingModal(true);
    setStakingError('');
    setStakingSuccess('');
  };

  const closeStakingModal = () => {
    setShowStakingModal(false);
    setStakingAmount('');
    setStakingError('');
    setStakingSuccess('');
  };

  if (loading) {
    return (
      <div className="validator-panel">
        <div className="panel-header">
          <h1>🏛️ Validator Panel</h1>
          <p>Loading validator data...</p>
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="validator-panel">
      <div className="panel-header">
        <h1>🏛️ Validator Panel</h1>
        <p>Manage validators and consensus participation</p>
      </div>

      {/* Validator Statistics */}
      <div className="validator-stats">
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Active Validators</h3>
            <div className="stat-value">{stats.activeValidators}</div>
            <div className="stat-details">
              <span>Total: {stats.totalValidators}</span>
              <span>Uptime: {stats.averageUptime}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Staked</h3>
            <div className="stat-value">{formatNumber(stats.totalStaked)}</div>
            <div className="stat-details">
              <span>Average: {formatNumber(stats.totalStaked / Math.max(stats.activeValidators, 1))}</span>
              <span>Rewards: {formatCurrency(stats.totalRewards)}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Consensus Rate</h3>
            <div className="stat-value">{stats.consensusRate}%</div>
            <div className="stat-details">
              <span>Blocks: {formatNumber(stats.totalBlocksValidated)}</span>
              <span>Performance</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>Network Health</h3>
            <div className="stat-value">{stats.averageUptime}</div>
            <div className="stat-details">
              <span>Uptime</span>
              <span>Reliability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validator Categories */}
      <div className="validator-categories">
        <h2>Validator Categories</h2>
        <div className="categories-grid">
          <div className="category-card core">
            <h3>Core Validators</h3>
            <div className="category-count">{validators.filter(v => getValidatorType(v) === 'Core').length}</div>
            <p>Foundation validators with highest stakes</p>
          </div>
          <div className="category-card enterprise">
            <h3>Enterprise</h3>
            <div className="category-count">{validators.filter(v => getValidatorType(v) === 'Enterprise').length}</div>
            <p>Large enterprise validators</p>
          </div>
          <div className="category-card institutional">
            <h3>Institutional</h3>
            <div className="category-count">{validators.filter(v => getValidatorType(v) === 'Institutional').length}</div>
            <p>Institutional-grade validators</p>
          </div>
          <div className="category-card community">
            <h3>Community</h3>
            <div className="category-count">{validators.filter(v => getValidatorType(v) === 'Community').length}</div>
            <p>Community-driven validators</p>
          </div>
        </div>
      </div>

      {/* Validators List */}
      <div className="validators-list">
        <h2>Active Validators ({validators.length})</h2>
        <div className="validators-grid">
          {validators.length > 0 ? (
            validators.map((validator, index) => {
              const validatorType = getValidatorType(validator);
              return (
                <div key={validator.id} className="validator-card">
                  <div className="validator-header">
                    <div className="validator-info">
                      <h3>Validator #{validator.id}</h3>
                      <span 
                        className="validator-type" 
                        style={{ backgroundColor: getValidatorTypeColor(validatorType) }}
                      >
                        {validatorType}
                      </span>
                    </div>
                    <div className="validator-status">
                      <span 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(validator.status) }}
                      >
                        {validator.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="validator-details">
                    <div className="detail-row">
                      <span className="label">Address:</span>
                      <span className="value address">{formatAddress(validator.address)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Stake:</span>
                      <span className="value">{formatNumber(validator.stake)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Voting Power:</span>
                      <span className="value">{validator.votingPower}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Uptime:</span>
                      <span className="value">{validator.uptime}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Rewards:</span>
                      <span className="value">{formatCurrency(validator.rewards)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Blocks Validated:</span>
                      <span className="value">{formatNumber(validator.blocksValidated)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Commission:</span>
                      <span className="value">{validator.commission}</span>
                    </div>
                  </div>

                  <div className="validator-performance">
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{
                          width: validator.uptime.replace('%', ''),
                          backgroundColor: getValidatorTypeColor(validatorType)
                        }}
                      ></div>
                    </div>
                    <div className="performance-label">
                      Performance: {validator.uptime}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-validators">
              <p>No validators registered</p>
              <p>Validators will appear here once they join the network</p>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Staking Section */}
      <div className="staking-prominent">
        <div className="staking-hero">
          <div className="staking-hero-content">
            <h2>🚀 Earn Rewards with Staking</h2>
            <p>Stake your MINED tokens to earn passive income and participate in network governance</p>
            <div className="staking-benefits">
              <div className="benefit">
                <span className="benefit-icon">💰</span>
                <span className="benefit-text">8.5% APY</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <span className="benefit-text">Secure Network</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🏛️</span>
                <span className="benefit-text">Governance Rights</span>
              </div>
            </div>
            <button className="staking-hero-btn" onClick={openStakingModal}>
              💰 Start Staking Now
            </button>
          </div>
          <div className="staking-hero-stats">
            <div className="stat-item">
              <span className="stat-value">{formatNumber(stats.totalStaked)}</span>
              <span className="stat-label">Total Staked</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.activeValidators}</span>
              <span className="stat-label">Active Validators</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">8.5%</span>
              <span className="stat-label">Current APY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validator Actions */}
      <div className="validator-actions">
        <h2>Validator Management</h2>
        <div className="actions-grid">
          <button className="action-btn primary" onClick={openStakingModal}>
            💰 Stake Tokens
          </button>
          <button className="action-btn secondary">
            🏛️ Register Validator
          </button>
          <button className="action-btn secondary">
            📊 View Analytics
          </button>
          <button className="action-btn secondary">
            ⚙️ Manage Stakes
          </button>
          <button className="action-btn secondary">
            📋 Validator Reports
          </button>
        </div>
      </div>

      {/* Staking Modal */}
      {showStakingModal && (
        <div className="modal-overlay">
          <div className="staking-modal">
            <div className="modal-header">
              <h3>💰 Stake MINED Tokens</h3>
              <button className="modal-close" onClick={closeStakingModal}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="staking-info">
                <p>Stake your MINED tokens to earn rewards and participate in network governance.</p>
                <div className="staking-stats">
                  <div className="stat">
                    <span className="label">Current APY:</span>
                    <span className="value">8.5%</span>
                  </div>
                  <div className="stat">
                    <span className="label">Min Stake:</span>
                    <span className="value">100 MINED</span>
                  </div>
                  <div className="stat">
                    <span className="label">Lock Period:</span>
                    <span className="value">30 days</span>
                  </div>
                </div>
              </div>

              <div className="staking-form">
                <label htmlFor="stakingAmount">Amount to Stake (MINED):</label>
                <input
                  type="number"
                  id="stakingAmount"
                  value={stakingAmount}
                  onChange={(e) => setStakingAmount(e.target.value)}
                  placeholder="Enter amount..."
                  min="100"
                  step="1"
                />
                
                {stakingError && (
                  <div className="error-message">
                    ❌ {stakingError}
                  </div>
                )}
                
                {stakingSuccess && (
                  <div className="success-message">
                    ✅ {stakingSuccess}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={closeStakingModal}
                disabled={stakingLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleStake}
                disabled={stakingLoading || !stakingAmount}
              >
                {stakingLoading ? 'Staking...' : 'Stake Tokens'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidatorPanel; 