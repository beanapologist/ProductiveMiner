import React from 'react';

const Settings = ({ sharedData }) => {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Configure system parameters and preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>System Configuration</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>API URL</label>
              <input type="text" defaultValue="http://localhost:3000" />
            </div>
            <div className="setting-item">
              <label>Blockchain URL</label>
              <input type="text" defaultValue="http://localhost:8545" />
            </div>
            <div className="setting-item">
              <label>Update Interval</label>
              <select defaultValue="10">
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Adaptive Learning Parameters</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Algorithm Learning Rate</label>
              <input type="range" min="100" max="2000" defaultValue="500" />
            </div>
            <div className="setting-item">
              <label>Security Learning Rate</label>
              <input type="range" min="100" max="2000" defaultValue="500" />
            </div>
            <div className="setting-item">
              <label>Consensus Learning Rate</label>
              <input type="range" min="100" max="1500" defaultValue="300" />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Security Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Quantum Security Level</label>
              <select defaultValue="256">
                <option value="128">128-bit</option>
                <option value="256">256-bit</option>
                <option value="512">512-bit</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Encryption Type</label>
              <select defaultValue="AES-256">
                <option value="AES-128">AES-128</option>
                <option value="AES-256">AES-256</option>
                <option value="ChaCha20">ChaCha20</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-btn">💾 Save Settings</button>
          <button className="reset-btn">🔄 Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 