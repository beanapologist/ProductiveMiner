import React from 'react';
import './MiningControl.css';

const MiningControl = ({ sharedData }) => {
  const { miningState } = sharedData;

  return (
    <div className="mining-control-page">
      <div className="mining-header">
        <h1>⛏️ Mining Control</h1>
        <p>Manage mining sessions and computational work</p>
      </div>

      <div className="mining-content">
        <div className="mining-sessions">
          <h2>Active Mining Sessions</h2>
          <div className="sessions-list">
            {miningState.activeSessions.length > 0 ? (
              miningState.activeSessions.map((session, index) => (
                <div key={index} className="session-card">
                  <div className="session-info">
                    <h3>{session.workType}</h3>
                    <p>Difficulty: {session.difficulty}</p>
                    <p>Progress: {session.progress}%</p>
                  </div>
                  <div className="session-actions">
                    <button className="stop-btn">⏹️ Stop</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-sessions">
                <p>No active mining sessions</p>
              </div>
            )}
          </div>
        </div>

        <div className="mining-config">
          <h2>Start New Session</h2>
          <div className="config-form">
            <div className="form-group">
              <label>Work Type</label>
              <select className="form-select">
                <option>Select work type...</option>
                <option>Prime Number Patterns</option>
                <option>Riemann Hypothesis</option>
                <option>Yang-Mills Field Theory</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                className="difficulty-slider"
              />
            </div>

            <button className="start-btn">🚀 Start Mining</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningControl; 