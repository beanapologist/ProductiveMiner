import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import modern components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BlockExplorer from './pages/BlockExplorer';
import MiningControl from './pages/MiningControl';
import ValidatorPanel from './pages/ValidatorPanel';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Discoveries from './pages/Discoveries';
import ComprehensiveAnalytics from './pages/ComprehensiveAnalytics';

function App() {
  // Global state management
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // System health state
  const [systemHealth, setSystemHealth] = useState({
    status: 'loading',
    uptime: 0,
    activeConnections: 0,
    lastBlock: 0,
    networkStatus: 'connecting'
  });

  // Blockchain data state
  const [blockchainData, setBlockchainData] = useState({
    height: 0,
    totalBlocks: 0,
    totalTransactions: 0,
    totalRewards: 0,
    avgBlockTime: 0,
    latestBlocks: []
  });

  // Mining state
  const [miningState, setMiningState] = useState({
    activeSessions: [],
    workTypes: [],
    difficulty: 25,
    isMining: false
  });

  // Validators state
  const [validatorsData, setValidatorsData] = useState({
    validators: [],
    totalStaked: 0,
    activeValidators: 0,
    consensusRate: 0
  });

  // Discoveries state
  const [discoveriesData, setDiscoveriesData] = useState({
    discoveries: [],
    totalDiscoveries: 0,
    pendingValidation: 0,
    validatedDiscoveries: 0
  });

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState({
    performanceTrends: [],
    learningMetrics: [],
    securityMetrics: [],
    resourceDistribution: {}
  });

  // Helper functions
  const formatBitStrength = (bitStrength) => {
    if (bitStrength >= 1024) {
      return `${(bitStrength / 1024).toFixed(1)}K-bit`;
    }
    return `${bitStrength}-bit`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // API functions
  const fetchSystemHealth = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/health`);
      if (response.ok) {
        const data = await response.json();
        setSystemHealth({
          status: 'healthy',
          uptime: data.uptime || 0,
          activeConnections: data.activeConnections || 0,
          lastBlock: data.lastBlock || 0,
          networkStatus: 'connected'
        });
        setIsConnected(true);
      } else {
        setSystemHealth(prev => ({ ...prev, status: 'error', networkStatus: 'disconnected' }));
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
      setSystemHealth(prev => ({ ...prev, status: 'error', networkStatus: 'disconnected' }));
      setIsConnected(false);
    }
  }, []);

  const fetchBlockchainData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/blockchain`);
      if (response.ok) {
        const data = await response.json();
        setBlockchainData(data);
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    }
  }, []);

  const fetchMiningData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/mining`);
      if (response.ok) {
        const data = await response.json();
        setMiningState(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching mining data:', error);
    }
  }, []);

  const fetchValidatorsData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/validators`);
      if (response.ok) {
        const data = await response.json();
        setValidatorsData(data);
      }
    } catch (error) {
      console.error('Error fetching validators data:', error);
    }
  }, []);

  const fetchDiscoveriesData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/discoveries`);
      if (response.ok) {
        const data = await response.json();
        setDiscoveriesData(data);
      }
    } catch (error) {
      console.error('Error fetching discoveries data:', error);
    }
  }, []);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  }, []);

  // Initialize data fetching
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSystemHealth(),
          fetchBlockchainData(),
          fetchMiningData(),
          fetchValidatorsData(),
          fetchDiscoveriesData(),
          fetchAnalyticsData()
        ]);
      } catch (error) {
        setError('Failed to initialize application');
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Set up periodic data refresh
    const interval = setInterval(() => {
      fetchSystemHealth();
      fetchBlockchainData();
      fetchMiningData();
      fetchValidatorsData();
      fetchDiscoveriesData();
      fetchAnalyticsData();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [fetchSystemHealth, fetchBlockchainData, fetchMiningData, fetchValidatorsData, fetchDiscoveriesData, fetchAnalyticsData]);

  // Shared context data
  const sharedData = {
    isConnected,
    systemHealth,
    blockchainData,
    miningState,
    validatorsData,
    discoveriesData,
    analyticsData,
    formatBitStrength,
    formatNumber,
    formatCurrency
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading ProductiveMiner Adaptive Learning System...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Layout sharedData={sharedData}>
          <Routes>
            <Route path="/" element={<Dashboard sharedData={sharedData} />} />
            <Route path="/blocks" element={<BlockExplorer sharedData={sharedData} />} />
            <Route path="/mining" element={<MiningControl sharedData={sharedData} />} />
            <Route path="/validators" element={<ValidatorPanel sharedData={sharedData} />} />
            <Route path="/analytics" element={<Analytics sharedData={sharedData} />} />
            <Route path="/discoveries" element={<Discoveries sharedData={sharedData} />} />
            <Route path="/comprehensive-analytics" element={<ComprehensiveAnalytics sharedData={sharedData} />} />
            <Route path="/settings" element={<Settings sharedData={sharedData} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App; 