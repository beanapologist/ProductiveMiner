import React from 'react';

const Analytics = ({ sharedData }) => {
  const { analyticsData } = sharedData;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>📈 Analytics</h1>
        <p>Performance trends and learning analysis</p>
      </div>

      <div className="analytics-content">
        <div className="analytics-grid">
          <div className="chart-card">
            <h3>Performance Trends</h3>
            <div className="chart-placeholder">
              <p>Chart data will be displayed here</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Learning Metrics</h3>
            <div className="chart-placeholder">
              <p>Learning analysis will be displayed here</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Security Metrics</h3>
            <div className="chart-placeholder">
              <p>Security analysis will be displayed here</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Resource Distribution</h3>
            <div className="chart-placeholder">
              <p>Resource allocation will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 