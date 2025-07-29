import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  Memory,
  Security,
  Speed,
  Psychology,
  AutoGraph,
  Refresh,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalBlocks: 0,
    successfulBlocks: 0,
    failedBlocks: 0,
    algorithmEfficiency: 0,
    securityStrength: 0,
    consensusTime: 0,
    learningRate: 0,
    activeMiners: 0,
    activeValidators: 0,
    networkHashrate: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalBlocks: prev.totalBlocks + Math.floor(Math.random() * 3),
        successfulBlocks: prev.successfulBlocks + Math.floor(Math.random() * 2),
        failedBlocks: prev.failedBlocks + Math.floor(Math.random() * 1),
        algorithmEfficiency: 1000 + Math.floor(Math.random() * 200),
        securityStrength: 256 + Math.floor(Math.random() * 64),
        consensusTime: 100 + Math.floor(Math.random() * 50),
        learningRate: 500 + Math.floor(Math.random() * 300),
        activeMiners: 5 + Math.floor(Math.random() * 3),
        activeValidators: 3 + Math.floor(Math.random() * 2),
        networkHashrate: 1000 + Math.floor(Math.random() * 500),
      }));

      setChartData(prev => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          efficiency: 1000 + Math.floor(Math.random() * 200),
          security: 256 + Math.floor(Math.random() * 64),
          learning: 500 + Math.floor(Math.random() * 300),
        },
      ].slice(-20)); // Keep last 20 data points
    }, 3000);

    setLoading(false);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, icon, color, subtitle, progress }) => (
    <Card className="hover-card" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <IconButton size="small" sx={{ color }}>
            {icon}
          </IconButton>
        </Box>
        <Typography variant="h4" component="div" sx={{ color, mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {progress && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1, height: 6, borderRadius: 3 }}
          />
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading-spinner" />
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="gradient-text">
          Adaptive Learning Dashboard
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Blocks"
            value={metrics.totalBlocks}
            icon={<TrendingUp />}
            color="#4caf50"
            subtitle="Blocks created"
            progress={(metrics.successfulBlocks / Math.max(metrics.totalBlocks, 1)) * 100}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Algorithm Efficiency"
            value={metrics.algorithmEfficiency}
            icon={<Memory />}
            color="#2196f3"
            subtitle="Computational efficiency score"
            progress={(metrics.algorithmEfficiency / 1200) * 100}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Security Strength"
            value={metrics.securityStrength}
            icon={<Security />}
            color="#ff9800"
            subtitle="Cryptographic security level"
            progress={(metrics.securityStrength / 320) * 100}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Learning Rate"
            value={metrics.learningRate}
            icon={<Psychology />}
            color="#9c27b0"
            subtitle="Adaptive learning speed"
            progress={(metrics.learningRate / 800) * 100}
          />
        </Grid>

        {/* Network Status */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Network Status
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label={`${metrics.activeMiners} Active Miners`} color="primary" />
                <Chip label={`${metrics.activeValidators} Validators`} color="secondary" />
                <Chip label={`${metrics.networkHashrate} H/s`} color="success" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Consensus Time: {metrics.consensusTime}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Success Rate */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Success Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" color="success.main" sx={{ mr: 2 }}>
                  {Math.round((metrics.successfulBlocks / Math.max(metrics.totalBlocks, 1)) * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metrics.successfulBlocks} successful / {metrics.totalBlocks} total
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(metrics.successfulBlocks / Math.max(metrics.totalBlocks, 1)) * 100}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Chart */}
        <Grid item xs={12}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Adaptive Learning Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#2196f3"
                    strokeWidth={2}
                    name="Algorithm Efficiency"
                  />
                  <Line
                    type="monotone"
                    dataKey="security"
                    stroke="#ff9800"
                    strokeWidth={2}
                    name="Security Strength"
                  />
                  <Line
                    type="monotone"
                    dataKey="learning"
                    stroke="#9c27b0"
                    strokeWidth={2}
                    name="Learning Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Adaptive Learning Status */}
        <Grid item xs={12}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Adaptive Learning Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AutoGraph sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">Algorithm Learning</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Continuously optimizing computational efficiency
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Security sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6">Security Adaptation</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dynamically adjusting cryptographic parameters
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Speed sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">Consensus Optimization</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Optimizing PoW/PoS hybrid consensus
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 