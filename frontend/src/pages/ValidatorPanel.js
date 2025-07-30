import React from 'react';

const ValidatorPanel = ({ sharedData }) => {
  const { validatorsData } = sharedData;

  return (
    <div className="validator-panel">
      <div className="panel-header">
        <h1>🏛️ Validator Panel</h1>
        <p>Manage validators and consensus participation</p>
      </div>

      <div className="validator-stats">
        <div className="stat-card">
          <h3>Active Validators</h3>
          <div className="stat-value">{validatorsData.activeValidators}</div>
        </div>
        <div className="stat-card">
          <h3>Total Staked</h3>
          <div className="stat-value">{validatorsData.totalStaked}</div>
        </div>
        <div className="stat-card">
          <h3>Consensus Rate</h3>
          <div className="stat-value">{validatorsData.consensusRate}%</div>
        </div>
      </div>

      <div className="validators-list">
        <h2>Validator Network</h2>
        <div className="validators-grid">
          {validatorsData.validators.length > 0 ? (
            validatorsData.validators.map((validator, index) => (
              <div key={index} className="validator-card">
                <h3>{validator.name}</h3>
                <p>Stake: {validator.stake}</p>
                <p>Performance: {validator.performance}%</p>
              </div>
            ))
          ) : (
            <div className="no-validators">
              <p>No validators registered</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatorPanel; 