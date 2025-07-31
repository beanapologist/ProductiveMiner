import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import modern components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Wallet from './pages/Wallet';
import Markets from './pages/Markets';
import BlockExplorer from './pages/BlockExplorer';
import MiningControl from './pages/MiningControl';
import ValidatorPanel from './pages/ValidatorPanel';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Discoveries from './pages/Discoveries';
import ResearchRepository from './pages/ResearchRepository';

// Import API service
import apiService from './services/api';

function App() {
  console.log('🚀 App component rendering');
  
  // Enhanced state for connection management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Connection monitoring
  useEffect(() => {
    console.log('📊 App useEffect running - setting up connection monitoring');
    
    // Subscribe to connection changes
    const unsubscribe = apiService.onConnectionChange((connected) => {
      console.log(`🔗 Connection status changed: ${connected ? 'Connected' : 'Disconnected'}`);
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
      
      if (connected) {
        setError(null);
        setLastUpdate(new Date().toISOString());
      }
    });

    // Initial connection check
    const initializeConnection = async () => {
      try {
        console.log('🔍 Performing initial connection check...');
        const status = await apiService.getSystemStatus();
        console.log('✅ Initial connection successful:', status);
        setIsConnected(true);
        setConnectionStatus('connected');
        setLastUpdate(new Date().toISOString());
      } catch (error) {
        console.log('⚠️ Initial connection failed, but continuing in offline mode');
        setIsConnected(false);
        setConnectionStatus('disconnected');
      } finally {
        console.log('✅ Setting loading to false');
        setLoading(false);
      }
    };

    // Initialize with a short delay to allow API service to start
    const timer = setTimeout(initializeConnection, 1000);
    
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      apiService.cleanup();
    };
  }, []);

  // State for real-time data
  const [blockchainData, setBlockchainData] = useState({ 
    height: 0, 
    totalBlocks: 0, 
    totalTransactions: 0, 
    totalRewards: 0, 
    avgBlockTime: 0, 
    latestBlocks: [] 
  });
  const [systemHealth, setSystemHealth] = useState({ 
    status: 'disconnected', 
    uptime: 0, 
    activeConnections: 0, 
    lastBlock: 0, 
    networkStatus: 'disconnected' 
  });
  const [networkStats, setNetworkStats] = useState({ 
    totalBlocks: 0, 
    totalTransactions: 0, 
    totalDiscoveries: 0, 
    activeMiners: 0, 
    networkHashRate: '0 GH/s', 
    averageBlockTime: 0, 
    totalStaked: 0, 
    totalRewards: 0 
  });

  // Fetch real-time data when connected
  useEffect(() => {
    if (!isConnected) return;

    const fetchRealTimeData = async () => {
      try {
        // Fetch system status
        const status = await apiService.getSystemStatus();
        setBlockchainData({
          height: status.blockchain?.blockHeight || 0,
          totalBlocks: status.blockchain?.totalRewards || 0,
          totalTransactions: 0,
          totalRewards: status.blockchain?.totalRewards || 0,
          avgBlockTime: status.mining?.blockTime || 0,
          latestBlocks: []
        });

        setSystemHealth({
          status: 'connected',
          uptime: 3600,
          activeConnections: status.mining?.activeMiners || 0,
          lastBlock: status.blockchain?.blockHeight || 0,
          networkStatus: status.blockchain?.networkStatus || 'connected'
        });

        setNetworkStats({
          totalBlocks: status.blockchain?.blockHeight || 0,
          totalTransactions: 0,
          totalDiscoveries: 0,
          activeMiners: status.mining?.activeMiners || 0,
          networkHashRate: status.mining?.networkHashRate || '0 GH/s',
          averageBlockTime: status.mining?.blockTime || 0,
          totalStaked: 1000000,
          totalRewards: status.blockchain?.totalRewards || 0
        });
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    // Initial fetch
    fetchRealTimeData();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchRealTimeData, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Shared context data with real-time updates
  const sharedData = {
    isConnected,
    connectionStatus,
    lastUpdate,
    systemHealth,
    blockchainData,
    miningState: { 
      activeSessions: [], 
      workTypes: [], 
      difficulty: 25, 
      isMining: false 
    },
    validatorsData: { 
      validators: [], 
      totalStaked: 0, 
      activeValidators: 0, 
      consensusRate: 0 
    },
    discoveriesData: { 
      discoveries: [], 
      totalDiscoveries: 0, 
      pendingValidation: 0, 
      validatedDiscoveries: 0 
    },
    analyticsData: { 
      performanceTrends: [], 
      learningMetrics: [], 
      securityMetrics: [], 
      resourceDistribution: {} 
    },
    networkStats,
    formatBitStrength: (bitStrength) => bitStrength >= 1024 ? `${(bitStrength / 1024).toFixed(1)}K-bit` : `${bitStrength}-bit`,
    formatNumber: (num) => num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString(),
    formatCurrency: (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num),
    apiService
  };

  if (loading) {
    console.log('🔄 Rendering loading screen');
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading ProductiveMiner Adaptive Learning System...</p>
        <div className="connection-status">
          <span className={`status-indicator ${connectionStatus}`}>
            {connectionStatus === 'connecting' ? '🔍 Connecting...' : 
             connectionStatus === 'connected' ? '✅ Connected' : '⚠️ Offline Mode'}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ Rendering error screen');
    return (
      <div className="app-error">
        <h2>Connection Error</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()}>Retry</button>
          <button onClick={() => setError(null)}>Continue Offline</button>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering main app');
  return (
    <Router>
      <div className="App">
        
        <Layout sharedData={sharedData}>
          <Routes>
            <Route path="/" element={<Dashboard sharedData={sharedData} />} />
            <Route path="/trading" element={<Trading sharedData={sharedData} />} />
            <Route path="/wallet" element={<Wallet sharedData={sharedData} />} />
            <Route path="/markets" element={<Markets sharedData={sharedData} />} />
            <Route path="/blocks" element={<BlockExplorer sharedData={sharedData} />} />
            <Route path="/mining" element={<MiningControl sharedData={sharedData} />} />
            <Route path="/validators" element={<ValidatorPanel sharedData={sharedData} />} />
            <Route path="/analytics" element={<Analytics sharedData={sharedData} />} />
            <Route path="/discoveries" element={<Discoveries sharedData={sharedData} />} />
            <Route path="/research" element={<ResearchRepository sharedData={sharedData} />} />
            <Route path="/settings" element={<Settings sharedData={sharedData} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App; 