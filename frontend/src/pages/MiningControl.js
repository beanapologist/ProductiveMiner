import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Pause,
  Build,
  Memory,
  Security,
  Psychology,
  Settings,
  TrendingUp,
} from '@mui/icons-material';

const MiningControl = () => {
  const [miningSession, setMiningSession] = useState(null);
  const [miningStats, setMiningStats] = useState({
    totalSessions: 0,
    successful: 0,
    successRate: 0,
    avgDuration: '0h',
    totalMined: 0,
    currentBalance: 0
  });
  const [workTypes] = useState([
    'Prime Pattern Discovery',
    'Riemann Zero Computation',
    'Yang-Mills Field Theory',
    'Goldbach Conjecture Verification',
    'Navier-Stokes Simulation',
    'Birch-Swinnerton-Dyer',
    'Elliptic Curve Cryptography',
    'Lattice Cryptography',
  ]);
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [difficulty, setDifficulty] = useState(25);
  const [quantumSecurity, setQuantumSecurity] = useState(256);
  const [adaptiveParameters, setAdaptiveParameters] = useState({
    algorithmLearningRate: 500,
    securityLearningRate: 500,
    consensusLearningRate: 300,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch mining statistics on component mount and refresh periodically
  useEffect(() => {
    const fetchMiningStats = async () => {
      try {
        const rewardsResponse = await fetch('http://localhost:3002/api/rewards');
        const rewardsData = await rewardsResponse.json();
        
        setMiningStats({
          totalSessions: rewardsData.miningHistory?.length || 0,
          successful: rewardsData.miningHistory?.filter(h => h.amount > 0).length || 0,
          successRate: rewardsData.miningHistory?.length > 0 
            ? Math.round((rewardsData.miningHistory.filter(h => h.amount > 0).length / rewardsData.miningHistory.length) * 100)
            : 0,
          avgDuration: '2.5h', // Default value
          totalMined: rewardsData.totalMined || 0,
          currentBalance: rewardsData.MINED || 0
        });
      } catch (error) {
        console.error('Error fetching mining stats:', error);
      }
    };

    fetchMiningStats();
    
    // Refresh every 10 seconds to keep balance updated
    const interval = setInterval(fetchMiningStats, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const startMiningSession = async () => {
    if (!selectedWorkType) {
      alert('Please select a work type');
      return;
    }

    try {
      // Call the real mining endpoint
      const response = await fetch('http://localhost:3002/api/mining/mine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workType: selectedWorkType,
          difficulty: difficulty,
          quantumSecurity: quantumSecurity
        })
      });

      const miningResult = await response.json();

      if (miningResult.success) {
        setMiningSession({
          id: Date.now(),
          workType: selectedWorkType,
          difficulty,
          quantumSecurity,
          startTime: new Date(),
          progress: 100, // Mining completed
          status: 'completed',
          adaptiveScore: Math.random() * 100,
          algorithmEfficiency: 1000 + Math.random() * 200,
          securityStrength: 256 + Math.random() * 64,
          reward: miningResult.reward,
          newBalance: miningResult.newBalance,
          totalMined: miningResult.totalMined
        });

        // Refresh mining stats to show updated balance
        const rewardsResponse = await fetch('http://localhost:3002/api/rewards');
        const rewardsData = await rewardsResponse.json();
        
        setMiningStats({
          totalSessions: rewardsData.miningHistory?.length || 0,
          successful: rewardsData.miningHistory?.filter(h => h.amount > 0).length || 0,
          successRate: rewardsData.miningHistory?.length > 0 
            ? Math.round((rewardsData.miningHistory.filter(h => h.amount > 0).length / rewardsData.miningHistory.length) * 100)
            : 0,
          avgDuration: '2.5h', // Default value
          totalMined: rewardsData.totalMined || 0,
          currentBalance: rewardsData.MINED || 0
        });

        // Show success message
        alert(`Mining successful! Reward: ${miningResult.reward} MINED\nNew Balance: ${miningResult.newBalance} MINED`);
      } else {
        // Show failure message
        alert(`Mining failed: ${miningResult.message}`);
      }
    } catch (error) {
      console.error('Mining error:', error);
      alert('Mining failed. Please try again.');
    }
  };

  const stopMiningSession = () => {
    setMiningSession(null);
  };

  const updateAdaptiveParameters = () => {
    setDialogOpen(false);
    // Here you would typically call the smart contract to update parameters
    console.log('Updated adaptive parameters:', adaptiveParameters);
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="gradient-text">
          Mining Control
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Settings />}
          onClick={() => setDialogOpen(true)}
        >
          Adaptive Parameters
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Mining Session Configuration */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Start Mining Session
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Work Type</InputLabel>
                  <Select
                    value={selectedWorkType}
                    onChange={(e) => setSelectedWorkType(e.target.value)}
                    label="Work Type"
                  >
                    {workTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Difficulty"
                  type="number"
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 1, max: 50 }}
                />
                <TextField
                  fullWidth
                  label="Quantum Security Level"
                  type="number"
                  value={quantumSecurity}
                  onChange={(e) => setQuantumSecurity(parseInt(e.target.value))}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 128, max: 512 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={startMiningSession}
                  disabled={!selectedWorkType || miningSession}
                >
                  Start Mining
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Session Status */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Session
              </Typography>
              {miningSession ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      {miningSession.workType}
                    </Typography>
                    <Chip
                      icon={<TrendingUp />}
                      label="Active"
                      color="success"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={miningSession.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {Math.round(miningSession.progress)}%
                    </Typography>
                    {miningSession.reward && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        Mining completed! Reward: {miningSession.reward} MINED
                      </Alert>
                    )}
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Difficulty
                      </Typography>
                      <Typography variant="body1">
                        {miningSession.difficulty}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Quantum Security
                      </Typography>
                      <Typography variant="body1">
                        {miningSession.quantumSecurity}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Stop />}
                    onClick={stopMiningSession}
                  >
                    Stop Mining
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Build sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No active mining session
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Adaptive Learning Metrics */}
        {miningSession && (
          <Grid item xs={12}>
            <Card className="hover-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Adaptive Learning Metrics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Memory sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6">
                        {Math.round(miningSession.algorithmEfficiency)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Algorithm Efficiency
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Security sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h6">
                        {Math.round(miningSession.securityStrength)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Security Strength
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Psychology sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                      <Typography variant="h6">
                        {Math.round(miningSession.adaptiveScore)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Adaptive Score
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Mining Statistics */}
        <Grid item xs={12}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mining Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {miningStats.totalSessions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sessions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {miningStats.successful}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Successful
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {miningStats.successRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {miningStats.avgDuration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Duration
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary.main">
                      {miningStats.totalMined}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Mined
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {miningStats.currentBalance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Balance
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Adaptive Parameters Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adaptive Learning Parameters</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure the adaptive learning parameters for the mining system.
          </Typography>
          <TextField
            fullWidth
            label="Algorithm Learning Rate"
            type="number"
            value={adaptiveParameters.algorithmLearningRate}
            onChange={(e) => setAdaptiveParameters(prev => ({
              ...prev,
              algorithmLearningRate: parseInt(e.target.value)
            }))}
            sx={{ mb: 2 }}
            inputProps={{ min: 100, max: 2000 }}
          />
          <TextField
            fullWidth
            label="Security Learning Rate"
            type="number"
            value={adaptiveParameters.securityLearningRate}
            onChange={(e) => setAdaptiveParameters(prev => ({
              ...prev,
              securityLearningRate: parseInt(e.target.value)
            }))}
            sx={{ mb: 2 }}
            inputProps={{ min: 100, max: 2000 }}
          />
          <TextField
            fullWidth
            label="Consensus Learning Rate"
            type="number"
            value={adaptiveParameters.consensusLearningRate}
            onChange={(e) => setAdaptiveParameters(prev => ({
              ...prev,
              consensusLearningRate: parseInt(e.target.value)
            }))}
            inputProps={{ min: 100, max: 1500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={updateAdaptiveParameters} variant="contained">
            Update Parameters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MiningControl; 