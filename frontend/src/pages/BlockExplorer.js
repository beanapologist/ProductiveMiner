import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Visibility,
  Memory,
  Security,
  Speed,
  Psychology,
  TrendingUp,
  Error,
} from '@mui/icons-material';

const BlockExplorer = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3002/api/blocks');
        if (response.ok) {
          const data = await response.json();
          // Transform the API data to match the expected format
          const transformedBlocks = (data.latestBlocks || data.blocks || []).map(block => ({
            blockNumber: block.height,
            timestamp: new Date(block.timestamp).toISOString(),
            miner: block.miner,
            workType: block.workType,
            difficulty: block.difficulty,
            algorithmEfficiency: 1000 + Math.floor(Math.random() * 200), // Simulated for now
            securityStrength: 256 + Math.floor(Math.random() * 64), // Simulated for now
            adaptiveScore: 800 + Math.floor(Math.random() * 200), // Simulated for now
            successful: true,
            gasUsed: block.size || 100000 + Math.floor(Math.random() * 50000),
            reward: block.reward,
            consensusTime: 100 + Math.floor(Math.random() * 200), // Simulated for now
            validatorParticipation: 3 + Math.floor(Math.random() * 2), // Simulated for now
            hash: block.hash,
            transactionCount: block.transactionCount,
          }));
          setBlocks(transformedBlocks);
        } else {
          console.error('Failed to fetch blocks:', response.status);
          // Fallback to simulated data if API fails
          const generateBlocks = () => {
            const blockData = [];
            for (let i = 1; i <= 10; i++) {
              blockData.push({
                blockNumber: i,
                timestamp: new Date(Date.now() - (10 - i) * 30000).toISOString(),
                miner: `validator-${Math.floor(Math.random() * 3) + 1}`,
                workType: ['Prime Number Patterns', 'Riemann Hypothesis', 'Yang-Mills Field Theory'][Math.floor(Math.random() * 3)],
                difficulty: 20 + Math.floor(Math.random() * 30),
                algorithmEfficiency: 1000 + Math.floor(Math.random() * 200),
                securityStrength: 256 + Math.floor(Math.random() * 64),
                adaptiveScore: 800 + Math.floor(Math.random() * 200),
                successful: Math.random() > 0.2,
                gasUsed: 100000 + Math.floor(Math.random() * 50000),
                reward: 100 + Math.floor(Math.random() * 50),
                consensusTime: 100 + Math.floor(Math.random() * 200),
                validatorParticipation: 3 + Math.floor(Math.random() * 2),
              });
            }
            return blockData;
          };
          setBlocks(generateBlocks());
        }
      } catch (error) {
        console.error('Error fetching blocks:', error);
        // Fallback to simulated data
        const generateBlocks = () => {
          const blockData = [];
          for (let i = 1; i <= 10; i++) {
            blockData.push({
              blockNumber: i,
              timestamp: new Date(Date.now() - (10 - i) * 30000).toISOString(),
              miner: `validator-${Math.floor(Math.random() * 3) + 1}`,
              workType: ['Prime Number Patterns', 'Riemann Hypothesis', 'Yang-Mills Field Theory'][Math.floor(Math.random() * 3)],
              difficulty: 20 + Math.floor(Math.random() * 30),
              algorithmEfficiency: 1000 + Math.floor(Math.random() * 200),
              securityStrength: 256 + Math.floor(Math.random() * 64),
              adaptiveScore: 800 + Math.floor(Math.random() * 200),
              successful: Math.random() > 0.2,
              gasUsed: 100000 + Math.floor(Math.random() * 50000),
              reward: 100 + Math.floor(Math.random() * 50),
              consensusTime: 100 + Math.floor(Math.random() * 200),
              validatorParticipation: 3 + Math.floor(Math.random() * 2),
            });
          }
          return blockData;
        };
        setBlocks(generateBlocks());
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
    setDialogOpen(true);
  };

  const filteredBlocks = blocks.filter(block =>
    block.blockNumber.toString().includes(searchTerm) ||
    block.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.miner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const BlockDetailDialog = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        Block #{selectedBlock?.blockNumber} Details
      </DialogTitle>
      <DialogContent>
        {selectedBlock && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Block Number</Typography>
                <Typography variant="body1">{selectedBlock.blockNumber}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Timestamp</Typography>
                <Typography variant="body1">{new Date(selectedBlock.timestamp).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Miner</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedBlock.miner}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Work Type</Typography>
                <Typography variant="body1">{selectedBlock.workType}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Adaptive Learning Metrics</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Algorithm Efficiency</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Memory sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">{selectedBlock.algorithmEfficiency}</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Security Strength</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="body1">{selectedBlock.securityStrength}</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Adaptive Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Psychology sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="body1">{selectedBlock.adaptiveScore}</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Consensus Time</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Speed sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body1">{selectedBlock.consensusTime}ms</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Difficulty</Typography>
                      <Typography variant="h6">{selectedBlock.difficulty}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Gas Used</Typography>
                      <Typography variant="h6">{selectedBlock.gasUsed.toLocaleString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Reward</Typography>
                      <Typography variant="h6">{selectedBlock.reward} ETH</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Status</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  icon={selectedBlock.successful ? <TrendingUp /> : <Error />}
                  label={selectedBlock.successful ? 'Successful' : 'Failed'}
                  color={selectedBlock.successful ? 'success' : 'error'}
                />
                <Chip
                  label={`${selectedBlock.validatorParticipation} Validators`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
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
          Block Explorer
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Blocks
              </Typography>
              <Typography variant="h4" color="primary.main">
                {blocks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Successful Blocks
              </Typography>
              <Typography variant="h4" color="success.main">
                {blocks.filter(b => b.successful).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Average Efficiency
              </Typography>
              <Typography variant="h4" color="info.main">
                {Math.round(blocks.reduce((sum, b) => sum + b.algorithmEfficiency, 0) / blocks.length)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Success Rate
              </Typography>
              <Typography variant="h4" color="warning.main">
                {Math.round((blocks.filter(b => b.successful).length / blocks.length) * 100)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Blocks Table */}
      <Card className="hover-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Blocks
          </Typography>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Block #</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Work Type</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Efficiency</TableCell>
                  <TableCell>Security</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBlocks.slice(0, 20).map((block) => (
                  <TableRow key={block.blockNumber} hover>
                    <TableCell>{block.blockNumber}</TableCell>
                    <TableCell>{new Date(block.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>{block.workType}</TableCell>
                    <TableCell>{block.difficulty}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Memory sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                        {block.algorithmEfficiency}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Security sx={{ mr: 1, fontSize: 16, color: 'warning.main' }} />
                        {block.securityStrength}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={block.successful ? <TrendingUp /> : <Error />}
                        label={block.successful ? 'Success' : 'Failed'}
                        color={block.successful ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleBlockClick(block)}
                        >
                          <Visibility />
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

      <BlockDetailDialog />
    </Box>
  );
};

export default BlockExplorer; 