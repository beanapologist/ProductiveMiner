import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConnectionStatus from './ConnectionStatus';
import './Layout.css';

const Layout = ({ children, sharedData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Exchange', icon: '💎' },
    { path: '/trading', label: 'Trading', icon: '📈' },
    { path: '/wallet', label: 'Wallet', icon: '💰' },
    { path: '/markets', label: 'Markets', icon: '🌐' },
    { path: '/blocks', label: 'Block Explorer', icon: '🔍' },
    { path: '/mining', label: 'Mining Control', icon: '⛏️' },
    { path: '/validators', label: 'Validators', icon: '🏛️' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/discoveries', label: 'Discoveries', icon: '🔬' },
    { path: '/research', label: 'Research', icon: '📚' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* Connection Status Widget */}
      <ConnectionStatus />
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className="logo">
              <h1>ProductiveMiner</h1>
              <span className="subtitle">$MINED Token Exchange</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="connection-status">
              <span className={`status-indicator ${sharedData.isConnected ? 'connected' : 'disconnected'}`}>
                {sharedData.isConnected ? '🟢' : '🔴'}
              </span>
              <span className="status-text">
                {sharedData.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="system-info">
              <span className="testnet-badge">Testnet Mode</span>
              <span className="block-height">
                Block: {sharedData.blockchainData.height}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-health">
            <h4>System Health</h4>
            <div className="health-item">
              <span>Status:</span>
              <span className={`health-status ${sharedData.systemHealth.status}`}>
                {sharedData.systemHealth.status}
              </span>
            </div>
            <div className="health-item">
              <span>Uptime:</span>
              <span>{Math.floor(sharedData.systemHealth.uptime / 3600)}h</span>
            </div>
            <div className="health-item">
              <span>Connections:</span>
              <span>{sharedData.systemHealth.activeConnections}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 