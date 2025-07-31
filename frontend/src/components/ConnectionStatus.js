import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    // Subscribe to connection changes
    const unsubscribe = apiService.onConnectionChange((connected) => {
      setIsConnected(connected);
      if (connected) {
        setLastUpdate(new Date().toISOString());
        setConnectionAttempts(0);
      } else {
        setConnectionAttempts(prev => prev + 1);
      }
    });

    // Initial connection check
    const checkInitialConnection = async () => {
      try {
        await apiService.getHealth();
        setIsConnected(true);
        setLastUpdate(new Date().toISOString());
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkInitialConnection();

    return unsubscribe;
  }, []);

  const getStatusText = () => {
    if (isConnected) {
      return '✅ Connected';
    } else if (connectionAttempts > 0) {
      return `⚠️ Reconnecting (${connectionAttempts})`;
    } else {
      return '❌ Disconnected';
    }
  };

  const getStatusClass = () => {
    if (isConnected) return 'connected';
    if (connectionAttempts > 0) return 'reconnecting';
    return 'disconnected';
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    const date = new Date(lastUpdate);
    return date.toLocaleTimeString();
  };

  return (
    <div className="connection-status-widget">
      <div className={`status-indicator ${getStatusClass()}`}>
        <span className="status-text">{getStatusText()}</span>
        {isConnected && (
          <span className="last-update">
            Last update: {formatLastUpdate()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus; 