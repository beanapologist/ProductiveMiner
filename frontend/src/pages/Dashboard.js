import React from 'react';
import './Dashboard.css';

const Dashboard = ({ sharedData }) => {
  const {
    blockchainData,
    miningState,
    validatorsData,
    discoveriesData,
    systemHealth,
    formatNumber,
    formatBitStrength
  } = sharedData;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>System Overview</h1>
        <p>Real-time monitoring of the ProductiveMiner Adaptive Learning System</p>
      </div>

      {/* System Health Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>System Health</h3>
            <div className="metric-value">
              <span className={`status-badge ${systemHealth.status}`}>
                {systemHealth.status}
              </span>
            </div>
            <div className="metric-details">
              <span>Uptime: {Math.floor(systemHealth.uptime / 3600)}h</span>
              <span>Connections: {systemHealth.activeConnections}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔗</div>
          <div className="metric-content">
            <h3>Blockchain</h3>
            <div className="metric-value">{formatNumber(blockchainData.height)}</div>
            <div className="metric-details">
              <span>Total Blocks: {formatNumber(blockchainData.totalBlocks)}</span>
              <span>Avg Block Time: {blockchainData.avgBlockTime}s</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⛏️</div>
          <div className="metric-content">
            <h3>Mining</h3>
            <div className="metric-value">{miningState.activeSessions.length}</div>
            <div className="metric-details">
              <span>Active Sessions</span>
              <span>Difficulty: {miningState.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏛️</div>
          <div className="metric-content">
            <h3>Validators</h3>
            <div className="metric-value">{validatorsData.activeValidators}</div>
            <div className="metric-details">
              <span>Active Validators</span>
              <span>Consensus: {validatorsData.consensusRate}%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔬</div>
          <div className="metric-content">
            <h3>Discoveries</h3>
            <div className="metric-value">{discoveriesData.totalDiscoveries}</div>
            <div className="metric-details">
              <span>Total Discoveries</span>
              <span>Pending: {discoveriesData.pendingValidation}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Rewards</h3>
            <div className="metric-value">{formatNumber(blockchainData.totalRewards)}</div>
            <div className="metric-details">
              <span>Total Rewards</span>
              <span>Transactions: {formatNumber(blockchainData.totalTransactions)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Control Section */}
      <div className="dashboard-section">
        <h2>Mining Control</h2>
        <div className="mining-control">
          <div className="work-types">
            <h3>Available Work Types</h3>
            <div className="work-types-grid">
              {miningState.workTypes.map((workType, index) => (
                <div key={index} className="work-type-card">
                  <div className="work-type-icon">{workType.icon}</div>
                  <div className="work-type-info">
                    <h4>{workType.name}</h4>
                    <p>{workType.description}</p>
                    <span className="difficulty-badge">
                      Difficulty: {workType.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mining-session">
            <h3>Start Mining Session</h3>
            <div className="session-form">
              <div className="form-group">
                <label>Work Type</label>
                <select className="form-select">
                  <option>Select a work type...</option>
                  {miningState.workTypes.map((workType, index) => (
                    <option key={index} value={workType.name}>
                      {workType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>
                <div className="difficulty-slider">
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={miningState.difficulty}
                    className="slider"
                  />
                  <span className="difficulty-value">{miningState.difficulty}</span>
                </div>
              </div>

              <button className="start-mining-btn">
                🚀 Start Mining Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Process Phases */}
      <div className="dashboard-section">
        <h2>Mining Process Phases</h2>
        <div className="phases-grid">
          <div className="phase-card">
            <div className="phase-icon">⛏️</div>
            <h4>Mining Phase</h4>
            <p>Computational work execution with quantum-secured algorithms</p>
          </div>

          <div className="phase-card">
            <div className="phase-icon">✅</div>
            <h4>Validation Phase</h4>
            <p>Proof of Stake consensus and mathematical verification</p>
          </div>

          <div className="phase-card">
            <div className="phase-icon">🔍</div>
            <h4>Discovery Phase</h4>
            <p>Pattern recognition and mathematical breakthroughs</p>
          </div>

          <div className="phase-card">
            <div className="phase-icon">🔄</div>
            <h4>Adaptation Phase</h4>
            <p>Dynamic difficulty adjustment and learning cycles</p>
          </div>

          <div className="phase-card">
            <div className="phase-icon">⚡</div>
            <h4>Optimization Phase</h4>
            <p>Performance tuning and efficiency improvements</p>
          </div>

          <div className="phase-card">
            <div className="phase-icon">🔒</div>
            <h4>Security Phase</h4>
            <p>Quantum-resistant cryptography and threat detection</p>
          </div>
        </div>
      </div>

      {/* Mathematical Mining Capabilities */}
      <div className="dashboard-section">
        <h2>Mathematical Mining Capabilities</h2>
        <div className="capabilities-grid">
          <div className="capability-card">
            <h3>Unlimited Bit Strength</h3>
            <p>Our productive miner replaces arbitrary SHA-256 hashing with real mathematical computations, enabling unlimited bit strength through continuous mathematical work.</p>
            <div className="capability-metrics">
              <div className="metric">
                <span>Current Bit Strength:</span>
                <span className="value">{formatBitStrength(256)}</span>
              </div>
              <div className="metric">
                <span>Max Bit Strength:</span>
                <span className="value">∞ (Unlimited)</span>
              </div>
            </div>
          </div>

          <div className="capability-card">
            <h3>Hybrid PoW/PoS</h3>
            <p>Combines Proof of Work (mathematical computations) with Proof of Stake (validator consensus) for enhanced security and efficiency.</p>
            <div className="capability-features">
              <span className="feature">⛏️ Mathematical PoW</span>
              <span className="feature">🔒 Stake-based PoS</span>
            </div>
          </div>

          <div className="capability-card">
            <h3>Adaptive Algorithms</h3>
            <p>Dynamic difficulty adjustment and learning algorithms that improve efficiency and security over time through mathematical discoveries.</p>
            <div className="capability-metrics">
              <div className="metric">
                <span>Learning Cycles:</span>
                <span className="value">0</span>
              </div>
              <div className="metric">
                <span>Mathematical Efficiency:</span>
                <span className="value">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 