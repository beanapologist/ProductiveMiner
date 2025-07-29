import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  VerifiedUser,
  Add,
  Remove,
  TrendingUp,
  Warning,
  CheckCircle,
  Cancel,
  Person,
  Security,
  Psychology,
} from '@mui/icons-material';

const ValidatorPanel = () => {
  const [validators, setValidators] = useState([]);
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate validator data
    const generateValidators = () => {
      const validatorData = [];
      for (let i = 1; i <= 10; i++) {
        validatorData.push({
          id: i,
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          stake: 2 + Math.random() * 8,
          reputation: 50 + Math.random() * 50,
          totalValidations: 100 + Math.floor(Math.random() * 900),
          successfulValidations: 80 + Math.floor(Math.random() * 200),
          failedValidations: Math.floor(Math.random() * 20),
          isActive: Math.random() > 0.2,
          lastValidationTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          adaptiveScore: 800 + Math.random() * 200,
          algorithmLearningScore: 500 + Math.random() * 500,
          securityLearningScore: 500 + Math.random() * 500,
          consensusLearningScore: 300 + Math.random() * 300,
        });
      }
      return validatorData;
    };

    setValidators(generateValidators());
    setLoading(false);
  }, []);

  const registerValidator = () => {
    if (!stakeAmount || parseFloat(stakeAmount) < 2) {
      alert('Minimum stake required: 2 ETH');
      return;
    }

    const newValidator = {
      id: validators.length + 1,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      stake: parseFloat(stakeAmount),
      reputation: 50,
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      isActive: true,
      lastValidationTime: new Date().toISOString(),
      adaptiveScore: 800,
      algorithmLearningScore: 500,
      securityLearningScore: 500,
      consensusLearningScore: 300,
    };

    setValidators([...validators, newValidator]);
    setStakeAmount('');
  };

  const getSuccessRate = (validator) => {
    if (validator.totalValidations === 0) return 0;
    return (validator.successfulValidations / validator.totalValidations) * 100;
  };

  const getStatusColor = (validator) => {
    if (!validator.isActive) return 'error';
    const successRate = getSuccessRate(validator);
    if (successRate >= 90) return 'success';
    if (successRate >= 70) return 'warning';
    return 'error';
  };

  const getStatusIcon = (validator) => {
    if (!validator.isActive) return <Cancel />;
    const successRate = getSuccessRate(validator);
    if (successRate >= 90) return <CheckCircle />;
    if (successRate >= 70) return <Warning />;
    return <Cancel />;
  };

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
          Validator Panel
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            label="Stake Amount (ETH)"
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            inputProps={{ min: 2, step: 0.1 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={registerValidator}
            disabled={!stakeAmount || parseFloat(stakeAmount) < 2}
          >
            Register Validator
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Validators
              </Typography>
              <Typography variant="h4" color="primary.main">
                {validators.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Active Validators
              </Typography>
              <Typography variant="h4" color="success.main">
                {validators.filter(v => v.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Staked
              </Typography>
              <Typography variant="h4" color="warning.main">
                {validators.reduce((sum, v) => sum + v.stake, 0).toFixed(1)} ETH
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Avg Reputation
              </Typography>
              <Typography variant="h4" color="info.main">
                {Math.round(validators.reduce((sum, v) => sum + v.reputation, 0) / validators.length)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Validators Table */}
      <Card className="hover-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Validator Network
          </Typography>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Validator</TableCell>
                  <TableCell>Stake</TableCell>
                  <TableCell>Reputation</TableCell>
                  <TableCell>Success Rate</TableCell>
                  <TableCell>Adaptive Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {validators.map((validator) => (
                  <TableRow key={validator.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {validator.address.slice(0, 10)}...{validator.address.slice(-8)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {validator.stake.toFixed(1)} ETH
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={validator.reputation}
                          sx={{ width: 60, mr: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2">
                          {Math.round(validator.reputation)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {getSuccessRate(validator).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Psychology sx={{ mr: 1, fontSize: 16, color: 'secondary.main' }} />
                        {Math.round(validator.adaptiveScore)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(validator)}
                        label={validator.isActive ? 'Active' : 'Inactive'}
                        color={getStatusColor(validator)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <VerifiedUser />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Consensus Metrics */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consensus Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">
                      {validators.filter(v => v.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Validators
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">
                      {Math.round(validators.reduce((sum, v) => sum + getSuccessRate(v), 0) / validators.length)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Success Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      {Math.round(validators.reduce((sum, v) => sum + v.algorithmLearningScore, 0) / validators.length)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Algorithm Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main">
                      {Math.round(validators.reduce((sum, v) => sum + v.securityLearningScore, 0) / validators.length)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Security Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="secondary.main">
                      {Math.round(validators.reduce((sum, v) => sum + v.consensusLearningScore, 0) / validators.length)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consensus Score
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

export default ValidatorPanel; 