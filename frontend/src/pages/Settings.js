import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  Slider,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save,
  RestartAlt,
  Security,
  Speed,
  Memory,
  Psychology,
  Warning,
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Adaptive Learning Parameters
    algorithmLearningRate: 500,
    securityLearningRate: 500,
    consensusLearningRate: 300,
    blockLearningWindow: 100,
    minimumBlockConfidence: 800,
    
    // Security Parameters
    quantumSecurityLevel: 256,
    maxDifficulty: 50,
    baseReward: 100,
    
    // Network Parameters
    blockTime: 30,
    requiredValidators: 3,
    consensusThreshold: 2,
    validationTimeout: 300,
    minimumStake: 1,
    validatorSelectionStake: 2,
    
    // System Settings
    enableAdaptiveLearning: true,
    enableQuantumSecurity: true,
    enableHybridConsensus: true,
    enableRealTimeMonitoring: true,
    enableAutoOptimization: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // Here you would typically call the smart contract to update settings
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetSettings = () => {
    setSettings({
      algorithmLearningRate: 500,
      securityLearningRate: 500,
      consensusLearningRate: 300,
      blockLearningWindow: 100,
      minimumBlockConfidence: 800,
      quantumSecurityLevel: 256,
      maxDifficulty: 50,
      baseReward: 100,
      blockTime: 30,
      requiredValidators: 3,
      consensusThreshold: 2,
      validationTimeout: 300,
      minimumStake: 1,
      validatorSelectionStake: 2,
      enableAdaptiveLearning: true,
      enableQuantumSecurity: true,
      enableHybridConsensus: true,
      enableRealTimeMonitoring: true,
      enableAutoOptimization: true,
    });
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="gradient-text">
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={resetSettings}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Adaptive Learning Settings */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">
                  Adaptive Learning Parameters
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Algorithm Learning Rate"
                type="number"
                value={settings.algorithmLearningRate}
                onChange={(e) => handleSettingChange('algorithmLearningRate', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 100, max: 2000 }}
                helperText="Controls how quickly the system adapts algorithm efficiency (100-2000)"
              />
              
              <TextField
                fullWidth
                label="Security Learning Rate"
                type="number"
                value={settings.securityLearningRate}
                onChange={(e) => handleSettingChange('securityLearningRate', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 100, max: 2000 }}
                helperText="Controls how quickly the system adapts security parameters (100-2000)"
              />
              
              <TextField
                fullWidth
                label="Consensus Learning Rate"
                type="number"
                value={settings.consensusLearningRate}
                onChange={(e) => handleSettingChange('consensusLearningRate', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 100, max: 1500 }}
                helperText="Controls how quickly the system optimizes consensus (100-1500)"
              />
              
              <TextField
                fullWidth
                label="Block Learning Window"
                type="number"
                value={settings.blockLearningWindow}
                onChange={(e) => handleSettingChange('blockLearningWindow', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 10, max: 1000 }}
                helperText="Number of blocks to consider for learning (10-1000)"
              />
              
              <TextField
                fullWidth
                label="Minimum Block Confidence"
                type="number"
                value={settings.minimumBlockConfidence}
                onChange={(e) => handleSettingChange('minimumBlockConfidence', parseInt(e.target.value))}
                inputProps={{ min: 500, max: 1000 }}
                helperText="Minimum confidence threshold for block acceptance (500-1000)"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">
                  Security Parameters
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Quantum Security Level"
                type="number"
                value={settings.quantumSecurityLevel}
                onChange={(e) => handleSettingChange('quantumSecurityLevel', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 128, max: 512 }}
                helperText="Quantum-resistant security level (128-512 bits)"
              />
              
              <TextField
                fullWidth
                label="Maximum Difficulty"
                type="number"
                value={settings.maxDifficulty}
                onChange={(e) => handleSettingChange('maxDifficulty', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 10, max: 100 }}
                helperText="Maximum mining difficulty allowed (10-100)"
              />
              
              <TextField
                fullWidth
                label="Base Reward"
                type="number"
                value={settings.baseReward}
                onChange={(e) => handleSettingChange('baseReward', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 10, max: 1000 }}
                helperText="Base reward for successful blocks (10-1000)"
              />
              
              <TextField
                fullWidth
                label="Block Time (seconds)"
                type="number"
                value={settings.blockTime}
                onChange={(e) => handleSettingChange('blockTime', parseInt(e.target.value))}
                inputProps={{ min: 10, max: 60 }}
                helperText="Target block time in seconds (10-60)"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Network Settings */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">
                  Network Parameters
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Required Validators"
                type="number"
                value={settings.requiredValidators}
                onChange={(e) => handleSettingChange('requiredValidators', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 1, max: 10 }}
                helperText="Minimum number of validators required (1-10)"
              />
              
              <TextField
                fullWidth
                label="Consensus Threshold"
                type="number"
                value={settings.consensusThreshold}
                onChange={(e) => handleSettingChange('consensusThreshold', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 1, max: 5 }}
                helperText="Minimum approvals needed for consensus (1-5)"
              />
              
              <TextField
                fullWidth
                label="Validation Timeout (seconds)"
                type="number"
                value={settings.validationTimeout}
                onChange={(e) => handleSettingChange('validationTimeout', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 60, max: 600 }}
                helperText="Timeout for validation tasks (60-600 seconds)"
              />
              
              <TextField
                fullWidth
                label="Minimum Stake (ETH)"
                type="number"
                value={settings.minimumStake}
                onChange={(e) => handleSettingChange('minimumStake', parseFloat(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0.1, max: 10, step: 0.1 }}
                helperText="Minimum stake required for participation (0.1-10 ETH)"
              />
              
              <TextField
                fullWidth
                label="Validator Selection Stake (ETH)"
                type="number"
                value={settings.validatorSelectionStake}
                onChange={(e) => handleSettingChange('validatorSelectionStake', parseFloat(e.target.value))}
                inputProps={{ min: 1, max: 20, step: 0.1 }}
                helperText="Minimum stake for validator selection (1-20 ETH)"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card className="hover-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  System Features
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableAdaptiveLearning}
                    onChange={(e) => handleSettingChange('enableAdaptiveLearning', e.target.checked)}
                  />
                }
                label="Enable Adaptive Learning"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableQuantumSecurity}
                    onChange={(e) => handleSettingChange('enableQuantumSecurity', e.target.checked)}
                  />
                }
                label="Enable Quantum Security"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableHybridConsensus}
                    onChange={(e) => handleSettingChange('enableHybridConsensus', e.target.checked)}
                  />
                }
                label="Enable Hybrid PoW/PoS Consensus"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableRealTimeMonitoring}
                    onChange={(e) => handleSettingChange('enableRealTimeMonitoring', e.target.checked)}
                  />
                }
                label="Enable Real-time Monitoring"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableAutoOptimization}
                    onChange={(e) => handleSettingChange('enableAutoOptimization', e.target.checked)}
                  />
                }
                label="Enable Auto-optimization"
                sx={{ mb: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current System Performance
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Memory sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" color="primary.main">
                      {settings.algorithmLearningRate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Algorithm Learning Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Security sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" color="warning.main">
                      {settings.quantumSecurityLevel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Security Level (bits)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Speed sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      {settings.blockTime}s
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Block Time
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Psychology sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6" color="secondary.main">
                      {settings.consensusLearningRate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consensus Learning Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={settings.enableAdaptiveLearning ? <Memory /> : <Warning />}
                      label="Adaptive Learning"
                      color={settings.enableAdaptiveLearning ? 'success' : 'error'}
                      variant="outlined"
                    />
                    <Chip
                      icon={settings.enableQuantumSecurity ? <Security /> : <Warning />}
                      label="Quantum Security"
                      color={settings.enableQuantumSecurity ? 'success' : 'error'}
                      variant="outlined"
                    />
                    <Chip
                      icon={settings.enableHybridConsensus ? <Speed /> : <Warning />}
                      label="Hybrid Consensus"
                      color={settings.enableHybridConsensus ? 'success' : 'error'}
                      variant="outlined"
                    />
                    <Chip
                      icon={settings.enableRealTimeMonitoring ? <SettingsIcon /> : <Warning />}
                      label="Real-time Monitoring"
                      color={settings.enableRealTimeMonitoring ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      All settings will be applied to the smart contract when saved. 
                      Some changes may require a system restart to take full effect.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 