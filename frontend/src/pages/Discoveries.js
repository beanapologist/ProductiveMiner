import React, { useState, useEffect } from 'react';

const Discoveries = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const [stats, setStats] = useState({
    totalDiscoveries: 0,
    implemented: 0,
    testing: 0,
    research: 0,
    discoveryRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  // Fetch discoveries data
  const fetchDiscoveries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/discoveries');
      if (!response.ok) {
        throw new Error('Failed to fetch discoveries');
      }
      const data = await response.json();
      setDiscoveries(data.discoveries || []);
      setStats(data.stats || {
        totalDiscoveries: 0,
        implemented: 0,
        testing: 0,
        research: 0,
        discoveryRate: 0
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching discoveries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test discovery implementation
  const testDiscovery = async (discoveryId) => {
    try {
      console.log('Testing discovery:', discoveryId);
      
      const response = await fetch(`http://localhost:3000/api/discoveries/${discoveryId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to test discovery');
      }
      
      const result = await response.json();
      console.log('Test result:', result);
      
      // Show success message with details
      alert(`🧪 Discovery Test Completed Successfully!\n\n` +
            `Discovery: ${discoveryId}\n` +
            `Status: ${result.testStatus.toUpperCase()}\n` +
            `Verification Score: ${result.verificationScore}%\n` +
            `Accuracy: ${result.performanceMetrics.accuracy}%\n` +
            `Efficiency: ${result.performanceMetrics.efficiency}%\n` +
            `Reliability: ${result.performanceMetrics.reliability}%\n\n` +
            `✅ Ready for deployment!`);
      
      // Refresh discoveries after test to show updated status
      fetchDiscoveries();
      
      return result;
    } catch (err) {
      console.error('Error testing discovery:', err);
      alert(`❌ Test failed: ${err.message}`);
      throw err;
    }
  };

  // Deploy discovery
  const deployDiscovery = async (discoveryId) => {
    try {
      console.log('Deploying discovery:', discoveryId);
      
      const response = await fetch(`http://localhost:3000/api/discoveries/${discoveryId}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to deploy discovery');
      }
      
      const result = await response.json();
      console.log('Deployment result:', result);
      
      // Show success message with details
      alert(`🚀 Discovery Deployed Successfully!\n\n` +
            `Discovery: ${discoveryId}\n` +
            `Status: ${result.deploymentStatus.toUpperCase()}\n` +
            `Version: ${result.deploymentVersion}\n` +
            `Uptime: ${result.deploymentMetrics.uptime}%\n` +
            `Performance: ${result.deploymentMetrics.performance}%\n` +
            `Scalability: ${result.deploymentMetrics.scalability}%\n\n` +
            `Network Impact:\n` +
            `• Blocks Processed: ${result.networkImpact.blocksProcessed}\n` +
            `• Transactions Optimized: ${result.networkImpact.transactionsOptimized}\n` +
            `• Efficiency Gain: ${result.networkImpact.efficiencyGain}%\n\n` +
            `✅ Discovery is now live on the network!`);
      
      // Refresh discoveries after deployment to show updated status
      fetchDiscoveries();
      
      return result;
    } catch (err) {
      console.error('Error deploying discovery:', err);
      alert(`❌ Deployment failed: ${err.message}`);
      throw err;
    }
  };

  // Filter discoveries based on status
  const getFilteredDiscoveries = () => {
    if (filter === 'all') return discoveries;
    return discoveries.filter(discovery => discovery.status === filter);
  };

  // Sort discoveries
  const getSortedDiscoveries = (discoveryList) => {
    return [...discoveryList].sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.details?.timestamp || 0) - new Date(a.details?.timestamp || 0);
        case 'reward':
          return (b.details?.reward || 0) - (a.details?.reward || 0);
        case 'impact':
          const impactOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return impactOrder[b.impact?.toLowerCase()] - impactOrder[a.impact?.toLowerCase()];
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  // Format number for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'implemented':
        return 'text-green-600 bg-green-100';
      case 'testing':
        return 'text-yellow-600 bg-yellow-100';
      case 'research':
        return 'text-blue-600 bg-blue-100';
      case 'validated':
        return 'text-purple-600 bg-purple-100';
      case 'deployed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    fetchDiscoveries();
    
    // Set up periodic refresh
    const interval = setInterval(fetchDiscoveries, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 text-xl mb-4">Error loading discoveries</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button 
          onClick={fetchDiscoveries}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredDiscoveries = getFilteredDiscoveries();
  const sortedDiscoveries = getSortedDiscoveries(filteredDiscoveries);

  return (
    <div className="discoveries-interface p-6">
      {/* Header */}
      <div className="discoveries-header mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🔬 Advanced Discoveries</h2>
        <div className="text-gray-600">Mathematical breakthroughs and blockchain innovations</div>
      </div>

      {/* Stats Summary */}
      <div className="discovery-stats-summary grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="stat bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Total Discoveries</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalDiscoveries}</div>
        </div>
        <div className="stat bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Implemented</div>
          <div className="text-2xl font-bold text-green-600">{stats.implemented}</div>
        </div>
        <div className="stat bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Testing</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.testing}</div>
        </div>
        <div className="stat bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Research</div>
          <div className="text-2xl font-bold text-blue-600">{stats.research}</div>
        </div>
        <div className="stat bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">Discovery Rate</div>
          <div className="text-2xl font-bold text-purple-600">{stats.discoveryRate}%</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="controls mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="implemented">Implemented</option>
            <option value="testing">Testing</option>
            <option value="research">Research</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="timestamp">Date</option>
            <option value="reward">Reward</option>
            <option value="impact">Impact</option>
            <option value="name">Name</option>
          </select>
        </div>
        
        <button 
          onClick={fetchDiscoveries}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Discoveries Grid */}
      <div className="discoveries-grid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedDiscoveries.length > 0 ? (
          sortedDiscoveries.map((discovery, index) => (
            <div key={discovery.id || index} className="discovery-card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="discovery-header mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{discovery.name || 'Advanced Discovery'}</h4>
                  <span className={`status px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(discovery.status)}`}>
                    {discovery.status === 'implemented' ? '⚡ Implemented' :
                     discovery.status === 'validated' ? '✅ Validated' :
                     discovery.status === 'deployed' ? '🚀 Deployed' :
                     discovery.status === 'testing' ? '🧪 Testing' : 
                     discovery.status === 'research' ? '🔬 Research' : '🔬 Research'}
                  </span>
                </div>
                {discovery.deploymentStatus === 'deployed' && (
                  <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    🚀 Deployed v1.0.0
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {discovery.description || 'Advanced mathematical discovery with significant implications for blockchain technology.'}
              </p>
              
              <div className="discovery-metrics grid grid-cols-2 gap-3 mb-4">
                <div className="discovery-metric">
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="text-sm font-medium">{discovery.type || 'Mathematical'}</div>
                </div>
                <div className="discovery-metric">
                  <div className="text-xs text-gray-500">Impact</div>
                  <div className={`text-sm font-medium px-2 py-1 rounded ${getImpactColor(discovery.impact)}`}>
                    {discovery.impact?.charAt(0).toUpperCase() + discovery.impact?.slice(1).toLowerCase() || 'High'}
                  </div>
                </div>
                <div className="discovery-metric">
                  <div className="text-xs text-gray-500">Reward</div>
                  <div className="text-sm font-medium text-green-600">
                    {formatNumber(discovery.details?.reward || 5000)} MINED
                  </div>
                </div>
                <div className="discovery-metric">
                  <div className="text-xs text-gray-500">Papers</div>
                  <div className="text-sm font-medium">{discovery.details?.papers || 1}</div>
                </div>
                {discovery.deploymentStatus && (
                  <div className="discovery-metric col-span-2">
                    <div className="text-xs text-gray-500">Deployment</div>
                    <div className="text-sm font-medium">
                      {discovery.deploymentStatus === 'deployed' ? '🚀 Live' :
                       discovery.deploymentStatus === 'failed' ? '❌ Failed' :
                       discovery.deploymentStatus === 'pending' ? '⏳ Pending' : 'Not Deployed'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="discovery-actions flex gap-2">
                <button 
                  className="btn btn-primary flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  onClick={() => setSelectedDiscovery(discovery)}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-secondary flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                  onClick={() => testDiscovery(discovery.id)}
                >
                  Test
                </button>
                <button 
                  className="btn btn-success flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  onClick={() => deployDiscovery(discovery.id)}
                >
                  Deploy
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="discovery-card empty-state bg-white rounded-lg shadow-lg p-6 col-span-full">
            <div className="discovery-header text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Discoveries Yet</h4>
              <span className="status px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                🔬 Research
              </span>
            </div>
            <p className="text-gray-600 text-center mb-4">
              Discoveries will appear here as the blockchain grows and mathematical breakthroughs are made.
            </p>
            <div className="discovery-metrics grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="discovery-metric text-center">
                <div className="text-xs text-gray-500">Status</div>
                <div className="text-sm font-medium">Waiting for discoveries</div>
              </div>
              <div className="discovery-metric text-center">
                <div className="text-xs text-gray-500">Progress</div>
                <div className="text-sm font-medium">0%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discovery Details Modal */}
      {selectedDiscovery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedDiscovery.name}</h3>
              <button 
                onClick={() => setSelectedDiscovery(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{selectedDiscovery.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Type:</span> {selectedDiscovery.type}</div>
                    <div><span className="font-medium">Impact:</span> {selectedDiscovery.impact}</div>
                    <div><span className="font-medium">Reward:</span> {formatNumber(selectedDiscovery.details?.reward || 0)} MINED</div>
                    <div><span className="font-medium">Papers:</span> {selectedDiscovery.details?.papers || 0}</div>
                    <div><span className="font-medium">Complexity:</span> {selectedDiscovery.details?.complexity}</div>
                    <div><span className="font-medium">Significance:</span> {selectedDiscovery.details?.significance}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Applications</h4>
                  <div className="space-y-1">
                    {selectedDiscovery.details?.applications?.map((app, index) => (
                      <div key={index} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {app}
                      </div>
                    )) || <div className="text-sm text-gray-500">No applications listed</div>}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => testDiscovery(selectedDiscovery.id)}
                >
                  Test Implementation
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => deployDiscovery(selectedDiscovery.id)}
                >
                  Deploy
                </button>
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={() => setSelectedDiscovery(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discoveries; 