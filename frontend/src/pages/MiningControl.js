import React, { useState, useEffect } from 'react';
import './MiningControl.css';

const MiningControl = ({ sharedData }) => {
  const { miningState, formatNumber, formatCurrency, apiService, networkStats } = sharedData;

  const [activeSessions, setActiveSessions] = useState([]);
  const [workTypes, setWorkTypes] = useState([
    { 
      name: 'prime_pattern', 
      category: 'Number Theory', 
      difficulty: 25, 
      description: 'Prime number pattern analysis and distribution studies',
      applications: ['Cryptography', 'Security', 'Random Number Generation'],
      researchStatus: 'Active Research',
      complexity: 'Medium',
      significance: 'High'
    },
    { 
      name: 'elliptic_curve_crypto', 
      category: 'Cryptography', 
      difficulty: 30, 
      description: 'Elliptic curve cryptography computations and key generation',
      applications: ['Digital Signatures', 'Key Exchange', 'Blockchain Security'],
      researchStatus: 'Production Ready',
      complexity: 'High',
      significance: 'Critical'
    },
    { 
      name: 'lattice_crypto', 
      category: 'Cryptography', 
      difficulty: 35, 
      description: 'Lattice-based cryptography for post-quantum security',
      applications: ['Post-Quantum Crypto', 'Homomorphic Encryption', 'Zero-Knowledge Proofs'],
      researchStatus: 'Advanced Research',
      complexity: 'Very High',
      significance: 'Critical'
    },
    { 
      name: 'birch_swinnerton_dyer', 
      category: 'Number Theory', 
      difficulty: 40, 
      description: 'Birch and Swinnerton-Dyer conjecture verification',
      applications: ['Mathematical Research', 'Cryptography', 'Number Theory'],
      researchStatus: 'Research',
      complexity: 'Very High',
      significance: 'High'
    },
    { 
      name: 'riemann_zeta', 
      category: 'Analysis', 
      difficulty: 45, 
      description: 'Riemann zeta function computations and zero analysis',
      applications: ['Mathematical Research', 'Prime Distribution', 'Analytic Number Theory'],
      researchStatus: 'Research',
      complexity: 'Very High',
      significance: 'Critical'
    },
    { 
      name: 'goldbach_conjecture', 
      category: 'Number Theory', 
      difficulty: 30, 
      description: 'Goldbach conjecture verification and proof attempts',
      applications: ['Number Theory', 'Mathematical Research', 'Proof Verification'],
      researchStatus: 'Research',
      complexity: 'High',
      significance: 'High'
    },
    { 
      name: 'yang_mills', 
      category: 'Physics', 
      difficulty: 50, 
      description: 'Yang-Mills theory calculations and gauge field analysis',
      applications: ['Quantum Field Theory', 'Particle Physics', 'Theoretical Physics'],
      researchStatus: 'Research',
      complexity: 'Very High',
      significance: 'Critical'
    },
    { 
      name: 'navier_stokes', 
      category: 'Physics', 
      difficulty: 55, 
      description: 'Navier-Stokes equations and fluid dynamics simulation',
      applications: ['Fluid Dynamics', 'Weather Prediction', 'Engineering'],
      researchStatus: 'Research',
      complexity: 'Very High',
      significance: 'High'
    },
    { 
      name: 'ecc_crypto', 
      category: 'Cryptography', 
      difficulty: 25, 
      description: 'Elliptic curve cryptography for secure communications',
      applications: ['Digital Signatures', 'Key Exchange', 'Secure Communications'],
      researchStatus: 'Production Ready',
      complexity: 'High',
      significance: 'Critical'
    },
    { 
      name: 'poincare_conjecture', 
      category: 'Topology', 
      difficulty: 60, 
      description: 'Poincaré conjecture analysis and topological verification',
      applications: ['Topology', 'Mathematical Research', 'Geometric Analysis'],
      researchStatus: 'Research',
      complexity: 'Very High',
      significance: 'High'
    }
  ]);
  const [newSession, setNewSession] = useState({
    workType: '',
    difficulty: 25,
    quantumSecurity: 256,
    duration: 15,
    algorithm: 'RSA-256'
  });

  const [miningStats, setMiningStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    completedSessions: 0,
    totalRewards: 0,
    averageEfficiency: 0,
    totalDiscoveries: 0,
    networkHashRate: '0 GH/s',
    averageDifficulty: 0
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    gpuUsage: 0,
    temperature: 0,
    powerConsumption: 0,
    networkLatency: 0
  });

  // Fetch real data from backend
  useEffect(() => {
    const fetchMiningData = async () => {
      try {
        const [miningStatus, mathematicalCapabilities, networkStatsData] = await Promise.all([
          apiService.getMiningStatus(),
          apiService.getMiningMathematicalCapabilities(),
          apiService.getNetworkStats()
        ]);

        // Update work types from backend
        const workTypesFromBackend = miningStatus.workTypes || mathematicalCapabilities.supportedWorkTypes || [];
        console.log('Received work types:', workTypesFromBackend);
        setWorkTypes(workTypesFromBackend);

        // Update mining stats from network data
        setMiningStats({
          totalSessions: networkStatsData.activeMiners || 0,
          activeSessions: networkStatsData.activeMiners || 0,
          completedSessions: Math.floor(networkStatsData.totalBlocks * 0.8),
          totalRewards: networkStatsData.totalRewards || 0,
          averageEfficiency: 85, // Default efficiency
          totalDiscoveries: networkStatsData.totalDiscoveries || 0,
          networkHashRate: networkStatsData.networkHashRate || '0 GH/s',
          averageDifficulty: mathematicalCapabilities.currentDifficulty || 25
        });

        // Update performance metrics
        setPerformanceMetrics({
          cpuUsage: Math.floor(Math.random() * 30) + 60, // Simulated CPU usage
          memoryUsage: Math.floor(Math.random() * 20) + 50, // Simulated memory usage
          gpuUsage: 0, // No GPU mining in this system
          temperature: Math.floor(Math.random() * 10) + 40, // Simulated temperature
          powerConsumption: Math.floor(Math.random() * 50) + 100, // Simulated power consumption
          networkLatency: Math.floor(Math.random() * 5) + 10 // Simulated network latency
        });

      } catch (error) {
        console.error('Error fetching mining data:', error);
        // Set default work types if all else fails
        const defaultWorkTypes = [
          { 
            name: 'prime_pattern', 
            category: 'Number Theory', 
            difficulty: 25, 
            description: 'Prime number pattern analysis and distribution studies',
            applications: ['Cryptography', 'Security', 'Random Number Generation'],
            researchStatus: 'Active Research',
            complexity: 'Medium',
            significance: 'High'
          },
          { 
            name: 'elliptic_curve_crypto', 
            category: 'Cryptography', 
            difficulty: 30, 
            description: 'Elliptic curve cryptography computations and key generation',
            applications: ['Digital Signatures', 'Key Exchange', 'Blockchain Security'],
            researchStatus: 'Production Ready',
            complexity: 'High',
            significance: 'Critical'
          },
          { 
            name: 'lattice_crypto', 
            category: 'Cryptography', 
            difficulty: 35, 
            description: 'Lattice-based cryptography for post-quantum security',
            applications: ['Post-Quantum Crypto', 'Homomorphic Encryption', 'Zero-Knowledge Proofs'],
            researchStatus: 'Advanced Research',
            complexity: 'Very High',
            significance: 'Critical'
          },
          { 
            name: 'birch_swinnerton_dyer', 
            category: 'Number Theory', 
            difficulty: 40, 
            description: 'Birch and Swinnerton-Dyer conjecture verification',
            applications: ['Mathematical Research', 'Cryptography', 'Number Theory'],
            researchStatus: 'Research',
            complexity: 'Very High',
            significance: 'High'
          },
          { 
            name: 'riemann_zeta', 
            category: 'Analysis', 
            difficulty: 45, 
            description: 'Riemann zeta function computations and zero analysis',
            applications: ['Mathematical Research', 'Prime Distribution', 'Analytic Number Theory'],
            researchStatus: 'Research',
            complexity: 'Very High',
            significance: 'Critical'
          },
          { 
            name: 'goldbach_conjecture', 
            category: 'Number Theory', 
            difficulty: 30, 
            description: 'Goldbach conjecture verification and proof attempts',
            applications: ['Number Theory', 'Mathematical Research', 'Proof Verification'],
            researchStatus: 'Research',
            complexity: 'High',
            significance: 'High'
          },
          { 
            name: 'yang_mills', 
            category: 'Physics', 
            difficulty: 50, 
            description: 'Yang-Mills theory calculations and gauge field analysis',
            applications: ['Quantum Field Theory', 'Particle Physics', 'Theoretical Physics'],
            researchStatus: 'Research',
            complexity: 'Very High',
            significance: 'Critical'
          },
          { 
            name: 'navier_stokes', 
            category: 'Physics', 
            difficulty: 55, 
            description: 'Navier-Stokes equations and fluid dynamics simulation',
            applications: ['Fluid Dynamics', 'Weather Prediction', 'Engineering'],
            researchStatus: 'Research',
            complexity: 'Very High',
            significance: 'High'
          },
          { 
            name: 'ecc_crypto', 
            category: 'Cryptography', 
            difficulty: 25, 
            description: 'Elliptic curve cryptography for secure communications',
            applications: ['Digital Signatures', 'Key Exchange', 'Secure Communications'],
            researchStatus: 'Production Ready',
            complexity: 'High',
            significance: 'Critical'
          },
          { 
            name: 'poincare_conjecture', 
            category: 'Topology', 
            difficulty: 60, 
            description: 'Poincaré conjecture analysis and topological verification',
            applications: ['Topology', 'Mathematical Research', 'Geometric Analysis'],
            researchStatus: 'Research',
            complexity: 'Very High',
            significance: 'High'
          }
        ];
        console.log('Using default work types due to error');
        setWorkTypes(defaultWorkTypes);
      }
    };

    fetchMiningData();

    // Set up periodic updates
    const interval = setInterval(() => {
      fetchMiningData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [apiService]);

  // Simulate real-time updates for active sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSessions(prev => prev.map(session => ({
        ...session,
        progress: Math.min(100, session.progress + Math.random() * 5),
        hashRate: session.hashRate + (Math.random() - 0.5) * 0.5,
        efficiency: session.efficiency + (Math.random() - 0.5) * 2
      })));

      setPerformanceMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        temperature: Math.max(35, Math.min(70, prev.temperature + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStartSession = async () => {
    console.log('🚀 Start mining button clicked');
    console.log('Current session state:', newSession);
    console.log('Available work types:', workTypes);
    
    try {
      if (!newSession.workType) {
        console.log('No work type selected');
        alert('Please select a work type to start mining');
        return;
      }

      const selectedWorkType = workTypes.find(wt => wt.name === newSession.workType);
      if (!selectedWorkType) {
        console.log('Selected work type not found:', newSession.workType);
        alert('Selected work type not found. Please try again.');
        return;
      }

      console.log('Starting mining session with work type:', selectedWorkType.name);
      
      // Use API service to start mining session
      const sessionData = await apiService.startMiningSession(
        selectedWorkType.name,
        newSession.difficulty,
        newSession.duration
      );

      console.log('Session data received:', sessionData);

      const session = {
        id: sessionData.sessionId,
        workType: selectedWorkType.name,
        difficulty: newSession.difficulty,
        progress: 0,
        status: sessionData.status || 'active',
        hashRate: selectedWorkType.difficulty * 0.1,
        estimatedReward: sessionData.reward || selectedWorkType.reward || 50,
        startTime: sessionData.startTime,
        estimatedCompletion: sessionData.estimatedCompletion,
        quantumSecurity: newSession.quantumSecurity,
        algorithm: newSession.algorithm,
        efficiency: selectedWorkType.successRate || 85,
        discoveries: 0,
        offline: sessionData.offline || false
      };

      console.log('Created session:', session);

      setActiveSessions(prev => [...prev, session]);
      setMiningStats(prev => ({
        ...prev,
        totalSessions: prev.totalSessions + 1,
        activeSessions: prev.activeSessions + 1
      }));

      // Reset form
      setNewSession({
        workType: '',
        difficulty: 25,
        quantumSecurity: 256,
        duration: 15,
        algorithm: 'RSA-256'
      });

      // Show mining results
      if (sessionData.success) {
        console.log('Mining successful!', sessionData);
        const hashDisplay = sessionData.blockHash && sessionData.blockHash !== 'offline' 
          ? sessionData.blockHash.substring(0, 16) + '...' 
          : 'Offline Mode';
        alert(`✅ Mining session started!\n\nWork Type: ${selectedWorkType.name}\nBlock Height: ${sessionData.blockHeight || 'Pending'}\nReward: ${sessionData.reward} MINED\nHash: ${hashDisplay}`);
        
        // Trigger a refresh of the block explorer data
        // This will be handled by the parent component's data fetching
        console.log('Mining session created - block explorer should refresh automatically');
      } else if (sessionData.offline) {
        console.log('Mining session created in offline mode');
        alert(`⚠️ Mining session started in offline mode!\n\nWork Type: ${selectedWorkType.name}\nStatus: Offline (Backend unavailable)\nSession will run locally`);
      } else {
        console.log('Mining failed');
        alert('❌ Mining failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Error starting mining session:', error);
      alert('Error starting mining session. Please try again.');
    }
  };

  const handleStopSession = async (sessionId) => {
    try {
      await apiService.stopMiningSession(sessionId);
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      setMiningStats(prev => ({
        ...prev,
        activeSessions: prev.activeSessions - 1
      }));
    } catch (error) {
      console.error('Error stopping mining session:', error);
    }
  };

  const handlePauseSession = (sessionId) => {
    setActiveSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: session.status === 'active' ? 'paused' : 'active' }
        : session
    ));
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatTimeRemaining = (startTime, estimatedCompletion) => {
    const now = new Date();
    const completion = new Date(estimatedCompletion);
    const remaining = completion - now;
    if (remaining <= 0) return 'Complete';
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Debug logging
  console.log('Current work types:', workTypes);
  console.log('Work types length:', workTypes.length);

  return (
    <div className="mining-control-page">
      <div className="mining-header">
        <h1>⛏️ Mining Control Center</h1>
        <p>Manage mining sessions and computational work with real-time monitoring</p>
      </div>

      {/* New Session Configuration - MOVED TO TOP */}
      <div className="session-config-section">
        <h2>🚀 Start New Mining Session</h2>
        <div className="config-form">
          <div className="form-row">
            <div className="form-group">
              <label>Work Type</label>
              <select 
                value={newSession.workType}
                onChange={(e) => {
                  console.log('Work type selected:', e.target.value);
                  setNewSession(prev => ({ ...prev, workType: e.target.value }));
                }}
                className="form-select"
              >
                <option value="">Select a work type...</option>
                {workTypes.map((workType) => (
                  <option key={workType.name} value={workType.name}>
                    {workType.name} (Difficulty: {workType.difficulty || 25})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level: {newSession.difficulty}</label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={newSession.difficulty}
                onChange={(e) => setNewSession(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
                className="difficulty-slider"
              />
              <div className="difficulty-labels">
                <span>Easy</span>
                <span>Medium</span>
                <span>Hard</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantum Security Level</label>
              <select 
                value={newSession.quantumSecurity}
                onChange={(e) => setNewSession(prev => ({ ...prev, quantumSecurity: parseInt(e.target.value) }))}
                className="form-select"
              >
                <option value="128">128-bit (Standard)</option>
                <option value="256">256-bit (Recommended)</option>
                <option value="384">384-bit (High Security)</option>
                <option value="512">512-bit (Maximum)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Session Duration</label>
              <select 
                value={newSession.duration}
                onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="form-select"
              >
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
              </select>
            </div>

            <div className="form-group">
              <label>Algorithm</label>
              <select 
                value={newSession.algorithm}
                onChange={(e) => setNewSession(prev => ({ ...prev, algorithm: e.target.value }))}
                className="form-select"
              >
                <option value="RSA-256">RSA-256</option>
                <option value="ECC-512">ECC-512</option>
                <option value="Lattice-384">Lattice-384</option>
                <option value="NTRU-256">NTRU-256</option>
                <option value="AES-128">AES-128</option>
              </select>
            </div>
          </div>

          <div className="session-preview">
            <h3>Session Preview</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <span className="label">Work Type:</span>
                <span className="value" style={{
                  color: newSession.workType ? '#10b981' : '#ef4444',
                  fontWeight: newSession.workType ? '700' : '500'
                }}>
                  {newSession.workType || 'Not selected'}
                </span>
              </div>
              <div className="preview-item">
                <span className="label">Difficulty:</span>
                <span className="value">{newSession.difficulty}</span>
              </div>
              <div className="preview-item">
                <span className="label">Security:</span>
                <span className="value">{newSession.quantumSecurity}-bit</span>
              </div>
              <div className="preview-item">
                <span className="label">Duration:</span>
                <span className="value">{formatDuration(newSession.duration)}</span>
              </div>
              <div className="preview-item">
                <span className="label">Algorithm:</span>
                <span className="value">{newSession.algorithm}</span>
              </div>
              <div className="preview-item">
                <span className="label">Estimated Reward:</span>
                <span className="value">
                  {newSession.workType ? formatCurrency(workTypes.find(wt => wt.name === newSession.workType)?.reward || 50) : '$0'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStartSession}
            disabled={!newSession.workType}
            className={`btn-start-session ${!newSession.workType ? 'disabled' : ''}`}
            style={{
              opacity: !newSession.workType ? 0.6 : 1,
              cursor: !newSession.workType ? 'not-allowed' : 'pointer'
            }}
          >
            🚀 Start Mining Session
          </button>
        </div>
      </div>

      {/* Mining Statistics */}
      <div className="mining-stats">
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Active Sessions</h3>
            <div className="stat-value">{miningStats.activeSessions}</div>
            <div className="stat-details">
              <span>Total: {miningStats.totalSessions}</span>
              <span>Completed: {miningStats.completedSessions}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Rewards</h3>
            <div className="stat-value">{formatCurrency(miningStats.totalRewards)}</div>
            <div className="stat-details">
              <span>Network Total: {formatCurrency(networkStats.totalRewards || 0)}</span>
              <span>Discoveries: {miningStats.totalDiscoveries}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Performance</h3>
            <div className="stat-value">{miningStats.averageEfficiency}%</div>
            <div className="stat-details">
              <span>Efficiency</span>
              <span>Hash Rate: {miningStats.networkHashRate}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Difficulty</h3>
            <div className="stat-value">{miningStats.averageDifficulty}</div>
            <div className="stat-details">
              <span>Average</span>
              <span>Range: 20-50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Monitoring */}
      <div className="performance-section">
        <h2>🖥️ System Performance</h2>
        <div className="performance-grid">
          <div className="performance-card">
            <h3>CPU Usage</h3>
            <div className="performance-value">{performanceMetrics.cpuUsage}%</div>
            <div className="performance-bar">
              <div 
                className="performance-fill" 
                style={{
                  width: `${performanceMetrics.cpuUsage}%`,
                  background: performanceMetrics.cpuUsage > 80 ? '#ef4444' : '#10b981'
                }}
              ></div>
            </div>
          </div>

          <div className="performance-card">
            <h3>Memory Usage</h3>
            <div className="performance-value">{performanceMetrics.memoryUsage}%</div>
            <div className="performance-bar">
              <div 
                className="performance-fill" 
                style={{
                  width: `${performanceMetrics.memoryUsage}%`,
                  background: performanceMetrics.memoryUsage > 80 ? '#ef4444' : '#10b981'
                }}
              ></div>
            </div>
          </div>

          <div className="performance-card">
            <h3>Temperature</h3>
            <div className="performance-value">{performanceMetrics.temperature}°C</div>
            <div className="performance-bar">
              <div 
                className="performance-fill" 
                style={{
                  width: `${(performanceMetrics.temperature / 100) * 100}%`,
                  background: performanceMetrics.temperature > 60 ? '#ef4444' : '#10b981'
                }}
              ></div>
            </div>
          </div>

          <div className="performance-card">
            <h3>Power Consumption</h3>
            <div className="performance-value">{performanceMetrics.powerConsumption}W</div>
            <div className="performance-bar">
              <div 
                className="performance-fill" 
                style={{
                  width: `${(performanceMetrics.powerConsumption / 200) * 100}%`,
                  background: performanceMetrics.powerConsumption > 150 ? '#ef4444' : '#10b981'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Mining Sessions */}
      <div className="sessions-section">
        <h2>🔄 Active Mining Sessions</h2>
        <div className="sessions-grid">
          {activeSessions.length > 0 ? (
            activeSessions.map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-info">
                    <h3>{session.workType}</h3>
                    <span className={`session-status ${session.status}`}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="session-actions">
                    <button 
                      onClick={() => handlePauseSession(session.id)}
                      className={`btn-${session.status === 'active' ? 'pause' : 'resume'}`}
                    >
                      {session.status === 'active' ? '⏸️' : '▶️'}
                    </button>
                    <button 
                      onClick={() => handleStopSession(session.id)}
                      className="btn-stop"
                    >
                      ⏹️
                    </button>
                  </div>
                </div>

                <div className="session-progress">
                  <div className="progress-info">
                    <span>Progress: {session.progress.toFixed(1)}%</span>
                    <span>Time Remaining: {formatTimeRemaining(session.startTime, session.estimatedCompletion)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${session.progress}%`,
                        background: `linear-gradient(90deg, ${getStatusColor(session.status)} 0%, ${getStatusColor(session.status)}80 100%)`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="session-metrics">
                  <div className="metric-row">
                    <span>Difficulty:</span>
                    <span>{session.difficulty}</span>
                  </div>
                  <div className="metric-row">
                    <span>Hash Rate:</span>
                    <span>{session.hashRate.toFixed(2)} GH/s</span>
                  </div>
                  <div className="metric-row">
                    <span>Efficiency:</span>
                    <span>{session.efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="metric-row">
                    <span>Estimated Reward:</span>
                    <span>{formatCurrency(session.estimatedReward)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Quantum Security:</span>
                    <span>{session.quantumSecurity}-bit</span>
                  </div>
                  <div className="metric-row">
                    <span>Algorithm:</span>
                    <span>{session.algorithm}</span>
                  </div>
                  <div className="metric-row">
                    <span>Discoveries:</span>
                    <span>{session.discoveries}</span>
                  </div>
                </div>

                <div className="session-timeline">
                  <div className="timeline-item">
                    <span className="timeline-label">Started:</span>
                    <span className="timeline-value">{new Date(session.startTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-label">Estimated Completion:</span>
                    <span className="timeline-value">{new Date(session.estimatedCompletion).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-sessions">
              <p>No active mining sessions</p>
              <p>Start a new session to begin mining</p>
            </div>
          )}
        </div>
      </div>

      {/* Work Types Selection */}
      <div className="work-types-section">
        <h2>🔬 Available Work Types ({workTypes.length} total)</h2>
        <div className="work-types-grid">
          {workTypes.map((workType) => (
            <div key={workType.name} className="work-type-card">
              <div className="work-type-header">
                <div className="work-type-icon">🔬</div>
                <div className="work-type-info">
                  <h3>{workType.name}</h3>
                  <p>{workType.description}</p>
                </div>
              </div>

              <div className="work-type-metrics">
                <div className="metric-item">
                  <span className="label">Category:</span>
                  <span className="value">{workType.category}</span>
                </div>
                <div className="metric-item">
                  <span className="label">Difficulty:</span>
                  <span className="value">{workType.difficulty}</span>
                </div>
                <div className="metric-item">
                  <span className="label">Estimated Reward:</span>
                  <span className="value">{formatCurrency(workType.difficulty * 2)}</span>
                </div>
                <div className="metric-item">
                  <span className="label">Success Rate:</span>
                  <span className="value">{Math.max(60, 100 - workType.difficulty)}%</span>
                </div>
                <div className="metric-item">
                  <span className="label">Description:</span>
                  <span className="value">{workType.description}</span>
                </div>
              </div>

              <button 
                onClick={() => setNewSession(prev => ({ ...prev, workType: workType.name }))}
                className={`btn-select-work ${newSession.workType === workType.name ? 'selected' : ''}`}
                style={{
                  background: newSession.workType === workType.name 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {newSession.workType === workType.name ? '✓ Selected' : 'Select Work Type'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiningControl; 