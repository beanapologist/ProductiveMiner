import React, { useState, useEffect } from 'react';

const ComprehensiveAnalytics = () => {
  const [mlData, setMlData] = useState(null);
  const [adaptiveData, setAdaptiveData] = useState(null);
  const [discoveries, setDiscoveries] = useState([]);
  const [workflowStatus, setWorkflowStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [adaptationHistory, setAdaptationHistory] = useState([]);

  // Fetch adaptive learning data
  const fetchAdaptiveData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/adaptive-learning');
      const data = await response.json();
      setAdaptiveData(data);
    } catch (error) {
      console.error('Error fetching adaptive learning data:', error);
      setError('Failed to load adaptive learning data');
    }
  };

  // Fetch discoveries data
  const fetchDiscoveries = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/discoveries');
      const data = await response.json();
      setDiscoveries(data.discoveries || []);
    } catch (error) {
      console.error('Error fetching discoveries:', error);
    }
  };

  // Initialize data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAdaptiveData(), fetchDiscoveries()]);
      setLoading(false);
    };

    fetchData();

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAdaptiveData();
        fetchDiscoveries();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Generate adaptation history
  useEffect(() => {
    if (adaptiveData?.realTimeML?.models) {
      const history = Object.entries(adaptiveData.realTimeML.models).map(([name, model]) => ({
        id: name,
        type: 'model-update',
        component: name,
        timestamp: new Date(model.lastUpdated).toLocaleString(),
        metrics: {
          accuracy: model.accuracy,
          trainingCycles: model.trainingCycles,
          status: model.status
        },
        reason: `Model ${model.status === 'active' ? 'completed training' : 'is training'} with ${model.accuracy.toFixed(1)}% accuracy`
      }));
      setAdaptationHistory(history.slice(0, 10)); // Show last 10 adaptations
    }
  }, [adaptiveData]);

  if (loading) {
    return (
      <div className="analytics-interface">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading adaptive learning data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-interface">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-interface">
      <div className="analytics-header">
        <h2>📊 Analytics & Adaptive Learning</h2>
        <p className="analytics-subtitle">Real-time tracking of blockchain adaptations and ML model performance</p>
      </div>

      <div className="analytics-controls">
        <div className="control-group">
          <button 
            className={`control-btn ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
            aria-label={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
          >
            {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
          </button>
          <button 
            className="control-btn refresh"
            onClick={() => {
              fetchAdaptiveData();
              fetchDiscoveries();
            }}
            aria-label="Refresh data"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      <div className="main-content">
        {/* Workflow Overview */}
        <section className="workflow-overview">
          <h3>🔄 Blockchain Pipeline Workflow</h3>
          <div className="card-container">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">⛏️ Mining</h4>
                <span className="status-indicator active">Active</span>
              </div>
              <div className="card-content">
                <p>Mathematical computations and PoW consensus</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Block Creation</span>
                    <span>100%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="card-title">✅ Validation</h4>
                <span className="status-indicator active">Active</span>
              </div>
              <div className="card-content">
                <p>PoS validators verify computations</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Validation Rate</span>
                    <span>95%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="card-title">🔗 Blocks</h4>
                <span className="status-indicator active">Active</span>
              </div>
              <div className="card-content">
                <p>Blocks added to blockchain</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Chain Length</span>
                    <span>Growing</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="card-title">🔬 Assessment</h4>
                <span className="status-indicator active">Active</span>
              </div>
              <div className="card-content">
                <p>Discovery evaluation and analysis</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Assessment Rate</span>
                    <span>87%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="card-title">📚 Research</h4>
                <span className="status-indicator active">Active</span>
              </div>
              <div className="card-content">
                <p>Research repository and PoR layer</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Research Items</span>
                    <span>28</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="card-title">🧠 ML Model</h4>
                <span className="status-indicator active">Active</span>
              </div>
              <div className="card-content">
                <p>Adaptive ML model learning</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Learning Rate</span>
                    <span>87%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ML Models Section */}
        <section className="ml-models-section">
          <h3>🤖 Machine Learning Models</h3>
          <div className="card-container">
            {adaptiveData?.realTimeML?.models && Object.entries(adaptiveData.realTimeML.models).map(([name, model]) => (
              <div key={name} className="card">
                <div className="card-header">
                  <h4 className="card-title">{name}</h4>
                  <span className={`status-indicator ${model.status === 'active' ? 'active' : 'warning'}`}>
                    {model.status === 'active' ? 'Active' : 'Training'}
                  </span>
                </div>
                <div className="card-content">
                  <div className="progress-container">
                    <div className="progress-label">
                      <span>Accuracy</span>
                      <span>{model.accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${model.accuracy}%` }}></div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{model.trainingCycles}</div>
                    <div className="metric-label">Training Cycles</div>
                  </div>
                </div>
                <div className="card-footer">
                  <small>Updated: {new Date(model.lastUpdated).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Adaptation Tracking */}
        <section className="adaptation-tracking">
          <h3>📈 Recent Adaptations</h3>
          <div className="card-container">
            {adaptationHistory.map((adaptation, index) => (
              <div key={adaptation.id} className="card">
                <div className="card-header">
                  <h4 className="card-title">{adaptation.component}</h4>
                  <span className="status-indicator info">{adaptation.type}</span>
                </div>
                <div className="card-content">
                  <p>{adaptation.reason}</p>
                  <div className="metric-card">
                    <div className="metric-value">{adaptation.metrics.accuracy.toFixed(1)}%</div>
                    <div className="metric-label">Accuracy</div>
                  </div>
                </div>
                <div className="card-footer">
                  <small>{adaptation.timestamp}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="performance-metrics">
          <h3>📊 Performance Overview</h3>
          <div className="grid-4">
            <div className="metric-card">
              <div className="metric-value">{adaptiveData?.realTimeML?.analytics?.overall?.totalModels || 0}</div>
              <div className="metric-label">Total Models</div>
              <div className="metric-description">Active ML models in the system</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{adaptiveData?.realTimeML?.analytics?.overall?.avgAccuracy?.toFixed(1) || 0}%</div>
              <div className="metric-label">Average Accuracy</div>
              <div className="metric-description">Overall model performance</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{adaptiveData?.realTimeML?.analytics?.overall?.totalTrainingCycles || 0}</div>
              <div className="metric-label">Training Cycles</div>
              <div className="metric-description">Total learning iterations</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{adaptiveData?.realTimeML?.analytics?.overall?.discoveriesProcessed || 0}</div>
              <div className="metric-label">Discoveries Processed</div>
              <div className="metric-description">Mathematical breakthroughs analyzed</div>
            </div>
          </div>
        </section>

        {/* Discoveries Integration */}
        <section className="discoveries-integration">
          <h3>🔬 Recent Discoveries Impact</h3>
          <div className="card-container">
            {discoveries.slice(0, 6).map((discovery) => (
              <div key={discovery.id} className="card">
                <div className="card-header">
                  <h4 className="card-title">{discovery.name}</h4>
                  <span className={`status-indicator ${discovery.status === 'implemented' ? 'active' : 'warning'}`}>
                    {discovery.status}
                  </span>
                </div>
                <div className="card-content">
                  <p>{discovery.description}</p>
                  <div className="metric-card">
                    <div className="metric-value">{discovery.details?.impactScore || 0}</div>
                    <div className="metric-label">Impact Score</div>
                  </div>
                </div>
                <div className="card-footer">
                  <small>Type: {discovery.type}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComprehensiveAnalytics; 