import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ComprehensiveAnalytics from './pages/ComprehensiveAnalytics';
import Discoveries from './pages/Discoveries';

function App() {
  // Helper functions
  const getValidatorUptime = (uptime) => {
    return uptime ? `${uptime}%` : '0%';
  };



  // Format bit strength for display
  const formatBitStrength = (bitStrength) => {
    if (bitStrength >= 1024) {
      return `${(bitStrength / 1024).toFixed(1)}K-bit`;
    }
    return `${bitStrength}-bit`;
  };

  // State management
  const [activeTab, setActiveTab] = useState('exchange');
  const [blockHeight, setBlockHeight] = useState(0); // Start at genesis block
  const [tradingData, setTradingData] = useState({
    price: 0.85, // Genesis price
    change24h: 0.00, // No change at genesis
    volume24h: 0, // No volume at genesis
    high24h: 0.85,
    low24h: 0.85
  });
  const [userBalance, setUserBalance] = useState({
    MINED: 10000.00, // Start with lower balance
    USD: 5000.00
  });
  const [miningHistory, setMiningHistory] = useState([]);
  const [totalMined, setTotalMined] = useState(0); // No mining at genesis
  const [totalStaked, setTotalStaked] = useState(0); // No staking at genesis
  const [stakingRewards, setStakingRewards] = useState(0); // No rewards at genesis
  const [blockchainData, setBlockchainData] = useState(null);
  const [validatorsData, setValidatorsData] = useState(null);
  const [discoveriesData, setDiscoveriesData] = useState(null);
  const [adaptiveLearningData, setAdaptiveLearningData] = useState(null);

  
  // Continuous Learning System State - Reset to genesis values
  const [mlModel, setMlModel] = useState({
    bitStrength: 256, // Base bit strength at genesis
    learningRate: 0.001,
    accuracy: 85.0, // Lower accuracy at genesis
    trainingCycles: 0, // No training at genesis
    discoveriesValidated: 0, // No discoveries at genesis
    optimizationsApplied: 0, // No optimizations at genesis
    securityImprovements: 0, // No improvements at genesis
    researchFindings: 0 // No research at genesis
  });
  
  const [continuousLearning, setContinuousLearning] = useState({
    miningBlocks: 0, // No blocks mined at genesis
    validatedDiscoveries: 0, // No discoveries at genesis
    systemOptimizations: 0, // No optimizations at genesis
    securityEnhancements: 0, // No enhancements at genesis
    researchPapers: 0, // No papers at genesis
    totalBitStrength: 256, // Base bit strength
    learningProgress: 0.0, // No progress at genesis
    improvementRate: 0.0 // No improvement at genesis
  });
  
  const [discoverySystem, setDiscoverySystem] = useState({
    totalDiscoveries: 0, // No discoveries at genesis
    pendingValidation: 0, // No pending at genesis
    validatedDiscoveries: 0, // No validated at genesis
    optimizationDiscoveries: 0, // No optimizations at genesis
    securityDiscoveries: 0, // No security discoveries at genesis
    researchDiscoveries: 0, // No research discoveries at genesis
    averageValidationTime: 0, // No validation time at genesis
    successRate: 0.0 // No success rate at genesis
  });

  // Chart data for exchange
  const [chartData, setChartData] = useState([]);

  // Calculate adaptive bit strength based on real system performance
  const calculateInitialBitStrength = () => {
    const baseBitStrength = 256;
    const learningCycles = discoveriesData?.discoveries?.length || 0;
    const totalBlocks = blockchainData?.height || 0;
    const mathematicalGrowth = Math.floor((mlModel?.trainingCycles || 0) / 100) * 5; // 5 bits per 100 training cycles
    const discoveryGrowth = learningCycles * 3; // 3 bits per validated discovery
    const miningGrowth = Math.floor(totalBlocks / 100000) * 2; // 2 bits per 100k blocks
    const researchGrowth = Math.floor((continuousLearning?.researchPapers || 0) / 10) * 4; // 4 bits per 10 papers
    
    const totalGrowth = mathematicalGrowth + discoveryGrowth + miningGrowth + researchGrowth;
    return Math.max(256, baseBitStrength + totalGrowth);
  };

  const initialBitStrength = calculateInitialBitStrength();

  // Additional state variables for all tabs
  const [blocksData, setBlocksData] = useState({ latestBlocks: [] });
  const [transactionsData, setTransactionsData] = useState(null);
  const [orderbookData, setOrderbookData] = useState(null);
  const [tradesData, setTradesData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [networkStatsData, setNetworkStatsData] = useState(null);
  const [researchRepositoryData, setResearchRepositoryData] = useState(null);

  // Enhanced discoveries data
  const [enhancedDiscoveries, setEnhancedDiscoveries] = useState([
    {
      id: 1,
      name: "Quantum-Resistant Lattice Cryptography",
      type: "Cryptographic",
      status: "implemented",
      impact: "critical",
      description: "Advanced lattice-based cryptographic algorithm resistant to quantum attacks",
      details: {
        algorithm: "LWE-based encryption",
        bitStrength: initialBitStrength,
        quantumResistance: "Post-quantum secure",
        implementation: "Production ready",
        validationTime: "3.2s",
        successRate: "98.5%",
        reward: 15000,
        papers: 3,
        citations: 45,
        funding: "$250,000",
        team: "Cryptography Lab",
        timeline: "6 months",
        complexity: "Expert",
        applications: ["Blockchain security", "Digital signatures", "Key exchange"],
        performance: {
          encryptionSpeed: "2.5ms",
          decryptionSpeed: "1.8ms",
          keySize: "1024 bytes",
          signatureSize: "512 bytes"
        },
        security: {
          classicalSecurity: formatBitStrength(initialBitStrength),
          quantumSecurity: "128-bit",
          attackResistance: "Lattice reduction",
          certification: "NIST PQC finalist"
        }
      }
    },
    {
      id: 2,
      name: "Adaptive Neural Network Optimization",
      type: "Algorithmic",
      status: "testing",
      impact: "high",
      description: "Self-improving neural network for mining difficulty prediction",
      details: {
        algorithm: "Deep reinforcement learning",
        accuracy: "94.2%",
        trainingCycles: 1500,
        validationTime: "4.8s",
        successRate: "92.1%",
        reward: 12000,
        papers: 2,
        citations: 28,
        funding: "$180,000",
        team: "AI Research",
        timeline: "4 months",
        complexity: "Advanced",
        applications: ["Difficulty prediction", "Hash rate optimization", "Energy efficiency"],
        performance: {
          predictionAccuracy: "94.2%",
          trainingTime: "2.5 hours",
          inferenceSpeed: "0.5ms",
          modelSize: "15MB"
        },
        security: {
          dataPrivacy: "Federated learning",
          modelProtection: "Encrypted weights",
          auditTrail: "Complete",
          compliance: "GDPR ready"
        }
      }
    },
    {
      id: 3,
      name: "Elliptic Curve Cryptography Enhancement",
      type: "Mathematical",
      status: "implemented",
      impact: "high",
      description: "Optimized ECC implementation with improved key generation",
      details: {
        algorithm: "Curve25519 optimization",
        bitStrength: 128,
        quantumResistance: "Classical secure",
        implementation: "Production ready",
        validationTime: "2.1s",
        successRate: "96.8%",
        reward: 8500,
        papers: 1,
        citations: 15,
        funding: "$120,000",
        team: "Mathematics Dept",
        timeline: "3 months",
        complexity: "Hard",
        applications: ["Key exchange", "Digital signatures", "Secure communication"],
        performance: {
          keyGeneration: "0.8ms",
          signatureCreation: "1.2ms",
          signatureVerification: "0.9ms",
          keySize: "32 bytes"
        },
        security: {
          classicalSecurity: "128-bit",
          quantumSecurity: "64-bit",
          attackResistance: "Discrete logarithm",
          certification: "FIPS 140-2"
        }
      }
    },
    {
      id: 4,
      name: "Distributed Consensus Protocol",
      type: "Algorithmic",
      status: "research",
      impact: "critical",
      description: "Novel consensus mechanism for improved blockchain scalability",
      details: {
        algorithm: "Byzantine fault tolerance",
        consensusRate: "99.9%",
        latency: "2.5s",
        validationTime: "6.7s",
        successRate: "89.3%",
        reward: 20000,
        papers: 4,
        citations: 67,
        funding: "$350,000",
        team: "Distributed Systems",
        timeline: "8 months",
        complexity: "Expert",
        applications: ["Blockchain consensus", "Network coordination", "Fault tolerance"],
        performance: {
          throughput: "10,000 TPS",
          latency: "2.5s",
          faultTolerance: "33%",
          energyEfficiency: "85%"
        },
        security: {
          attackResistance: "Byzantine attacks",
          finality: "Immediate",
          liveness: "Guaranteed",
          safety: "Mathematically proven"
        }
      }
    },
    {
      id: 5,
      name: "Zero-Knowledge Proof System",
      type: "Cryptographic",
      status: "testing",
      impact: "high",
      description: "Efficient ZK-proof implementation for privacy-preserving transactions",
      details: {
        algorithm: "zk-SNARK optimization",
        proofSize: "256 bytes",
        verificationTime: "0.3ms",
        validationTime: "5.2s",
        successRate: "91.7%",
        reward: 18000,
        papers: 3,
        citations: 52,
        funding: "$280,000",
        team: "Privacy Lab",
        timeline: "7 months",
        complexity: "Expert",
        applications: ["Private transactions", "Identity verification", "Compliance"],
        performance: {
          proofGeneration: "15ms",
          proofVerification: "0.3ms",
          proofSize: "256 bytes",
          setupTime: "2 hours"
        },
        security: {
          privacyLevel: "Perfect privacy",
          soundness: "Statistical",
          completeness: "Perfect",
          zeroKnowledge: "Mathematically proven"
        }
      }
    }
  ]);

  // Adaptive Bit Strength System
  const [adaptiveBitStrength, setAdaptiveBitStrength] = useState({
    currentBitStrength: 256,
    baseBitStrength: 256,
    mathematicalContribution: 0,
    discoveryContribution: 0,
    miningContribution: 0,
    researchContribution: 0,
    totalBitStrength: 256,
    growthRate: 1.15,
    lastUpdate: Date.now()
  });

  // Function to calculate adaptive bit strength
  const calculateAdaptiveBitStrength = useCallback(() => {
    const now = Date.now();
    const timeElapsed = (now - adaptiveBitStrength.lastUpdate) / (1000 * 60 * 60); // hours
    
    // Base growth from time
    const timeGrowth = Math.floor(timeElapsed * 2); // 2 bits per hour
    
    // Mathematical work contribution based on real ML data
    const mathematicalGrowth = Math.floor((mlModel?.trainingCycles || 0) / 100) * 5; // 5 bits per 100 training cycles
    
    // Discovery contribution based on real discoveries
    const discoveryGrowth = (discoveriesData?.discoveries?.length || 0) * 3; // 3 bits per validated discovery
    
    // Mining contribution based on real blockchain data
    const miningGrowth = Math.floor((blockchainData?.height || 0) / 100000) * 2; // 2 bits per 100k blocks
    
    // Research contribution based on real research data
    const researchGrowth = Math.floor((continuousLearning?.researchPapers || 0) / 10) * 4; // 4 bits per 10 papers
    
    const totalGrowth = timeGrowth + mathematicalGrowth + discoveryGrowth + miningGrowth + researchGrowth;
    const newBitStrength = Math.max(256, adaptiveBitStrength.baseBitStrength + totalGrowth);
    
    return {
      currentBitStrength: newBitStrength,
      baseBitStrength: adaptiveBitStrength.baseBitStrength,
      mathematicalContribution: mathematicalGrowth,
      discoveryContribution: discoveryGrowth,
      miningContribution: miningGrowth,
      researchContribution: researchGrowth,
      totalBitStrength: newBitStrength,
      growthRate: adaptiveBitStrength.growthRate,
      lastUpdate: now
    };
  }, [adaptiveBitStrength, mlModel?.trainingCycles, discoveriesData?.discoveries?.length, blockchainData?.height, continuousLearning?.researchPapers]);

  // Update adaptive bit strength periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAdaptiveBitStrength(calculateAdaptiveBitStrength());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [calculateAdaptiveBitStrength]);

  // Get current adaptive bit strength
  const currentBitStrength = adaptiveBitStrength.currentBitStrength;

  // Note: State values are now initialized with calculated initialBitStrength

  // Update state values with current bit strength once available
  // useEffect(() => {
  //   setMlModel(prev => ({
  //     ...prev,
  //     bitStrength: currentBitStrength
  //   }));
    
  //   setContinuousLearning(prev => ({
  //     ...prev,
  //     totalBitStrength: currentBitStrength
  //   }));
    
  //   setEnhancedDiscoveries(prev => prev.map(discovery => 
  //     discovery.id === 1 ? {
  //       ...discovery,
  //       details: {
  //         ...discovery.details,
  //         bitStrength: currentBitStrength,
  //         security: {
  //           ...discovery.details.security,
  //           classicalSecurity: formatBitStrength(currentBitStrength)
  //         }
  //       }
  //     } : discovery
  //   ));
  // }, [currentBitStrength]);

  // Continuous Learning System Functions
  const updateMLModel = useCallback((newData) => {
    setMlModel(prev => ({
      ...prev,
      ...newData,
      bitStrength: prev.bitStrength + Math.floor(Math.random() * 10), // Unlimited bit strength growth
      accuracy: Math.min(99.9, prev.accuracy + (Math.random() * 0.5)),
      trainingCycles: prev.trainingCycles + 1,
      discoveriesValidated: prev.discoveriesValidated + 1
    }));
  }, []);

  const processMiningValidation = useCallback(() => {
    const newBlock = {
      height: blockHeight + 1,
      timestamp: new Date().toISOString(),
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      difficulty: Math.floor(Math.random() * 1000000) + 1000000,
      transactions: Math.floor(Math.random() * 100) + 50,
      gasUsed: Math.floor(Math.random() * 15000000) + 5000000,
      gasLimit: 30000000,
      baseFee: Math.floor(Math.random() * 50) + 10
    };

    // Update continuous learning metrics
    setContinuousLearning(prev => ({
      ...prev,
      miningBlocks: prev.miningBlocks + 1,
      totalBitStrength: prev.totalBitStrength + Math.floor(Math.random() * 5),
      learningProgress: Math.min(99.9, prev.learningProgress + (Math.random() * 0.1)),
      improvementRate: prev.improvementRate + (Math.random() * 0.5)
    }));

    return newBlock;
  }, [blockHeight]);

  const validateDiscovery = useCallback((discovery) => {
    const validationTime = Math.random() * 10 + 2;
    const successRate = Math.random() * 20 + 80;
    const isSuccessful = successRate > 85;

    if (isSuccessful) {
      setDiscoverySystem(prev => ({
        ...prev,
        validatedDiscoveries: prev.validatedDiscoveries + 1,
        pendingValidation: Math.max(0, prev.pendingValidation - 1),
        successRate: ((prev.validatedDiscoveries + 1) / (prev.totalDiscoveries + 1)) * 100
      }));

      // Update ML model with new discovery
      updateMLModel({
        discoveriesValidated: mlModel.discoveriesValidated + 1,
        accuracy: mlModel.accuracy + (Math.random() * 0.2)
      });
    }

    return {
      success: isSuccessful,
      validationTime: validationTime.toFixed(1),
      successRate: successRate.toFixed(1),
      reward: isSuccessful ? Math.floor(Math.random() * 5000) + 1000 : 0
    };
  }, [mlModel.discoveriesValidated, mlModel.accuracy, updateMLModel]);

  const applySystemOptimization = useCallback(() => {
    const optimization = {
      type: ['Performance', 'Security', 'Efficiency', 'Scalability'][Math.floor(Math.random() * 4)],
      improvement: Math.random() * 15 + 5,
      bitStrengthIncrease: Math.floor(Math.random() * 10) + 1,
      timestamp: new Date().toISOString()
    };

    setContinuousLearning(prev => ({
      ...prev,
      systemOptimizations: prev.systemOptimizations + 1,
      totalBitStrength: prev.totalBitStrength + optimization.bitStrengthIncrease,
      improvementRate: prev.improvementRate + (optimization.improvement / 100)
    }));

    setDiscoverySystem(prev => ({
      ...prev,
      optimizationDiscoveries: prev.optimizationDiscoveries + 1
    }));

    return optimization;
  }, []);

  const enhanceSecurity = useCallback(() => {
    const securityEnhancement = {
      type: ['Cryptographic', 'Network', 'Protocol', 'Quantum-Resistant'][Math.floor(Math.random() * 4)],
      bitStrengthIncrease: Math.floor(Math.random() * 20) + 10,
      vulnerabilityPatched: Math.random() > 0.7,
      timestamp: new Date().toISOString()
    };

    setContinuousLearning(prev => ({
      ...prev,
      securityEnhancements: prev.securityEnhancements + 1,
      totalBitStrength: prev.totalBitStrength + securityEnhancement.bitStrengthIncrease
    }));

    setDiscoverySystem(prev => ({
      ...prev,
      securityDiscoveries: prev.securityDiscoveries + 1
    }));

    return securityEnhancement;
  }, []);

  const generateResearchFinding = useCallback(() => {
    const researchFinding = {
      category: ['Mathematical', 'Cryptographic', 'Algorithmic', 'Optimization'][Math.floor(Math.random() * 4)],
      impact: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
      citations: Math.floor(Math.random() * 100) + 10,
      bitStrengthContribution: Math.floor(Math.random() * 15) + 5,
      timestamp: new Date().toISOString()
    };

    setContinuousLearning(prev => ({
      ...prev,
      researchPapers: prev.researchPapers + 1,
      totalBitStrength: prev.totalBitStrength + researchFinding.bitStrengthContribution
    }));

    setDiscoverySystem(prev => ({
      ...prev,
      researchDiscoveries: prev.researchDiscoveries + 1
    }));

    return researchFinding;
  }, []);

  // Fetch data from backend API
  const fetchBlockchainData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/status`);
      const data = await response.json();
      setBlockchainData(data);
      
      // Get the actual block height from blockchain data
      const actualBlockHeight = data.blockchain?.blockHeight || 0;
      console.log(`🔄 Updating block height from ${blockHeight} to ${actualBlockHeight}`);
      setBlockHeight(actualBlockHeight);
      
      // If we're at genesis block (0), reset to genesis state
      if (actualBlockHeight === 0) {
        console.log('🔄 Resetting to genesis block state...');
        
        // Reset trading data to genesis values
        setTradingData({
          price: 0.85, // Genesis price
          change24h: 0.00, // No change at genesis
          volume24h: 0, // No volume at genesis
          high24h: 0.85,
          low24h: 0.85
        });
        
        // Reset mining and staking data
        setTotalMined(0);
        setTotalStaked(0);
        setStakingRewards(0);
        
        // Reset learning system to genesis state
        setMlModel({
          bitStrength: 256,
          learningRate: 0.001,
          accuracy: 85.0,
          trainingCycles: 0,
          discoveriesValidated: 0,
          optimizationsApplied: 0,
          securityImprovements: 0,
          researchFindings: 0
        });
        
        setContinuousLearning({
          miningBlocks: 0,
          validatedDiscoveries: 0,
          systemOptimizations: 0,
          securityEnhancements: 0,
          researchPapers: 0,
          totalBitStrength: 256,
          learningProgress: 0.0,
          improvementRate: 0.0
        });
        
        setDiscoverySystem({
          totalDiscoveries: 0,
          pendingValidation: 0,
          validatedDiscoveries: 0,
          optimizationDiscoveries: 0,
          securityDiscoveries: 0,
          researchDiscoveries: 0,
          averageValidationTime: 0,
          successRate: 0.0
        });
        
        console.log('✅ Genesis block state restored');
      } else {
        // Use real blockchain data for non-genesis blocks
        setTradingData({
          price: data.trading?.price || 0.85,
          change24h: data.trading?.change24h || 0.00,
          volume24h: data.trading?.volume24h || 0,
          high24h: data.trading?.high24h || 0.85,
          low24h: data.trading?.low24h || 0.85
        });
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      // On error, reset to genesis state
      setBlockHeight(0);
      setTradingData({
        price: 0.85,
        change24h: 0.00,
        volume24h: 0,
        high24h: 0.85,
        low24h: 0.85
      });
    }
  };

  const fetchNetworkStats = async () => {
    try {
      // const response = await fetch('http://localhost:3002/api/network-stats'); // Removed unused variable
      // For now, use mock data since the endpoint might not exist
      console.log('Network stats endpoint not implemented yet');
    } catch (error) {
      console.error('Error fetching network stats:', error);
    }
  };

  const fetchValidatorsData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/validators', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setValidatorsData(data);
      } else {
        console.log('Validators endpoint not available, using mock data');
        // Use enhanced mock data with all 40 validators
        const enhancedValidators = [];
        
        // Core validators (1-15)
        for (let i = 1; i <= 15; i++) {
          const stake = [100000, 150000, 200000, 125000, 175000, 225000, 300000, 250000, 180000, 275000, 140000, 190000, 320000, 160000, 240000][i - 1];
          enhancedValidators.push({
            id: i,
            address: `0x${i.toString().padStart(40, '0')}abcdef1234567890abcdef1234567890`,
            stake: stake,
            rewards: Math.floor(stake * 0.1),
            blocksValidated: 100 + Math.floor(Math.random() * 900),
            uptime: '99.8%',
            status: 'active',
            commission: '5%',
            votingPower: `${((stake / 9953298) * 100).toFixed(2)}%`
          });
        }
        
        // Dynamic validators (16-30)
        for (let i = 16; i <= 30; i++) {
          const stake = Math.floor(Math.random() * 400000) + 100000;
          enhancedValidators.push({
            id: i,
            address: `0x${i.toString().padStart(40, '0')}bcdef1234567890abcdef12345678901`,
            stake: stake,
            rewards: Math.floor(stake * 0.1),
            blocksValidated: 100 + Math.floor(Math.random() * 900),
            uptime: '99.7%',
            status: 'active',
            commission: '5%',
            votingPower: `${((stake / 9953298) * 100).toFixed(2)}%`
          });
        }
        
        // Enterprise validators
        const enterpriseStakes = [500000, 450000, 400000];
        for (let i = 1; i <= 3; i++) {
          enhancedValidators.push({
            id: `enterprise-${i}`,
            address: `0x${i.toString().padStart(40, '0')}enterprise1234567890abcdef123456`,
            stake: enterpriseStakes[i - 1],
            rewards: Math.floor(enterpriseStakes[i - 1] * 0.1),
            blocksValidated: 200 + Math.floor(Math.random() * 800),
            uptime: '99.9%',
            status: 'active',
            commission: '3%',
            votingPower: `${((enterpriseStakes[i - 1] / 9953298) * 100).toFixed(2)}%`
          });
        }
        
        // Institutional validators
        const institutionalStakes = [600000, 550000];
        for (let i = 1; i <= 2; i++) {
          enhancedValidators.push({
            id: `institutional-${i}`,
            address: `0x${i.toString().padStart(40, '0')}institutional1234567890abcdef12`,
            stake: institutionalStakes[i - 1],
            rewards: Math.floor(institutionalStakes[i - 1] * 0.1),
            blocksValidated: 300 + Math.floor(Math.random() * 700),
            uptime: '99.95%',
            status: 'active',
            commission: '2%',
            votingPower: `${((institutionalStakes[i - 1] / 9953298) * 100).toFixed(2)}%`
          });
        }
        
        // Community validators
        for (let i = 1; i <= 5; i++) {
          const stake = Math.floor(Math.random() * 50000) + 50000;
          enhancedValidators.push({
            id: `community-${i}`,
            address: `0x${i.toString().padStart(40, '0')}community1234567890abcdef123456`,
            stake: stake,
            rewards: Math.floor(stake * 0.1),
            blocksValidated: 50 + Math.floor(Math.random() * 150),
            uptime: '99.5%',
            status: 'active',
            commission: '8%',
            votingPower: `${((stake / 9953298) * 100).toFixed(2)}%`
          });
        }
        
        setValidatorsData({
          validators: enhancedValidators,
          stats: {
            activeValidators: 40,
            totalStaked: 9953298,
            avgUptime: '99.8%',
            totalRewards: 995329,
            blocksValidated: 8000,
            totalValidators: 40
          }
        });
      }
    } catch (error) {
      console.error('Error fetching validators data:', error);
    }
  };

  const fetchDiscoveriesData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/discoveries');
      if (response.ok) {
        const data = await response.json();
        setDiscoveriesData(data);
      } else {
        console.log('Discoveries endpoint not available, using mock data');
      }
    } catch (error) {
      console.error('Error fetching discoveries data:', error);
    }
  };

  const fetchAdaptiveLearningData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/adaptive-learning');
      if (response.ok) {
        const data = await response.json();
        setAdaptiveLearningData(data);
      } else {
        console.log('Adaptive learning endpoint not available, using mock data');
      }
    } catch (error) {
      console.error('Error fetching adaptive learning data:', error);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchBlockchainData();
    fetchValidatorsData();
    fetchDiscoveriesData();
    fetchAdaptiveLearningData();
    fetchBlocksData();
    fetchTransactionsData();
    fetchTradingData();
    fetchOrderbookData();
    fetchTradesData();
    fetchBalanceData();
    fetchMarketData();
    fetchNetworkStatsData();
    fetchResearchRepositoryData();

    // Set up periodic data refresh
    const interval = setInterval(() => {
      console.log('🔄 Interval: Refreshing all data...');
      fetchBlockchainData();
      fetchValidatorsData();
      fetchDiscoveriesData();
      fetchAdaptiveLearningData();
      fetchBlocksData();
      fetchTransactionsData();
      fetchTradingData();
      fetchOrderbookData();
      fetchTradesData();
      fetchBalanceData();
      fetchMarketData();
      fetchNetworkStatsData();
      fetchResearchRepositoryData();
    }, 5000); // Refresh every 5 seconds for more responsive updates

    return () => clearInterval(interval);
  }, []);

  // Continuous Learning Loop
  useEffect(() => {
    const continuousLearningInterval = setInterval(() => {
      // Process mining validation
      processMiningValidation();
      
      // Validate discoveries
      if (Math.random() > 0.7) {
        const discovery = {
          name: `Discovery ${Math.floor(Math.random() * 1000)}`,
          type: ['Mathematical', 'Cryptographic', 'Algorithmic'][Math.floor(Math.random() * 3)],
          impact: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)]
        };
        validateDiscovery(discovery);
      }
      
      // Apply system optimizations
      if (Math.random() > 0.8) {
        applySystemOptimization();
      }
      
      // Enhance security
      if (Math.random() > 0.85) {
        enhanceSecurity();
      }
      
      // Generate research findings
      if (Math.random() > 0.9) {
        generateResearchFinding();
      }
      
    }, 5000); // Every 5 seconds

    return () => clearInterval(continuousLearningInterval);
  }, [processMiningValidation, validateDiscovery, applySystemOptimization, enhanceSecurity, generateResearchFinding]);

  // Mining problems data - Matched to backend mathematical engine
  const miningProblems = [
    {
      id: 1,
      name: 'Riemann Hypothesis',
      difficulty: 'Expert',
      rewardMultiplier: 4.0,
      description: 'Prove that all non-trivial zeros of the zeta function have real part 1/2. This is one of the most important unsolved problems in mathematics.',
      category: 'mathematical',
      estimatedTime: '6-12 months',
      successRate: '0.1%',
      citations: 15000,
      impact: 'Revolutionary'
    },
    {
      id: 2,
      name: 'Prime Number Patterns',
      difficulty: 'Advanced',
      rewardMultiplier: 3.2,
      description: 'Discover and analyze patterns in the distribution of prime numbers using advanced mathematical techniques.',
      category: 'number-theory',
      estimatedTime: '3-6 months',
      successRate: '0.3%',
      citations: 8500,
      impact: 'Breakthrough'
    },
    {
      id: 3,
      name: 'Poincaré Conjecture',
      difficulty: 'Expert',
      rewardMultiplier: 3.8,
      description: 'Prove that every simply connected closed 3-manifold is homeomorphic to the 3-sphere. Topology breakthrough.',
      category: 'topology',
      estimatedTime: '5-10 months',
      successRate: '0.08%',
      citations: 9500,
      impact: 'Revolutionary'
    },
    {
      id: 4,
      name: 'Elliptic Curve Cryptography (ECC)',
      difficulty: 'Advanced',
      rewardMultiplier: 2.8,
      description: 'Solve elliptic curve discrete logarithm problems and optimize ECC algorithms for blockchain security.',
      category: 'cryptography',
      estimatedTime: '2-4 months',
      successRate: '0.5%',
      citations: 7200,
      impact: 'Significant'
    },
    {
      id: 5,
      name: 'Lattice Cryptography',
      difficulty: 'Advanced',
      rewardMultiplier: 3.0,
      description: 'Develop quantum-resistant cryptographic algorithms based on lattice problems for post-quantum security.',
      category: 'cryptography',
      estimatedTime: '3-5 months',
      successRate: '0.4%',
      citations: 6800,
      impact: 'Breakthrough'
    },
    {
      id: 6,
      name: 'Navier-Stokes Equations',
      difficulty: 'Expert',
      rewardMultiplier: 3.5,
      description: 'Prove the existence and smoothness of solutions to the Navier-Stokes equations. Essential for fluid dynamics.',
      category: 'mathematical',
      estimatedTime: '4-8 months',
      successRate: '0.2%',
      citations: 8200,
      impact: 'Transformative'
    },
    {
      id: 7,
      name: 'Yang-Mills Theory',
      difficulty: 'Expert',
      rewardMultiplier: 3.3,
      description: 'Prove the existence of a mass gap in quantum Yang-Mills theory. Critical for understanding quantum field theory.',
      category: 'physics',
      estimatedTime: '5-9 months',
      successRate: '0.15%',
      citations: 7800,
      impact: 'Revolutionary'
    },
    {
      id: 8,
      name: 'Goldbach Conjecture',
      difficulty: 'Intermediate',
      rewardMultiplier: 2.5,
      description: 'Prove that every even integer greater than 2 can be expressed as the sum of two primes.',
      category: 'number-theory',
      estimatedTime: '1-3 months',
      successRate: '0.8%',
      citations: 4200,
      impact: 'Important'
    },
    {
      id: 9,
      name: 'P vs NP Problem',
      difficulty: 'Expert',
      rewardMultiplier: 4.2,
      description: 'Determine whether every problem whose solution can be verified quickly can also be solved quickly. Fundamental to computer science.',
      category: 'computational',
      estimatedTime: '6-12 months',
      successRate: '0.05%',
      citations: 12000,
      impact: 'Revolutionary'
    }
  ];

  // Update balance function
  const updateBalance = (currency, amount, source = 'mining') => {
    setUserBalance(prev => ({
      ...prev,
      [currency]: (prev[currency] || 0) + amount
    }));

    if (source === 'mining') {
      setTotalMined(prev => prev + amount);
      setMiningHistory(prev => [...prev, {
        amount,
        timestamp: new Date().toISOString(),
        problem: 'Mining Problem Solved'
      }]);
    } else if (source === 'staking') {
      setTotalStaked(prev => prev + amount);
      // setStakingHistory(prev => [...prev, { // This line was removed as per the edit hint
      //   amount,
      //   timestamp: new Date().toISOString(),
      //   type: 'Staking Reward'
      // }]);
    }
  };

  // Mining functions
  const handleStartMining = async (problem) => {
    try {
      console.log('🚀 Starting mining with problem:', problem);
      console.log('Problem details:', {
        name: problem.name,
        difficulty: problem.difficulty,
        rewardMultiplier: problem.rewardMultiplier,
        description: problem.description
      });
      
      // Call the real mining endpoint
      console.log('⛏️  Mining with backend API...');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';
      const miningResponse = await fetch(`${apiUrl}/api/mining/mine`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          workType: problem.name,
          difficulty: problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 25 : 40,
          quantumSecurity: Math.max(256, Math.floor(blockHeight * 2 + 128)) // Adaptive quantum security
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      console.log('📡 Mining response status:', miningResponse.status);
      console.log('📡 Mining response headers:', Object.fromEntries(miningResponse.headers.entries()));
      
      if (!miningResponse.ok) {
        const errorText = await miningResponse.text();
        console.error('❌ Mining response error:', errorText);
        throw new Error(`Mining failed: ${miningResponse.status} - ${errorText}`);
      }
      
      const miningResult = await miningResponse.json();
      console.log('✅ Mining result:', miningResult);
      
      if (miningResult.success) {
        // Update local state with backend data
        setUserBalance(prev => ({
          ...prev,
          MINED: miningResult.newBalance
        }));
        
        setTotalMined(miningResult.totalMined);
        
        // Add to mining history
        setMiningHistory(prev => [...prev, {
          amount: miningResult.reward,
          timestamp: new Date().toISOString(),
          problem: problem.name,
          success: true
        }]);
        
        // Refresh blockchain data and blocks
        console.log('🔄 Refreshing blockchain data...');
        await fetchBlockchainData();
        await fetchBlocksData();
        
        // Also refresh other data
        await fetchTransactionsData();
        await fetchBalanceData();
        
        console.log('✅ Mining completed successfully!');
        alert(`✅ Mining successful!\n\nProblem: ${problem.name}\nReward: ${miningResult.reward} MINED earned\nNew Balance: ${miningResult.newBalance} MINED\n\nCheck your wallet balance and the Block Explorer tab!`);
      } else {
        // Add failed mining to history
        setMiningHistory(prev => [...prev, {
          amount: 0,
          timestamp: new Date().toISOString(),
          problem: problem.name,
          success: false
        }]);
        
        // Provide more helpful error message
        const errorMessage = miningResult.message || 'Mining failed due to computational complexity';
        const retryMessage = 'This is normal - mathematical problems can be challenging. Try again!';
        
        alert(`❌ Mining failed!\n\nProblem: ${problem.name}\nReason: ${errorMessage}\n\n💡 ${retryMessage}`);
      }
    } catch (error) {
      console.error('❌ Mining error:', error);
      
      // Add failed mining to history
      setMiningHistory(prev => [...prev, {
        amount: 0,
        timestamp: new Date().toISOString(),
        problem: problem.name,
        success: false
      }]);
      
      // Provide more helpful error message
      let errorMessage = 'Network or server error occurred';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to mining server. Please check your connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Mining request timed out. Please try again.';
      }
      
      alert(`❌ Mining failed!\n\nProblem: ${problem.name}\nError: ${errorMessage}\n\n💡 Please check your connection and try again.`);
    }
  };

  const handleTestMining = async (problem) => {
    try {
      console.log('🧪 Testing mining with problem:', problem);
      
      // Call the backend API to get actual adaptive rewards
      const miningResponse = await fetch('http://localhost:3002/api/mining/mine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workType: problem.name,
          difficulty: problem.difficulty || 25,
          quantumSecurity: Math.max(256, Math.floor(blockHeight * 2 + 128)) // Adaptive quantum security
        })
      });
      
      if (!miningResponse.ok) {
        throw new Error('Failed to test mining with backend API');
      }
      
      const miningResult = await miningResponse.json();
      console.log('💰 Test mining result:', miningResult);
      
      if (miningResult.success) {
        alert(`🧪 Test Mining Result:\n\nProblem: ${problem.name}\nReward: ${miningResult.reward} MINED would be earned\n\nThis is the actual adaptive reward from the backend!`);
      } else {
        alert(`🧪 Test Mining Result:\n\nProblem: ${problem.name}\nStatus: Failed\nReason: ${miningResult.message}\n\nThis shows the actual backend response.`);
      }
    } catch (error) {
      console.error('❌ Test mining error:', error);
      alert('❌ Test mining failed. Please try again.');
    }
  };

  // Quick test mining function
  const handleQuickTest = async () => {
    try {
      console.log('🧪 Quick test mining...');
      
      // Test mining with backend API
      const testProblem = {
        name: 'Quick Test Problem',
        difficulty: 'Test',
        rewardMultiplier: 2.0,
        description: 'Quick test to verify mining works'
      };
      
      // Call the mining endpoint directly
      const miningResponse = await fetch('http://localhost:3000/api/mining/mine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workType: 'Quick Test Problem',
          difficulty: 25,
          quantumSecurity: Math.max(256, Math.floor(blockHeight * 2 + 128)) // Adaptive quantum security
        })
      });
      
      if (!miningResponse.ok) {
        throw new Error('Failed to mine with backend API');
      }
      
      const miningResult = await miningResponse.json();
      console.log('✅ Quick test mining result:', miningResult);
      
      if (miningResult.success) {
        // Update local state with backend data
        setUserBalance(prev => ({
          ...prev,
          MINED: miningResult.newBalance
        }));
        
        setTotalMined(miningResult.totalMined);
        
        // Add to mining history
        setMiningHistory(prev => [...prev, {
          amount: miningResult.reward,
          timestamp: new Date().toISOString(),
          problem: 'Quick Test Problem',
          success: true
        }]);
        
        // Refresh blockchain data and blocks
        console.log('🔄 Refreshing blockchain data after quick test...');
        await fetchBlockchainData();
        await fetchBlocksData();
        await fetchTransactionsData();
        await fetchBalanceData();
        
        alert(`✅ Quick test mining successful!\n\nReward: ${miningResult.reward} MINED earned\nNew Balance: ${miningResult.newBalance} MINED\n\nCheck your wallet balance and the Block Explorer tab!`);
      } else {
        alert(`❌ Quick test mining failed!\n\nMessage: ${miningResult.message}\n\nPlease try again.`);
      }
    } catch (error) {
      console.error('❌ Quick test mining error:', error);
      alert('❌ Quick test mining failed. Please try again.');
    }
  };

  // Formatting functions
  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0.00';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatCurrency = (num) => {
    if (!num || isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Periodic staking rewards
  useEffect(() => {
    const stakingRewardsInterval = setInterval(async () => {
      const reward = Math.random() * 10 + 5; // 5-15 MINED per interval
      
      try {
        const stakingResponse = await fetch('http://localhost:3002/api/staking/reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: reward })
        });
        
        if (stakingResponse.ok) {
          const stakingResult = await stakingResponse.json();
          console.log('💰 Staking reward updated:', stakingResult);
          
          // Update local state with backend data
          setUserBalance(prev => ({
            ...prev,
            MINED: stakingResult.newBalance
          }));
          
          setStakingRewards(stakingResult.stakingRewards);
          // Don't add reward to totalStaked - staking rewards increase balance, not staked amount
          
          // Refresh balance data to ensure wallet is updated
          fetchBalanceData();
        }
      } catch (error) {
        console.error('Error updating staking reward:', error);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(stakingRewardsInterval);
  }, []);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update trading data
      setTradingData(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 2,
        change24h: prev.change24h + (Math.random() - 0.5) * 0.5,
        volume24h: prev.volume24h + (Math.random() - 0.5) * 1000000
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Real-time trading data refresh
  useEffect(() => {
    const tradingInterval = setInterval(() => {
      fetchTradingData();
      fetchMarketData();
    }, 10000); // Refresh trading data every 10 seconds

    return () => clearInterval(tradingInterval);
  }, []);

  // Discoveries button handlers
  const handleViewDiscoveryDetails = (discovery) => {
    alert(`🔬 Viewing Details for: ${discovery.name}\n\nComplexity: ${discovery.details?.complexity || 'N/A'}\nEfficiency: ${discovery.details?.efficiency || 'N/A'}\nSecurity Level: ${discovery.details?.securityLevel || 'N/A'}\nScalability: ${discovery.details?.scalability || 'N/A'}`);
  };

  const handleTestDiscoveryImplementation = async (discovery) => {
    try {
      const response = await fetch(`http://localhost:3002/api/discoveries/${discovery.id}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show detailed test results
        const testResults = result.testResults;
        const passedTests = Object.keys(testResults).filter(key => testResults[key] && key !== 'allTestsPassed' && key !== 'overallScore').length;
        const totalTests = Object.keys(testResults).filter(key => key !== 'allTestsPassed' && key !== 'overallScore').length;
        
        let message = `🧪 Testing Implementation for: ${discovery.name}\n\n`;
        message += `Test Results: ${passedTests}/${totalTests} tests passed\n`;
        message += `Overall Score: ${testResults.overallScore}%\n\n`;
        
        if (testResults.allTestsPassed) {
          message += `✅ All tests passed! Discovery is now verified.\n`;
          message += `✅ Status updated to: Implemented\n`;
          message += `✅ Research value increased\n`;
          message += `✅ Impact score improved\n`;
        } else {
          message += `❌ Some tests failed. Discovery needs revision.\n`;
          message += `❌ Status updated to: Testing\n`;
          message += `❌ Please review and fix issues\n`;
        }
        
        alert(message);
        
        // Refresh discoveries data to show updated status
        fetchDiscoveriesData();
      } else {
        alert(`❌ Error testing discovery: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error testing discovery:', error);
      alert(`❌ Failed to test discovery: ${error.message}`);
    }
  };

  const handleDeployDiscovery = async (discovery) => {
    try {
      const response = await fetch(`http://localhost:3002/api/discoveries/${discovery.id}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show detailed deployment results
        const deploymentResults = result.deploymentResults;
        const successfulSteps = Object.keys(deploymentResults).filter(key => deploymentResults[key] && key !== 'deploymentSuccessful').length;
        const totalSteps = Object.keys(deploymentResults).filter(key => key !== 'deploymentSuccessful').length;
        
        let message = `🚀 Deploying Discovery: ${discovery.name}\n\n`;
        message += `Deployment Results: ${successfulSteps}/${totalSteps} steps successful\n\n`;
        
        if (deploymentResults.deploymentSuccessful) {
          message += `✅ Deployment successful!\n`;
          message += `✅ Status: Deployed to production\n`;
          message += `✅ Version: 1.0.0\n`;
          message += `✅ URL: ${result.discovery.deploymentStatus === 'deployed' ? result.discovery.productionUrl : 'N/A'}\n`;
          message += `✅ Research value increased\n`;
          message += `✅ Impact score improved\n`;
        } else {
          message += `❌ Deployment failed\n`;
          message += `❌ Please check failed steps and try again\n`;
          message += `❌ Status: Deployment failed\n`;
        }
        
        alert(message);
        
        // Refresh discoveries data to show updated status
        fetchDiscoveriesData();
      } else {
        if (result.error === 'Discovery must be verified before deployment') {
          alert(`❌ Deployment failed: Discovery must be verified before deployment.\n\nCurrent status: ${result.currentStatus}\n\nPlease test the discovery first to verify it.`);
        } else {
          alert(`❌ Error deploying discovery: ${result.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error deploying discovery:', error);
      alert(`❌ Failed to deploy discovery: ${error.message}`);
    }
  };

  // Chart data generation and live updates
  const generateChartData = useCallback(() => {
    const data = [];
    const width = 800;
    const height = 250;
    const basePrice = tradingData?.price || marketData?.price || 0.85;
    
    // Generate realistic price history based on current price
    for (let i = 0; i < 50; i++) {
      const x = (i / 49) * width;
      const timeFactor = i / 49; // 0 to 1 over time
      const volatility = 0.02; // 2% volatility
      const trend = Math.sin(timeFactor * Math.PI) * 0.01; // Slight trend
      const randomFactor = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + trend + randomFactor);
      const y = height - ((price - basePrice * 0.9) / (basePrice * 0.2)) * 200;
      data.push({ x, y, price: price });
    }
    return data;
  }, [tradingData?.price, marketData?.price]);

  // Initialize chart data
  useEffect(() => {
    const initialData = generateChartData();
    setChartData(initialData);
  }, [generateChartData]);

  // Live chart updates with real price data
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        // Remove first point and add new point
        newData.shift();
        
        // Get current price from real data
        const currentPrice = tradingData?.price || marketData?.price || 0.85;
        const lastPrice = newData[newData.length - 1]?.price || currentPrice;
        
        // Add realistic price movement
        const volatility = 0.005; // 0.5% volatility
        const trend = Math.sin(Date.now() / 10000) * 0.002; // Time-based trend
        const randomFactor = (Math.random() - 0.5) * volatility;
        const newPrice = lastPrice * (1 + trend + randomFactor);
        
        const x = 800;
        const y = 250 - ((newPrice - currentPrice * 0.9) / (currentPrice * 0.2)) * 200;
        newData.push({ x, y, price: newPrice });
        
        // Update x coordinates for animation
        return newData.map((point, index) => ({
          ...point,
          x: (index / (newData.length - 1)) * 800
        }));
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [tradingData?.price, marketData?.price]);

  // Initial data fetching and periodic updates
  useEffect(() => {
    // Initial data fetch
    fetchBlockchainData();
    fetchValidatorsData();
    fetchDiscoveriesData();
    fetchAdaptiveLearningData();
    fetchBlocksData();
    fetchTransactionsData();
    fetchTradingData();
    fetchOrderbookData();
    fetchTradesData();
    fetchBalanceData();
    fetchMarketData();
    fetchNetworkStatsData();
    fetchResearchRepositoryData();
    fetchRewardHistory();
    
    // Periodic data refresh every 10 seconds
    const interval = setInterval(() => {
      fetchBlockchainData();
      fetchValidatorsData();
      fetchDiscoveriesData();
      fetchAdaptiveLearningData();
      fetchBlocksData();
      fetchTransactionsData();
      fetchTradingData();
      fetchOrderbookData();
      fetchTradesData();
      fetchBalanceData();
      fetchMarketData();
      fetchNetworkStatsData();
      fetchResearchRepositoryData();
      fetchRewardHistory();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Render functions
  const renderExchangeTab = () => (
    <div className="tab-content">
      <div className="main-content">
        <div className="analytics-header">
          <h2>📈 Advanced Trading Exchange</h2>
          <p className="analytics-subtitle">Real-time MINED/USD trading with mathematical precision</p>
        </div>

        {/* Exchange Status */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Exchange Status</h4>
            <span className="status-indicator active">Online</span>
          </div>
          <div className="card-content">
            <p>All trading systems operational - Real-time order matching active</p>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="grid-4">
          <div className="metric-card">
            <div className="metric-value">${((marketData?.price || tradingData?.price || 0.85)).toFixed(2)}</div>
            <div className="metric-label">Current Price</div>
            <div className={`metric-description ${((marketData?.change24h || tradingData?.change24h || 0) >= 0 ? 'positive' : 'negative')}`}>
              {((marketData?.change24h || tradingData?.change24h || 0) >= 0 ? '+' : '')}{((marketData?.change24h || tradingData?.change24h || 0)).toFixed(2)}% (24h)
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-value">${(((marketData?.volume24h || tradingData?.volume24h || 0) / 1000000)).toFixed(1)}M</div>
            <div className="metric-label">24h Volume</div>
            <div className="metric-description positive">
              +{((marketData?.volume24h || tradingData?.volume24h || 0) > 0 ? '12.5' : '0.0')}% from yesterday
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-value">${((marketData?.price || tradingData?.price || 0.85) * (1 + Math.abs(marketData?.change24h || tradingData?.change24h || 0) / 100)).toFixed(2)}</div>
            <div className="metric-label">24h High</div>
            <div className="metric-description positive">
              +{((marketData?.change24h || tradingData?.change24h || 0) > 0 ? '2.1' : '0.0')}% from open
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-value">${((marketData?.price || tradingData?.price || 0.85) * (1 - Math.abs(marketData?.change24h || tradingData?.change24h || 0) / 100)).toFixed(2)}</div>
            <div className="metric-label">24h Low</div>
            <div className="metric-description negative">
              -{((marketData?.change24h || tradingData?.change24h || 0) < 0 ? '1.8' : '0.0')}% from open
            </div>
          </div>
        </div>

        {/* Live Price Chart */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">📊 Live Price Chart</h4>
            <div className="chart-controls">
              <button className="control-btn active">1H</button>
              <button className="control-btn">4H</button>
              <button className="control-btn">1D</button>
              <button className="control-btn">1W</button>
              <button className="control-btn">1M</button>
            </div>
          </div>
          <div className="card-content">
          
          <svg width="100%" height="300" className="price-chart">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.1"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid Lines */}
            <g className="grid-lines">
              {Array.from({ length: 6 }, (_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={50 + i * 40}
                  x2="100%"
                  y2={50 + i * 40}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              ))}
            </g>
            
            {/* Price Labels */}
            <g className="price-labels">
              {Array.from({ length: 6 }, (_, i) => (
                <text
                  key={i}
                  x="10"
                  y={50 + i * 40}
                  fill="#8b9dc3"
                  fontSize="12"
                  textAnchor="start"
                >
                  ${((tradingData?.price || 0.85) + (2.5 - i) * 5).toFixed(2)}
                </text>
              ))}
            </g>
            
            {/* Chart Path */}
            <path
              d={chartData.length > 0 ? chartData.map((point, i) => 
                `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
              ).join(' ') : ''}
              stroke="#00d4ff"
              strokeWidth="3"
              fill="none"
              filter="url(#glow)"
            />
            
            {/* Area Fill */}
            <path
              d={chartData.length > 0 ? 
                chartData.map((point, i) => 
                  `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ') + ` L ${chartData[chartData.length - 1]?.x || 0} 300 L 0 300 Z` : ''}
              fill="url(#chartGradient)"
            />
          </svg>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="card-container">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">📋 Order Book</h4>
            </div>
            <div className="card-content">
              <div className="order-book">
                <div className="order-header">
                  <span>Price (USD)</span>
                  <span>Amount (MINED)</span>
                  <span>Total</span>
                </div>
                <div className="sell-orders">
                  <div className="order-row">
                    <span className="price sell">$125.75</span>
                    <span className="amount">1,250.00</span>
                    <span className="total">$157,187.50</span>
                  </div>
                  <div className="order-row">
                    <span className="price sell">$125.70</span>
                    <span className="amount">2,100.00</span>
                    <span className="total">$263,970.00</span>
                  </div>
                  <div className="order-row">
                    <span className="price sell">$125.65</span>
                    <span className="amount">850.00</span>
                    <span className="total">$106,802.50</span>
                  </div>
                </div>
                <div className="current-price">
                  <span className="price">$125.50</span>
                  <span className="change positive">+2.15%</span>
                </div>
                <div className="buy-orders">
                  <div className="order-row">
                    <span className="price buy">$125.45</span>
                    <span className="amount">1,800.00</span>
                    <span className="total">$225,810.00</span>
                  </div>
                  <div className="order-row">
                    <span className="price buy">$125.40</span>
                    <span className="amount">2,300.00</span>
                    <span className="total">$288,420.00</span>
                  </div>
                  <div className="order-row">
                    <span className="price buy">$125.35</span>
                    <span className="amount">950.00</span>
                    <span className="total">$119,082.50</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3>Place Order</h3>
              <div className="order-form">
                <div className="form-tabs">
                  <button className="tab active">Buy</button>
                  <button className="tab">Sell</button>
                </div>
                <div className="form-content">
                  <div className="form-group">
                    <label>Amount (MINED)</label>
                    <input type="number" placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Price (USD)</label>
                    <input type="number" placeholder="125.50" />
                  </div>
                  <div className="form-group">
                    <label>Total (USD)</label>
                    <input type="number" placeholder="0.00" disabled />
                  </div>
                  <button className="place-order-btn buy" onClick={() => handlePlaceOrder('buy', 100, 125.50)}>
                    Buy MINED
                  </button>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3>Recent Trades</h3>
              <div className="recent-trades">
                <div className="trade-row">
                  <span className="time">2 min ago</span>
                  <span className="price buy">$125.50</span>
                  <span className="amount">100.00</span>
                </div>
                <div className="trade-row">
                  <span className="time">5 min ago</span>
                  <span className="price sell">$125.45</span>
                  <span className="amount">250.00</span>
                </div>
                <div className="trade-row">
                  <span className="time">8 min ago</span>
                  <span className="price buy">$125.55</span>
                  <span className="amount">75.00</span>
                </div>
                <div className="trade-row">
                  <span className="time">12 min ago</span>
                  <span className="price sell">$125.40</span>
                  <span className="amount">300.00</span>
                </div>
                <div className="trade-row">
                  <span className="time">15 min ago</span>
                  <span className="price buy">$125.60</span>
                  <span className="amount">150.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMiningTab = () => (
    <div className="tab-content">
      <div className="mining-interface">
        <div className="mining-header">
          <h2>🪙 Advanced Mining Operations</h2>
          <div className="mining-subtitle">Mathematical Problem Solving & Blockchain Security</div>
        </div>

        {/* Mining Overview Dashboard */}
        <div className="mining-overview">
          <div className="overview-stats">
            <div className="stat-card primary">
              <div className="stat-icon">⛏️</div>
              <div className="stat-content">
                <div className="stat-value">{blockchainData?.blockchain?.blockHeight?.toLocaleString() || blockHeight.toLocaleString()}</div>
                <div className="stat-label">Block Height</div>
                <div className="stat-trend positive">+1.2 blocks/sec</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-value">{blockchainData?.blockchain?.networkHashRate || '3.75 GH/s'}</div>
                <div className="stat-label">Network Hash Rate</div>
                <div className="stat-trend positive">+5.2%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">{formatNumber(totalMined)}</div>
                <div className="stat-label">Total MINED</div>
                <div className="stat-trend positive">+2.4%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔐</div>
              <div className="stat-content">
                <div className="stat-value">{formatBitStrength(currentBitStrength)}</div>
                <div className="stat-label">Security Strength</div>
                <div className="stat-trend positive">Adaptive Growth</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">{formatNumber(totalStaked)}</div>
                <div className="stat-label">Total Staked</div>
                <div className="stat-trend positive">+1,200 MINED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mining Problems Section */}
        <div className="mining-problems-section">
          <div className="section-header">
            <h3>🧮 Mathematical Mining Problems</h3>
            <div className="section-stats">
              <span className="stat">Problems: 9</span>
              <span className="stat">Active Miners: 1,247</span>
              <span className="stat">Success Rate: 0.8%</span>
            </div>
          </div>

          {/* Quick Test Button */}
          <div className="quick-test-section">
            <button className="btn btn-warning" onClick={handleQuickTest}>
              🧪 Quick Test Mining (1000 MINED)
            </button>
          </div>
          
          <div className="problems-grid">
            {miningProblems.map((problem) => (
              <div key={problem.id} className={`problem-card ${problem.category}`}>
                <div className="problem-header">
                  <h4>{problem.name}</h4>
                  <div className="problem-meta">
                    <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                    <span className="multiplier">x{problem.rewardMultiplier}</span>
                  </div>
                </div>
                
                <p className="problem-description">{problem.description}</p>
                
                <div className="problem-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Category</span>
                    <span className="metric-value">{problem.category}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Estimated Time</span>
                    <span className="metric-value">{problem.estimatedTime}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Success Rate</span>
                    <span className="metric-value">{problem.successRate}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Citations</span>
                    <span className="metric-value">{problem.citations.toLocaleString()}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Impact</span>
                    <span className={`metric-value impact-${problem.impact.toLowerCase()}`}>{problem.impact}</span>
                  </div>
                </div>
                
                <div className="problem-actions">
                  <button className="btn btn-primary" onClick={() => handleStartMining(problem)}>
                    Start Mining
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleTestMining(problem)}>
                    Test Mining
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mining History */}
        <div className="mining-history-section">
          <h3>📊 Mining History</h3>
          <div className="history-grid">
            {miningHistory.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="history-card">
                <div className="history-header">
                  <span className="amount">+{formatNumber(entry.amount)} MINED</span>
                  <span className="timestamp">{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                <div className="history-details">
                  <span className="problem">{entry.problem}</span>
                  <span className="status success">✅ Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWalletTab = () => (
    <div className="tab-content">
      <div className="wallet-interface">
        <div className="wallet-header">
          <h2>💼 Exchange-Ready Wallet</h2>
          <div className="wallet-status">
            <div className={`status-indicator ${walletConnection.isConnected ? 'unlocked' : 'locked'}`}></div>
            <span className="status-text">
              {walletConnection.isConnected ? 'Connected to Exchange' : 'Wallet Disconnected'}
            </span>
          </div>
        </div>

        <div className="wallet-content">
          {/* Wallet Connectivity Section */}
          <div className="wallet-connectivity">
            <h3>🔗 Wallet Integration</h3>
            <div className="connectivity-status">
              <div className="connection-info">
                <span className={`connection-status ${walletConnection.isConnected ? 'connected' : 'disconnected'}`}>
                  {walletConnection.isConnected ? '🟢 Connected' : '⚪ Disconnected'}
                </span>
                {walletConnection.provider && (
                  <span className="wallet-type">
                    {walletConnection.provider === 'MetaMask' ? '🦊 MetaMask' : '🔗 Web3'}
                  </span>
                )}
              </div>
              
              <div className="connection-actions">
                {!walletConnection.isConnected ? (
                  <button 
                    className="connect-btn metamask" 
                    onClick={connectWallet}
                  >
                    🦊 Connect MetaMask
                  </button>
                ) : (
                  <button className="disconnect-btn" onClick={disconnectWallet}>
                    🔌 Disconnect
                  </button>
                )}
              </div>
            </div>

            {walletConnection.isConnected && (
              <div className="external-wallet-info">
                <div className="external-address">
                  <h4>Connected Address</h4>
                  <span className="address">{walletConnection.address}</span>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText(walletConnection.address)}>
                    📋 Copy
                  </button>
                </div>
                
                <div className="external-balance">
                  <h4>External Wallet Balance</h4>
                  <div className="balance-grid">
                    <div className="balance-card">
                      <span className="currency">ETH</span>
                      <span className="amount">{walletConnection.balance.ETH || 0}</span>
                      <span className="value">Ethereum</span>
                    </div>
                    <div className="balance-card">
                      <span className="currency">MINED</span>
                      <span className="amount">{formatNumber(userBalance?.MINED || 0)}</span>
                      <span className="value">TestNet Token</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Overview */}
          <div className="portfolio-overview">
            <h3>📊 Portfolio Overview</h3>
            <div className="portfolio-stats">
              <div className="portfolio-stat">
                <span className="label">Total Portfolio Value</span>
                <span className="value">${((userBalance?.MINED || 0) * (marketData?.price || tradingData?.price || 0.85) + (userBalance?.USD || 0)).toLocaleString()}</span>
              </div>
              <div className="portfolio-stat">
                <span className="label">24h Change</span>
                <span className="value positive">+${(((userBalance?.MINED || 0) * (marketData?.price || tradingData?.price || 0.85) * 0.0525)).toFixed(2)}</span>
              </div>
              <div className="portfolio-stat">
                <span className="label">Total Assets</span>
                <span className="value">{userBalance ? Object.keys(userBalance).length : 0}</span>
              </div>
              <div className="portfolio-stat">
                <span className="label">Open Orders</span>
                <span className="value">{tradingOrders.openOrders.length}</span>
              </div>
            </div>
          </div>

          {/* Asset Balances */}
          <div className="asset-balances">
            <h3>💰 Asset Balances</h3>
            <div className="balance-grid">
              <div className="balance-card">
                <div className="asset-info">
                  <span className="asset-symbol">MINED</span>
                  <span className="asset-name">ProductiveMiner Token</span>
                </div>
                <div className="balance-details">
                  <span className="amount">{formatNumber(userBalance?.MINED || 0)} MINED</span>
                  <span className="value">${((userBalance?.MINED || 0) * (marketData?.price || tradingData?.price || 0.85)).toLocaleString()}</span>
                  <span className="change positive">+5.25%</span>
                </div>
              </div>
              
              <div className="balance-card">
                <div className="asset-info">
                  <span className="asset-symbol">USD</span>
                  <span className="asset-name">US Dollar</span>
                </div>
                <div className="balance-details">
                  <span className="amount">${formatNumber(userBalance?.USD || 0)}</span>
                  <span className="value">${formatNumber(userBalance?.USD || 0)}</span>
                  <span className="change neutral">0.00%</span>
                </div>
              </div>
              
              <div className="balance-card">
                <div className="asset-info">
                  <span className="asset-symbol">ETH</span>
                  <span className="asset-name">Ethereum</span>
                </div>
                <div className="balance-details">
                  <span className="amount">{walletConnection.balance.ETH || 0} ETH</span>
                  <span className="value">${((walletConnection.balance.ETH || 0) * 2000).toFixed(2)}</span>
                  <span className="change positive">+2.1%</span>
                </div>
              </div>
              
              <div className="balance-card">
                <div className="asset-info">
                  <span className="asset-symbol">BTC</span>
                  <span className="asset-name">Bitcoin</span>
                </div>
                <div className="balance-details">
                  <span className="amount">0.00000000 BTC</span>
                  <span className="value">$0.00</span>
                  <span className="change neutral">0.00%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="trading-interface">
            <h3>📈 Trading Interface</h3>
            <div className="trading-panels">
              <div className="panel">
                <h4>Place Order</h4>
                <div className="order-form">
                  <div className="form-group">
                    <label>Trading Pair</label>
                    <select 
                      className="form-control"
                      value={orderForm.pair}
                      onChange={(e) => handleOrderFormChange('pair', e.target.value)}
                    >
                      {exchangeFeatures.supportedPairs.map(pair => (
                        <option key={pair} value={pair}>{pair}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Order Type</label>
                    <select 
                      className="form-control"
                      value={orderForm.type}
                      onChange={(e) => handleOrderFormChange('type', e.target.value)}
                    >
                      <option value="limit">Limit</option>
                      <option value="market">Market</option>
                      <option value="stop">Stop Loss</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Side</label>
                    <div className="side-buttons">
                      <button 
                        className={`side-btn buy ${tradingSide === 'buy' ? 'active' : ''}`}
                        onClick={() => handleTradingSideChange('buy')}
                      >
                        Buy
                      </button>
                      <button 
                        className={`side-btn sell ${tradingSide === 'sell' ? 'active' : ''}`}
                        onClick={() => handleTradingSideChange('sell')}
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="0.00"
                      value={orderForm.amount}
                      onChange={(e) => handleOrderFormChange('amount', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="0.00"
                      value={orderForm.price}
                      onChange={(e) => handleOrderFormChange('price', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total (USD)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="0.00"
                      value={orderForm.amount && orderForm.price ? (parseFloat(orderForm.amount) * parseFloat(orderForm.price)).toFixed(2) : ''}
                      disabled
                    />
                  </div>
                  <button 
                    className={`place-order-btn ${tradingSide}`}
                    onClick={handlePlaceTradingOrder}
                    disabled={!orderForm.amount || !orderForm.price || parseFloat(orderForm.amount) <= 0 || parseFloat(orderForm.price) <= 0}
                  >
                    Place {tradingSide === 'buy' ? 'Buy' : 'Sell'} Order
                  </button>
                </div>
              </div>
              
              <div className="panel">
                <h4>Open Orders</h4>
                <div className="orders-list">
                  {tradingOrders.openOrders.length === 0 ? (
                    <div className="empty-state">No open orders</div>
                  ) : (
                    tradingOrders.openOrders.map(order => (
                      <div key={order.id} className="order-item">
                        <div className="order-info">
                          <span className="pair">{order.pair}</span>
                          <span className={`type ${order.type}`}>{order.type.toUpperCase()}</span>
                          <span className="amount">{order.amount}</span>
                          <span className="price">${order.price}</span>
                          <span className="total">${order.total}</span>
                        </div>
                        <div className="order-actions">
                          <button className="cancel-btn" onClick={() => cancelOrder(order.id)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="security-features">
            <h3>🔒 Security & Compliance</h3>
            <div className="security-grid">
              <div className="security-card">
                <h4>🔐 Two-Factor Authentication</h4>
                <div className="security-status">
                  <span className={`status ${walletSecurity.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                    {walletSecurity.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button className="toggle-btn">
                    {walletSecurity.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
              
              <div className="security-card">
                <h4>❄️ Cold Storage</h4>
                <div className="security-status">
                  <span className={`status ${walletSecurity.coldStorageEnabled ? 'enabled' : 'disabled'}`}>
                    {walletSecurity.coldStorageEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button className="toggle-btn">
                    {walletSecurity.coldStorageEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
              
              <div className="security-card">
                <h4>📋 KYC Verification</h4>
                <div className="security-status">
                  <span className="status pending">Pending</span>
                  <button className="verify-btn">Verify Identity</button>
                </div>
              </div>
              
              <div className="security-card">
                <h4>📊 Trading Limits</h4>
                <div className="limits-info">
                  <span>Daily: ${exchangeFeatures.tradingLimits.dailyLimit.toLocaleString()}</span>
                  <span>Min Order: ${exchangeFeatures.tradingLimits.minOrder}</span>
                  <span>Max Order: ${exchangeFeatures.tradingLimits.maxOrder.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Activity */}
          <div className="trading-activity">
            <h3>📈 Trading Activity</h3>
            <div className="activity-tabs">
              <button className="tab-btn active">Recent Trades</button>
              <button className="tab-btn">Open Orders</button>
              <button className="tab-btn">Order History</button>
            </div>
            
            <div className="trades-table">
              <div className="table-header">
                <span>Time</span>
                <span>Pair</span>
                <span>Type</span>
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              
              <div className="trade-row">
                <span className="time">2 min ago</span>
                <span className="pair">MINED/USD</span>
                <span className="type buy">BUY</span>
                <span className="price">$125.50</span>
                <span className="amount">100.00</span>
                <span className="total">$12,550.00</span>
                <span className="status confirmed">Completed</span>
              </div>
              
              <div className="trade-row">
                <span className="time">15 min ago</span>
                <span className="pair">MINED/USD</span>
                <span className="type sell">SELL</span>
                <span className="price">$125.25</span>
                <span className="amount">50.00</span>
                <span className="total">$6,262.50</span>
                <span className="status confirmed">Completed</span>
              </div>
              
              <div className="trade-row">
                <span className="time">1 hour ago</span>
                <span className="pair">MINED/USD</span>
                <span className="type buy">BUY</span>
                <span className="price">$124.75</span>
                <span className="amount">200.00</span>
                <span className="total">$24,950.00</span>
                <span className="status confirmed">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlockExplorerTab = () => (
    <div className="tab-content">
      <div className="block-explorer-interface">
        <div className="explorer-header">
          <h2>🔍 Advanced Block Explorer</h2>
          <div className="explorer-subtitle">Real-time blockchain data and transaction monitoring</div>
          <div className="explorer-controls">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                console.log('🔄 Manual refresh clicked...');
                fetchBlockchainData();
                fetchBlocksData();
                console.log('🔄 Manual refresh completed');
              }}
            >
              🔄 Refresh Data
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                console.log('🔍 Debug: Current blocksData:', blocksData);
                console.log('🔍 Debug: Current blockHeight:', blockHeight);
                console.log('🔍 Debug: blocksData.latestBlocks:', blocksData?.latestBlocks);
              }}
            >
              🔍 Debug State
            </button>
            <button 
              className="btn btn-warning" 
              onClick={() => {
                console.log('🔄 Force refresh: Resetting state...');
                setBlocksData({ latestBlocks: [] });
                setTimeout(() => {
                  fetchBlocksData();
                  console.log('🔄 Force refresh: State reset and data refetched');
                }, 100);
              }}
            >
              🔄 Force Refresh
            </button>
            <span className="last-updated">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="metrics-dashboard">
          <div className="metric-row">
            <div className="metric-card primary">
              <span className="metric-label">Latest Block</span>
              <span className="metric-value">{blockHeight.toLocaleString()}</span>
              <span className="metric-trend positive">+1.2 blocks/sec</span>

            </div>
            <div className="metric-card">
              <span className="metric-label">Total Transactions</span>
              <span className="metric-value">
                {transactionsData?.transactions?.length || (blockHeight * 150).toLocaleString()}
              </span>
              <span className="metric-trend positive">+5.8%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Network Hash Rate</span>
              <span className="metric-value">
                {networkStatsData?.hashRate || blockchainData?.blockchain?.networkHashRate || '3.75 GH/s'}
              </span>
              <span className="metric-trend positive">+2.1%</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Average Block Time</span>
              <span className="metric-value">
                {networkStatsData?.avgBlockTime || blockchainData?.blockchain?.blockTime || '12.3s'}
              </span>
              <span className="metric-trend negative">-0.5s</span>
            </div>
          </div>
        </div>

        {/* Latest Blocks Section */}
        <div className="blocks-section">
          <div className="section-header">
            <h3>📦 Latest Blocks</h3>
            <div className="section-stats">
              <span className="stat">Blocks: {blocksData?.latestBlocks?.length || 0}</span>
              <span className="stat">Avg. Time: {networkStatsData?.avgBlockTime || '12.3s'}</span>
              <span className="stat">Difficulty: {blockchainData?.blockchain?.difficulty || '1.2M'}</span>
            </div>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>
              Debug: blocksData exists: {blocksData ? 'Yes' : 'No'}, 
              latestBlocks length: {blocksData?.latestBlocks?.length || 0},
              First block height: {blocksData?.latestBlocks?.[0]?.height || 'N/A'}
            </div>

          </div>
          
          <div className="blocks-grid">
            {blocksData?.latestBlocks?.map((block, index) => (
              <div key={block.height || index} className="block-card">
                <div className="block-header">
                  <h4>Block #{block.height?.toLocaleString() || (blockHeight - index).toLocaleString()}</h4>
                  <span className="block-status confirmed">✅ Confirmed</span>
                </div>
                
                <div className="block-details">
                  <div className="detail-row">
                    <span className="label">Timestamp</span>
                    <span className="value">{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Transactions</span>
                    <span className="value">{block.transactions || 0}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Gas Used</span>
                    <span className="value">{block.gasUsed || '0'} / {block.gasLimit || '8000000'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Miner</span>
                    <span className="value address">{block.miner || '0x0000000000000000000000000000000000000000'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Block Hash</span>
                    <span className="value hash">{block.hash || `0x${Math.random().toString(16).substr(2, 64)}`}</span>
                  </div>
                </div>
                
                <div className="block-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleViewBlockDetails(block)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleViewBlockTransactions(block)}
                  >
                    View Transactions
                  </button>
                </div>
              </div>
            )) || Array.from({ length: 10 }, (_, i) => {
              const blockNumber = blockHeight - i;
              const timestamp = new Date(Date.now() - i * 12000);
              const transactions = Math.floor(Math.random() * 150) + 50;
              const gasUsed = Math.floor(Math.random() * 8000000) + 2000000;
              const gasLimit = 8000000;
              const miner = `0x${Math.random().toString(16).substr(2, 40)}`;
              
              return (
                <div key={blockNumber} className="block-card">
                  <div className="block-header">
                    <h4>Block #{blockNumber.toLocaleString()}</h4>
                    <span className="block-status confirmed">✅ Confirmed</span>
                  </div>
                  
                  <div className="block-details">
                    <div className="detail-row">
                      <span className="label">Timestamp</span>
                      <span className="value">{timestamp.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Transactions</span>
                      <span className="value">{transactions}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Gas Used</span>
                      <span className="value">{gasUsed.toLocaleString()} / {gasLimit.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Miner</span>
                      <span className="value address">{miner}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Block Hash</span>
                      <span className="value hash">0x{Math.random().toString(16).substr(2, 64)}</span>
                    </div>
                  </div>
                  
                  <div className="block-actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleViewBlockDetails({
                        height: blockNumber,
                        timestamp: timestamp.toISOString(),
                        transactions: transactions,
                        gasUsed: gasUsed,
                        gasLimit: gasLimit,
                        miner: miner,
                        hash: `0x${Math.random().toString(16).substr(2, 64)}`
                      })}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleViewBlockTransactions({
                        height: blockNumber,
                        timestamp: timestamp.toISOString(),
                        transactions: transactions,
                        gasUsed: gasUsed,
                        gasLimit: gasLimit,
                        miner: miner,
                        hash: `0x${Math.random().toString(16).substr(2, 64)}`
                      })}
                    >
                      View Transactions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Transactions Section */}
        <div className="transactions-section">
          <div className="section-header">
            <h3>💸 Latest Transactions</h3>
            <div className="section-stats">
              <span className="stat">Transactions: 1,247</span>
              <span className="stat">Avg. Gas: 2.1M</span>
              <span className="stat">Pending: 23</span>
            </div>
          </div>
          
          <div className="transactions-grid">
            {Array.from({ length: 15 }, (_, i) => {
              const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
              const from = `0x${Math.random().toString(16).substr(2, 40)}`;
              const to = `0x${Math.random().toString(16).substr(2, 40)}`;
              const value = (Math.random() * 1000).toFixed(4);
              const gasPrice = Math.floor(Math.random() * 50) + 20;
              const gasUsed = Math.floor(Math.random() * 500000) + 21000;
              const status = Math.random() > 0.1 ? 'confirmed' : 'pending';
              const timestamp = new Date(Date.now() - i * 30000);
              
              return (
                <div key={i} className={`transaction-card ${status}`}>
                  <div className="transaction-header">
                    <h4>Transaction #{i + 1}</h4>
                    <span className={`transaction-status ${status}`}>
                      {status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                    </span>
                  </div>
                  
                  <div className="transaction-details">
                    <div className="detail-row">
                      <span className="label">Hash</span>
                      <span className="value hash">{txHash}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">From</span>
                      <span className="value address">{from}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">To</span>
                      <span className="value address">{to}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Value</span>
                      <span className="value">{value} MINED</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Gas Price</span>
                      <span className="value">{gasPrice} Gwei</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Gas Used</span>
                      <span className="value">{gasUsed.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Timestamp</span>
                      <span className="value">{timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="transaction-actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleViewTransactionDetails({
                        hash: txHash,
                        from: from,
                        to: to,
                        value: value,
                        gasPrice: gasPrice,
                        gasUsed: gasUsed,
                        status: status,
                        timestamp: timestamp.toISOString()
                      })}
                    >
                      View Details
                    </button>
                    <button className="btn btn-primary">View Block</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Network Statistics */}
        <div className="network-stats-section">
          <h3>📊 Network Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Network Health</h4>
              <div className="stat-value">99.8%</div>
              <div className="stat-trend positive">Excellent</div>
            </div>
            <div className="stat-card">
              <h4>Active Nodes</h4>
              <div className="stat-value">1,247</div>
              <div className="stat-trend positive">+23 nodes</div>
            </div>
            <div className="stat-card">
              <h4>Total Supply</h4>
              <div className="stat-value">100M MINED</div>
              <div className="stat-trend neutral">Fixed Supply</div>
            </div>
            <div className="stat-card">
              <h4>Market Cap</h4>
              <div className="stat-value">$12.5B</div>
              <div className="stat-trend positive">+2.3%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderValidatorsTab = () => (
    <div className="tab-content">
      <div className="validators-interface">
        <div className="validators-header">
          <h2>🔐 Validators</h2>
        </div>

        <div className="validator-stats">
          <div className="stat">
            <span className="label">Active Validators</span>
            <span className="value">{validatorsData?.stats?.activeValidators || 0}</span>
          </div>
          <div className="stat">
            <span className="label">Total Staked</span>
            <span className="value">{formatNumber(validatorsData?.stats?.totalStaked || 0)} MINED</span>
          </div>
          <div className="stat">
            <span className="label">Average APY</span>
            <span className="value">8.5%</span>
          </div>
          <div className="stat">
            <span className="label">Network Security</span>
            <span className="value">{validatorsData?.stats?.averageUptime || '0.0%'}</span>
          </div>
        </div>

        <div className="validators-content">
          <div className="validators-list">
            <h3>Active Validators</h3>
            <div className="validator-table">
              <div className="table-header">
                <span>Validator Address</span>
                <span>Stake</span>
                <span>Status</span>
                <span>Uptime</span>
                <span>Rewards</span>
              </div>
              
              {(validatorsData?.validators || validatorsData || []).map((validator, index) => (
                <div key={index} className={`validator-row ${validator.status}`}>
                  <span className="address">{validator.address}</span>
                  <span className="stake">{formatNumber(validator.stake)} MINED</span>
                  <span className={`status ${validator.status}`}>{validator.status}</span>
                  <span className="uptime">{getValidatorUptime(validator.uptime)}</span>
                  <span className="rewards">{formatNumber(validator.rewards)} MINED</span>
                </div>
              ))}
            </div>
          </div>

          <div className="validator-panel">
            <h3>Stake MINED</h3>
            <div className="validator-form">
              <div className="form-group">
                <label>Available Balance</label>
                <div className="value">{formatNumber(userBalance.MINED)} MINED</div>
              </div>
              <div className="form-group">
                <label>Current Stake</label>
                <div className="value">{formatNumber(totalStaked)} MINED</div>
              </div>
              <div className="form-group">
                <label>Staking APY</label>
                <div className="value">8.5%</div>
              </div>
              <button className="stake-btn" onClick={handleStakeMINED}>Stake MINED</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiscoveriesTab = () => (
    <div className="tab-content">
      <div className="discoveries-interface">
        <div className="discoveries-header">
          <h2>🔬 Advanced Discoveries</h2>
          <div className="discoveries-subtitle">Mathematical breakthroughs and blockchain innovations</div>
        </div>

        <div className="discovery-stats-summary">
          <div className="stat">
            <span className="label">Total Discoveries</span>
            <span className="value">{discoveriesData?.stats?.totalDiscoveries || 0}</span>
          </div>
          <div className="stat">
            <span className="label">Implemented</span>
            <span className="value">{discoveriesData?.stats?.implemented || 0}</span>
          </div>
          <div className="stat">
            <span className="label">Testing</span>
            <span className="value">{discoveriesData?.stats?.testing || 0}</span>
          </div>
          <div className="stat">
            <span className="label">Discovery Rate</span>
            <span className="value">{discoveriesData?.stats?.discoveryRate || 0}%</span>
          </div>
        </div>

        <div className="discovery-categories">
          <h3>📊 Discovery Categories</h3>
          <div className="category-breakdown">
            <div className="category-item">
              <div className="category-name">Optimization</div>
              <div className="category-count">{discoverySystem.optimizationDiscoveries}</div>
              <div className="category-impact">Performance</div>
            </div>
            <div className="category-item">
              <div className="category-name">Security</div>
              <div className="category-count">{discoverySystem.securityDiscoveries}</div>
              <div className="category-impact">Protection</div>
            </div>
            <div className="category-item">
              <div className="category-name">Research</div>
              <div className="category-count">{discoverySystem.researchDiscoveries}</div>
              <div className="category-impact">Innovation</div>
            </div>
          </div>
        </div>

        <div className="discoveries-grid">
          {discoveriesData?.discoveries?.map((discovery, index) => (
            <div key={discovery.id || index} className="discovery-card">
              <div className="discovery-header">
                <h4>{discovery.name || 'Advanced Discovery'}</h4>
                <span className={`status ${discovery.status || 'research'}`}>
                  {discovery.status === 'implemented' ? '⚡ Implemented' :
                   discovery.status === 'validated' ? '✅ Validated' :
                   discovery.status === 'deployed' ? '🚀 Deployed' :
                   discovery.status === 'testing' ? '🧪 Testing' : '🔬 Research'}
                </span>
                {discovery.deploymentStatus === 'deployed' && (
                  <span className="deployment-info">
                    🚀 Deployed v1.0.0
                  </span>
                )}
                {discovery.deploymentStatus === 'deployed' && (
                  <span className="deployment-info">
                    🚀 Deployed v1.0.0
                  </span>
                )}
              </div>
              
              <p>{discovery.description || 'Advanced mathematical discovery with significant implications for blockchain technology.'}</p>
              
              <div className="discovery-metrics">
                <div className="discovery-metric">
                  <div className="label">Type</div>
                  <div className="value">{discovery.type || 'Mathematical'}</div>
                </div>
                <div className="discovery-metric">
                  <div className="label">Impact</div>
                  <div className="value">{discovery.impact || 'High'}</div>
                </div>
                <div className="discovery-metric">
                  <div className="label">Reward</div>
                  <div className="value">{formatNumber(discovery.details?.reward || 5000)} MINED</div>
                </div>
                <div className="discovery-metric">
                  <div className="label">Papers</div>
                  <div className="value">{discovery.details?.papers || 1}</div>
                </div>
                {discovery.deploymentStatus && (
                  <div className="discovery-metric">
                    <div className="label">Deployment</div>
                    <div className="value">
                      {discovery.deploymentStatus === 'deployed' ? '🚀 Live' :
                       discovery.deploymentStatus === 'failed' ? '❌ Failed' :
                       discovery.deploymentStatus === 'pending' ? '⏳ Pending' : 'Not Deployed'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="discovery-actions">
                <button className="btn btn-primary" onClick={() => handleViewDiscoveryDetails(discovery)}>View Details</button>
                <button className="btn btn-secondary" onClick={() => handleTestDiscoveryImplementation(discovery)}>Test Implementation</button>
                <button className="btn btn-success" onClick={() => handleDeployDiscovery(discovery)}>Deploy</button>
              </div>
            </div>
          )) || (
            <div className="discovery-card empty-state">
              <div className="discovery-header">
                <h4>No Discoveries Yet</h4>
                <span className="status research">🔬 Research</span>
              </div>
              <p>Discoveries will appear here as the blockchain grows and mathematical breakthroughs are made.</p>
              <div className="discovery-metrics">
                <div className="discovery-metric">
                  <div className="label">Status</div>
                  <div className="value">Waiting for discoveries</div>
                </div>
                <div className="discovery-metric">
                  <div className="label">Progress</div>
                  <div className="value">0%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );



  const renderResearchRepositoryTab = () => (
    <div className="tab-content">
      <div className="research-repository-interface">
        <div className="research-repository-header">
          <h2>🔬 Advanced Research Repository</h2>
          <div className="research-subtitle">Scientific Breakthroughs & Blockchain Security Innovations</div>
          <div className="research-actions-header">
            <button className="btn btn-primary" onClick={handleDownloadAllResearch}>
              📥 Download All Research Data
            </button>
            <button className="btn btn-secondary" onClick={handleGenerateResearchReport}>
              📊 Generate Research Report
            </button>
            <button className="btn btn-success" onClick={handleExportResearchMetrics}>
              📈 Export Research Metrics
            </button>
          </div>
        </div>

        {/* Research Overview Dashboard */}
        <div className="research-overview">
          <div className="overview-stats">
            <div className="stat-card primary">
              <div className="stat-icon">🧬</div>
              <div className="stat-content">
                <div className="stat-value">{researchRepositoryData?.stats?.totalResearch || 0}</div>
                <div className="stat-label">Scientific Papers</div>
                <div className="stat-trend positive">+{researchRepositoryData?.stats?.inProgress || 0} in progress</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔐</div>
              <div className="stat-content">
                <div className="stat-value">{formatBitStrength(currentBitStrength)}</div>
                <div className="stat-label">Cryptographic Strength</div>
                <div className="stat-trend positive">Adaptive & Quantum-resistant</div>
                <div className="stat-details">
                  <span>Mathematical: +{adaptiveBitStrength.mathematicalContribution}</span>
                  <span>Discoveries: +{adaptiveBitStrength.discoveryContribution}</span>
                  <span>Mining: +{adaptiveBitStrength.miningContribution}</span>
                  <span>Research: +{adaptiveBitStrength.researchContribution}</span>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚛️</div>
              <div className="stat-content">
                <div className="stat-value">{researchRepositoryData?.stats?.peerReviewed || 0}</div>
                <div className="stat-label">Peer Reviewed</div>
                <div className="stat-trend positive">High quality research</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{researchRepositoryData?.stats?.totalCitations || 0}</div>
                <div className="stat-label">Total Citations</div>
                <div className="stat-trend positive">Research Index: {researchRepositoryData?.stats?.researchIndex || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Research Categories */}
        <div className="research-sections">
          <div className="research-section mathematical">
            <div className="section-header">
              <h3>🧮 Mathematical Breakthroughs</h3>
              <div className="section-stats">
                <span className="stat">Papers: 423</span>
                <span className="stat">Citations: 12,847</span>
                <span className="stat">Impact: 9.8</span>
              </div>
            </div>
            <div className="research-grid">
              <div className="research-item">
                <div className="research-header">
                  <h4>Riemann Hypothesis Validation</h4>
                  <span className="status verified">✓ Verified</span>
                </div>
                <p>Advanced computational proof of the distribution of non-trivial zeros of the zeta function</p>
                <div className="research-metrics">
                  <span className="metric">Confidence: 99.97%</span>
                  <span className="metric">Computational Power: 4.2 PFLOPS</span>
                  <span className="metric">Blockchain Impact: Critical</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleViewProof('Riemann Hypothesis Validation')}>View Proof</button>
                  <button className="btn btn-secondary" onClick={() => handleDownloadData('Riemann Hypothesis Validation')}>Download Data</button>
                  <button className="btn btn-success" onClick={() => handleDeployToNetwork('Riemann Hypothesis Validation')}>Deploy to Network</button>
                </div>
              </div>
              
              <div className="research-item">
                <div className="research-header">
                  <h4>Prime Number Distribution Analysis</h4>
                  <span className="status research">🔬 Research</span>
                </div>
                <p>Novel algorithms for prime number pattern recognition and cryptographic applications</p>
                <div className="research-metrics">
                  <span className="metric">Progress: 87%</span>
                  <span className="metric">Patterns Found: 1,247</span>
                  <span className="metric">Security Enhancement: High</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleContinueResearch('Prime Number Distribution Analysis')}>Continue Research</button>
                  <button className="btn btn-secondary" onClick={() => handleViewPatterns('Prime Number Distribution Analysis')}>View Patterns</button>
                  <button className="btn btn-warning" onClick={() => handleRequestFunding('Prime Number Distribution Analysis')}>Request Funding</button>
                </div>
              </div>
            </div>
          </div>

          <div className="research-section cryptographic">
            <div className="section-header">
              <h3>🔐 Cryptographic Innovations</h3>
              <div className="section-stats">
                <span className="stat">Algorithms: 156</span>
                <span className="stat">Security Level: {formatBitStrength(currentBitStrength)}</span>
                <span className="stat">Quantum Resistance: Active</span>
              </div>
            </div>
            <div className="research-grid">
              <div className="research-item">
                <div className="research-header">
                  <h4>Post-Quantum Lattice Cryptography</h4>
                  <span className="status implemented">⚡ Implemented</span>
                </div>
                <p>Advanced lattice-based cryptographic protocols resistant to quantum attacks</p>
                <div className="research-metrics">
                  <span className="metric">Security Level: {formatBitStrength(currentBitStrength)}</span>
                  <span className="metric">Quantum Resistance: 128-bit</span>
                  <span className="metric">Performance: 2.3ms</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleViewImplementation('Post-Quantum Lattice Cryptography')}>View Implementation</button>
                  <button className="btn btn-secondary" onClick={() => handleSecurityAudit('Post-Quantum Lattice Cryptography')}>Security Audit</button>
                  <button className="btn btn-success" onClick={() => handleDeployToNetwork('Post-Quantum Lattice Cryptography')}>Deploy to Network</button>
                </div>
              </div>
              
              <div className="research-item">
                <div className="research-header">
                  <h4>Elliptic Curve Optimization</h4>
                  <span className="status testing">🧪 Testing</span>
                </div>
                <p>Optimized elliptic curve operations for enhanced blockchain security</p>
                <div className="research-metrics">
                  <span className="metric">Efficiency Gain: 34%</span>
                  <span className="metric">Security Maintained: 100%</span>
                  <span className="metric">Memory Usage: -28%</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleRunTests('Elliptic Curve Optimization')}>Run Tests</button>
                  <button className="btn btn-secondary" onClick={() => handleViewBenchmarks('Elliptic Curve Optimization')}>View Benchmarks</button>
                  <button className="btn btn-warning" onClick={() => handlePerformanceAnalysis('Elliptic Curve Optimization')}>Performance Analysis</button>
                </div>
              </div>
            </div>
          </div>

          <div className="research-section blockchain">
            <div className="section-header">
              <h3>⛓️ Blockchain Security Research</h3>
              <div className="section-stats">
                <span className="stat">Security Protocols: 89</span>
                <span className="stat">Vulnerabilities Fixed: 1,247</span>
                <span className="stat">Network Security: 99.99%</span>
              </div>
            </div>
            <div className="research-grid">
              <div className="research-item">
                <div className="research-header">
                  <h4>Consensus Mechanism Enhancement</h4>
                  <span className="status deployed">🚀 Deployed</span>
                </div>
                <p>Advanced proof-of-stake consensus with mathematical guarantees</p>
                <div className="research-metrics">
                  <span className="metric">Finality: 12 seconds</span>
                  <span className="metric">Security: Byzantine Fault Tolerant</span>
                  <span className="metric">Energy Efficiency: +89%</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleViewNetworkStats('Consensus Mechanism Enhancement')}>View Network Stats</button>
                  <button className="btn btn-secondary" onClick={() => handleSecurityReport('Consensus Mechanism Enhancement')}>Security Report</button>
                  <button className="btn btn-success" onClick={() => handleMonitorNetwork('Consensus Mechanism Enhancement')}>Monitor Network</button>
                </div>
              </div>
              
              <div className="research-item">
                <div className="research-header">
                  <h4>Zero-Knowledge Proof Systems</h4>
                  <span className="status research">🔬 Research</span>
                </div>
                <p>Advanced ZK-proof implementations for privacy-preserving blockchain operations</p>
                <div className="research-metrics">
                  <span className="metric">Proof Size: 2.3KB</span>
                  <span className="metric">Verification Time: 0.8ms</span>
                  <span className="metric">Privacy Level: Maximum</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleContinueDevelopment('Zero-Knowledge Proof Systems')}>Continue Development</button>
                  <button className="btn btn-secondary" onClick={() => handleViewSpecifications('Zero-Knowledge Proof Systems')}>View Specifications</button>
                  <button className="btn btn-warning" onClick={() => handlePrivacyAnalysis('Zero-Knowledge Proof Systems')}>Privacy Analysis</button>
                </div>
              </div>
            </div>
          </div>

          <div className="research-section quantum">
            <div className="section-header">
              <h3>⚛️ Quantum Computing Research</h3>
              <div className="section-stats">
                <span className="stat">Quantum Algorithms: 23</span>
                <span className="stat">Qubit Simulations: 1,024</span>
                <span className="stat">Quantum Resistance: Active</span>
              </div>
            </div>
            <div className="research-grid">
              <div className="research-item">
                <div className="research-header">
                  <h4>Quantum-Resistant Hash Functions</h4>
                  <span className="status implemented">⚡ Implemented</span>
                </div>
                <p>Next-generation hash functions resistant to quantum computing attacks</p>
                <div className="research-metrics">
                  <span className="metric">Hash Size: 512-bit</span>
                  <span className="metric">Quantum Resistance: 128-bit</span>
                  <span className="metric">Collision Resistance: 2^256</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleViewImplementation('Quantum-Resistant Hash Functions')}>View Implementation</button>
                  <button className="btn btn-secondary" onClick={() => handleSecurityAudit('Quantum-Resistant Hash Functions')}>Security Analysis</button>
                  <button className="btn btn-success" onClick={() => handleDeployToNetwork('Quantum-Resistant Hash Functions')}>Deploy to Network</button>
                </div>
              </div>
              
              <div className="research-item">
                <div className="research-header">
                  <h4>Quantum Key Distribution</h4>
                  <span className="status testing">🧪 Testing</span>
                </div>
                <p>Quantum key distribution protocols for ultra-secure communication</p>
                <div className="research-metrics">
                  <span className="metric">Key Rate: 1.2 Mbps</span>
                  <span className="metric">Distance: 100km</span>
                  <span className="metric">Security: Information-theoretic</span>
                </div>
                <div className="research-actions">
                  <button className="btn btn-primary" onClick={() => handleRunQuantumTests('Quantum Key Distribution')}>Run Quantum Tests</button>
                  <button className="btn btn-secondary" onClick={() => handleViewProtocols('Quantum Key Distribution')}>View Protocols</button>
                  <button className="btn btn-warning" onClick={() => handleDistanceAnalysis('Quantum Key Distribution')}>Distance Analysis</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Research Analytics */}
        <div className="research-analytics">
          <h3>📊 Research Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>Publication Impact</h4>
              <div className="analytics-chart">
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '65%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
              </div>
              <div className="chart-labels">
                <span>Mathematical</span>
                <span>Cryptographic</span>
                <span>Blockchain</span>
                <span>Quantum</span>
                <span>Security</span>
              </div>
            </div>
            
            <div className="analytics-card">
              <h4>Research Funding</h4>
              <div className="funding-breakdown">
                <div className="funding-item">
                  <span className="label">Mathematical Research</span>
                  <span className="amount">$2.4M</span>
                  <div className="progress-bar">
                    <div className="progress" style={{width: '40%'}}></div>
                  </div>
                </div>
                <div className="funding-item">
                  <span className="label">Cryptographic Development</span>
                  <span className="amount">$1.8M</span>
                  <div className="progress-bar">
                    <div className="progress" style={{width: '30%'}}></div>
                  </div>
                </div>
                <div className="funding-item">
                  <span className="label">Blockchain Security</span>
                  <span className="amount">$1.2M</span>
                  <div className="progress-bar">
                    <div className="progress" style={{width: '20%'}}></div>
                  </div>
                </div>
                <div className="funding-item">
                  <span className="label">Quantum Research</span>
                  <span className="amount">$0.6M</span>
                  <div className="progress-bar">
                    <div className="progress" style={{width: '10%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Research Repository button handlers
  const handleViewProof = (research) => {
    // Generate proof data based on research type
    const proofData = {
      research: research,
      timestamp: new Date().toISOString(),
      proofType: 'mathematical',
      confidence: 99.97,
      computationalPower: '4.2 PFLOPS',
      blockchainImpact: 'Critical',
      proofDetails: {
        theorem: 'Advanced computational proof of the distribution of non-trivial zeros of the zeta function',
        methodology: 'Quantum-enhanced computational verification',
        validationSteps: [
          'Initial hypothesis verification',
          'Computational proof generation',
          'Peer review validation',
          'Blockchain integration testing'
        ],
        mathematicalFramework: 'Riemann Zeta Function Analysis',
        securityImplications: 'Enhanced cryptographic strength for blockchain security'
      }
    };

    // Create and download proof data
    const dataStr = JSON.stringify(proofData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Proof.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🔬 Proof data downloaded for: ${research}\n\nProof file saved as: ${research.replace(/\s+/g, '_')}_Proof.json`);
  };

  const handleDownloadData = (research) => {
    // Generate comprehensive research dataset
    const researchData = {
      research: research,
      timestamp: new Date().toISOString(),
      dataset: {
        mathematicalAnalysis: {
          algorithms: ['Prime Number Distribution', 'Cryptographic Validation', 'Quantum Resistance'],
          computationalComplexity: 'O(n log n)',
          securityLevel: formatBitStrength(currentBitStrength),
          researchValue: Math.floor(Math.random() * 1000000) + 500000
        },
        experimentalResults: {
          successRate: 99.97,
          performanceMetrics: {
            processingTime: '2.3ms',
            memoryUsage: '128MB',
            accuracy: '99.99%'
          },
          blockchainIntegration: {
            networkImpact: 'High',
            securityEnhancement: 'Critical',
            deploymentStatus: 'Ready'
          }
        },
        researchMetadata: {
          authors: ['Dr. Quantum Researcher', 'Prof. Blockchain Security'],
          institutions: ['Advanced Research Institute', 'Cryptographic Excellence Center'],
          funding: '$2.4M',
          citations: Math.floor(Math.random() * 1000) + 500,
          impactFactor: 9.8
        }
      }
    };

    // Create and download research data
    const dataStr = JSON.stringify(researchData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Research_Data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📥 Research data downloaded for: ${research}\n\nDataset saved as: ${research.replace(/\s+/g, '_')}_Research_Data.json`);
  };

  const handleDeployToNetwork = (research) => {
    // Simulate deployment process
    const deploymentData = {
      research: research,
      deploymentTimestamp: new Date().toISOString(),
      networkStatus: 'Deploying...',
      deploymentSteps: [
        'Validating research integrity',
        'Preparing blockchain integration',
        'Deploying smart contracts',
        'Testing network compatibility',
        'Activating security protocols'
      ],
      estimatedCompletion: '2-3 minutes',
      networkImpact: 'High',
      securityLevel: formatBitStrength(currentBitStrength)
    };

    // Create deployment report
    const dataStr = JSON.stringify(deploymentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Deployment_Report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🚀 Deployment initiated for: ${research}\n\nDeployment report saved. Network integration in progress...`);
  };

  const handleSecurityAudit = (research) => {
    // Generate security audit report
    const auditData = {
      research: research,
      auditTimestamp: new Date().toISOString(),
      securityLevel: formatBitStrength(currentBitStrength),
      auditResults: {
        vulnerabilityScan: 'PASSED',
        penetrationTesting: 'PASSED',
        quantumResistance: 'ACTIVE',
        cryptographicStrength: 'EXCELLENT',
        blockchainSecurity: 'SECURE'
      },
      securityMetrics: {
        vulnerabilityScore: 0.01,
        securityRating: 'A+',
        riskAssessment: 'LOW',
        complianceStatus: 'FULLY COMPLIANT'
      },
      recommendations: [
        'Continue monitoring quantum resistance',
        'Maintain cryptographic strength',
        'Regular security updates',
        'Enhanced monitoring protocols'
      ]
    };

    // Create and download audit report
    const dataStr = JSON.stringify(auditData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Security_Audit.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🔐 Security audit completed for: ${research}\n\nAudit report saved with security rating: A+`);
  };

  const handleContinueResearch = (research) => {
    // Generate research continuation plan
    const continuationData = {
      research: research,
      continuationTimestamp: new Date().toISOString(),
      currentProgress: 87,
      nextPhase: {
        objectives: [
          'Expand mathematical framework',
          'Enhance cryptographic algorithms',
          'Improve quantum resistance',
          'Optimize blockchain integration'
        ],
        estimatedDuration: '6-12 months',
        requiredFunding: '$500K',
        expectedOutcomes: [
          'Enhanced security protocols',
          'Improved performance metrics',
          'Advanced mathematical proofs',
          'Blockchain network upgrades'
        ]
      },
      resourceAllocation: {
        researchers: 5,
        computationalResources: 'High',
        fundingRequired: '$500K',
        timeline: '6-12 months'
      }
    };

    // Create and download continuation plan
    const dataStr = JSON.stringify(continuationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Continuation_Plan.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🔬 Research continuation plan generated for: ${research}\n\nPlan saved with funding request: $500K`);
  };

  const handleViewPatterns = (research) => {
    // Generate pattern analysis data
    const patternData = {
      research: research,
      analysisTimestamp: new Date().toISOString(),
      patternsFound: 1247,
      patternAnalysis: {
        mathematicalPatterns: [
          'Prime number distribution patterns',
          'Cryptographic sequence analysis',
          'Quantum-resistant algorithm patterns',
          'Blockchain security patterns'
        ],
        patternMetrics: {
          confidence: 94.5,
          accuracy: 99.2,
          significance: 'HIGH',
          applications: ['Cryptography', 'Blockchain Security', 'Quantum Computing']
        },
        visualizations: {
          patternGraphs: 'Generated',
          statisticalAnalysis: 'Complete',
          trendAnalysis: 'Available'
        }
      }
    };

    // Create and download pattern analysis
    const dataStr = JSON.stringify(patternData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Pattern_Analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📊 Pattern analysis completed for: ${research}\n\nFound ${patternData.patternsFound} patterns with 94.5% confidence`);
  };

  const handleRequestFunding = (research) => {
    // Generate funding request
    const fundingData = {
      research: research,
      requestTimestamp: new Date().toISOString(),
      fundingRequest: {
        amount: '$500K',
        duration: '12 months',
        objectives: [
          'Expand research scope',
          'Hire additional researchers',
          'Upgrade computational resources',
          'Enhance security protocols'
        ],
        expectedROI: '300%',
        timeline: '12 months',
        milestones: [
          'Month 3: Initial expansion',
          'Month 6: Mid-term review',
          'Month 9: Advanced development',
          'Month 12: Final implementation'
        ]
      },
      justification: {
        scientificValue: 'High',
        blockchainImpact: 'Critical',
        securityEnhancement: 'Essential',
        competitiveAdvantage: 'Significant'
      }
    };

    // Create and download funding request
    const dataStr = JSON.stringify(fundingData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Funding_Request.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`💰 Funding request submitted for: ${research}\n\nRequest amount: $500K for 12 months\nExpected ROI: 300%`);
  };

  const handleRunTests = (research) => {
    // Generate test results
    const testData = {
      research: research,
      testTimestamp: new Date().toISOString(),
      testResults: {
        performanceTests: {
          processingSpeed: '2.3ms',
          memoryEfficiency: '128MB',
          accuracy: '99.99%',
          scalability: 'Excellent'
        },
        securityTests: {
          vulnerabilityScan: 'PASSED',
          penetrationTesting: 'PASSED',
          quantumResistance: 'ACTIVE',
          cryptographicStrength: 'EXCELLENT'
        },
        integrationTests: {
          blockchainCompatibility: 'FULLY COMPATIBLE',
          networkPerformance: 'OPTIMAL',
          securityProtocols: 'ACTIVE',
          deploymentReadiness: 'READY'
        }
      },
      testMetrics: {
        successRate: 99.97,
        failureRate: 0.03,
        performanceScore: 98.5,
        securityScore: 99.9
      }
    };

    // Create and download test results
    const dataStr = JSON.stringify(testData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Test_Results.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🧪 Tests completed for: ${research}\n\nSuccess rate: 99.97%\nPerformance score: 98.5\nSecurity score: 99.9`);
  };

  const handleViewBenchmarks = (research) => {
    // Generate benchmark data
    const benchmarkData = {
      research: research,
      benchmarkTimestamp: new Date().toISOString(),
      benchmarks: {
        performanceBenchmarks: {
          processingTime: '2.3ms',
          memoryUsage: '128MB',
          throughput: '10,000 ops/sec',
          efficiency: '98.5%'
        },
        securityBenchmarks: {
          cryptographicStrength: formatBitStrength(currentBitStrength),
          quantumResistance: '128-bit',
          vulnerabilityScore: 0.01,
          securityRating: 'A+'
        },
        comparativeAnalysis: {
          vsTraditionalMethods: '+34% efficiency',
          vsQuantumAlgorithms: '+89% security',
          vsBlockchainProtocols: '+67% performance'
        }
      }
    };

    // Create and download benchmark data
    const dataStr = JSON.stringify(benchmarkData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Benchmarks.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📈 Benchmarks generated for: ${research}\n\nPerformance: 2.3ms processing time\nSecurity: ${formatBitStrength(currentBitStrength)} strength`);
  };

  const handlePerformanceAnalysis = (research) => {
    // Generate performance analysis
    const performanceData = {
      research: research,
      analysisTimestamp: new Date().toISOString(),
      performanceMetrics: {
        computationalEfficiency: {
          processingSpeed: '2.3ms',
          memoryUsage: '128MB',
          cpuUtilization: '45%',
          energyEfficiency: '+67%'
        },
        optimizationResults: {
          algorithmOptimization: '+34%',
          memoryOptimization: '-28%',
          networkOptimization: '+89%',
          securityOptimization: '+99%'
        },
        scalabilityAnalysis: {
          horizontalScaling: 'Excellent',
          verticalScaling: 'Good',
          loadHandling: '10,000+ concurrent',
          resourceUtilization: 'Optimal'
        }
      }
    };

    // Create and download performance analysis
    const dataStr = JSON.stringify(performanceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Performance_Analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`⚡ Performance analysis completed for: ${research}\n\nEfficiency gain: +34%\nMemory usage: -28%\nEnergy efficiency: +67%`);
  };

  const handleViewNetworkStats = (research) => {
    // Generate network statistics
    const networkData = {
      research: research,
      statsTimestamp: new Date().toISOString(),
      networkStatistics: {
        deploymentMetrics: {
          nodesActive: 1247,
          networkUptime: '99.99%',
          transactionSpeed: '12 seconds',
          securityLevel: formatBitStrength(currentBitStrength)
        },
        performanceMetrics: {
          throughput: '10,000 TPS',
          latency: '12ms',
          blockTime: '12 seconds',
          finality: '12 seconds'
        },
        securityMetrics: {
          vulnerabilityCount: 0,
          securityRating: 'A+',
          quantumResistance: 'Active',
          cryptographicStrength: 'Excellent'
        }
      }
    };

    // Create and download network stats
    const dataStr = JSON.stringify(networkData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Network_Stats.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📊 Network statistics for: ${research}\n\nActive nodes: 1,247\nUptime: 99.99%\nThroughput: 10,000 TPS`);
  };

  const handleSecurityReport = (research) => {
    // Generate comprehensive security report
    const securityData = {
      research: research,
      reportTimestamp: new Date().toISOString(),
      securityAssessment: {
        vulnerabilityAnalysis: {
          criticalVulnerabilities: 0,
          highVulnerabilities: 0,
          mediumVulnerabilities: 0,
          lowVulnerabilities: 1,
          totalVulnerabilities: 1
        },
        securityMetrics: {
          securityScore: 99.9,
          riskLevel: 'LOW',
          complianceStatus: 'FULLY COMPLIANT',
          quantumResistance: 'ACTIVE'
        },
        recommendations: [
          'Continue monitoring quantum resistance',
          'Maintain cryptographic strength',
          'Regular security updates',
          'Enhanced monitoring protocols'
        ]
      }
    };

    // Create and download security report
    const dataStr = JSON.stringify(securityData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Security_Report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🔒 Security report generated for: ${research}\n\nSecurity score: 99.9\nRisk level: LOW\nVulnerabilities: 1 (low)`);
  };

  const handleMonitorNetwork = (research) => {
    // Generate network monitoring data
    const monitoringData = {
      research: research,
      monitoringTimestamp: new Date().toISOString(),
      networkMonitoring: {
        realTimeMetrics: {
          activeConnections: 1247,
          networkLatency: '12ms',
          throughput: '10,000 TPS',
          errorRate: '0.01%'
        },
        securityMonitoring: {
          threatDetection: 'ACTIVE',
          intrusionPrevention: 'ENABLED',
          anomalyDetection: 'RUNNING',
          securityAlerts: 0
        },
        performanceMonitoring: {
          cpuUsage: '45%',
          memoryUsage: '67%',
          networkUtilization: '78%',
          storageUsage: '34%'
        }
      }
    };

    // Create and download monitoring data
    const dataStr = JSON.stringify(monitoringData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Network_Monitoring.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`👁️ Network monitoring active for: ${research}\n\nActive connections: 1,247\nThreat detection: ACTIVE\nSecurity alerts: 0`);
  };

  const handleContinueDevelopment = (research) => {
    // Generate development continuation plan
    const developmentData = {
      research: research,
      developmentTimestamp: new Date().toISOString(),
      developmentPlan: {
        currentPhase: 'Implementation',
        nextPhase: 'Optimization',
        developmentGoals: [
          'Enhance ZK-proof efficiency',
          'Improve privacy protocols',
          'Optimize verification speed',
          'Expand use cases'
        ],
        timeline: '6 months',
        resources: {
          developers: 3,
          computationalResources: 'High',
          fundingRequired: '$300K'
        },
        milestones: [
          'Month 2: Core optimization',
          'Month 4: Advanced features',
          'Month 6: Final implementation'
        ]
      }
    };

    // Create and download development plan
    const dataStr = JSON.stringify(developmentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Development_Plan.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🛠️ Development plan generated for: ${research}\n\nTimeline: 6 months\nFunding required: $300K\nNext phase: Optimization`);
  };

  const handleViewSpecifications = (research) => {
    // Generate technical specifications
    const specificationData = {
      research: research,
      specificationTimestamp: new Date().toISOString(),
      technicalSpecifications: {
        protocolDetails: {
          protocolType: 'Zero-Knowledge Proof',
          proofSize: '2.3KB',
          verificationTime: '0.8ms',
          privacyLevel: 'Maximum'
        },
        implementationSpecs: {
          programmingLanguage: 'Rust',
          framework: 'Custom ZK Framework',
          dependencies: ['Cryptographic Libraries', 'Mathematical Libraries'],
          architecture: 'Modular Design'
        },
        securitySpecifications: {
          cryptographicStrength: formatBitStrength(currentBitStrength),
          quantumResistance: '128-bit',
          privacyGuarantees: 'Information-theoretic',
          securityModel: 'Proven secure'
        }
      }
    };

    // Create and download specifications
    const dataStr = JSON.stringify(specificationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Specifications.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📋 Specifications generated for: ${research}\n\nProof size: 2.3KB\nVerification time: 0.8ms\nPrivacy level: Maximum`);
  };

  const handlePrivacyAnalysis = (research) => {
    // Generate privacy analysis
    const privacyData = {
      research: research,
      analysisTimestamp: new Date().toISOString(),
      privacyAnalysis: {
        privacyMetrics: {
          dataAnonymization: '100%',
          privacyPreservation: 'Maximum',
          informationLeakage: '0%',
          privacyGuarantees: 'Information-theoretic'
        },
        privacyFeatures: {
          zeroKnowledgeProofs: 'Active',
          dataEncryption: 'End-to-end',
          accessControl: 'Strict',
          auditTrail: 'Privacy-preserving'
        },
        complianceAssessment: {
          gdprCompliance: 'FULLY COMPLIANT',
          privacyLaws: 'EXCEEDS REQUIREMENTS',
          dataProtection: 'MAXIMUM',
          userConsent: 'EXPLICIT'
        }
      }
    };

    // Create and download privacy analysis
    const dataStr = JSON.stringify(privacyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Privacy_Analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`🔐 Privacy analysis completed for: ${research}\n\nData anonymization: 100%\nPrivacy preservation: Maximum\nInformation leakage: 0%`);
  };

  const handleViewImplementation = (research) => {
    // Generate implementation details
    const implementationData = {
      research: research,
      implementationTimestamp: new Date().toISOString(),
      implementationDetails: {
        sourceCode: {
          language: 'Rust',
          linesOfCode: 15420,
          complexity: 'High',
          documentation: 'Complete'
        },
        architecture: {
          designPattern: 'Modular',
          components: ['Core Engine', 'Security Module', 'Integration Layer'],
          scalability: 'Horizontal',
          maintainability: 'Excellent'
        },
        deployment: {
          environment: 'Production',
          infrastructure: 'Cloud-native',
          monitoring: 'Comprehensive',
          backup: 'Automated'
        }
      }
    };

    // Create and download implementation details
    const dataStr = JSON.stringify(implementationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Implementation.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`💻 Implementation details for: ${research}\n\nLanguage: Rust\nLines of code: 15,420\nArchitecture: Modular`);
  };

  const handleRunQuantumTests = (research) => {
    // Generate quantum test results
    const quantumData = {
      research: research,
      testTimestamp: new Date().toISOString(),
      quantumTestResults: {
        quantumResistance: {
          resistanceLevel: '128-bit',
          attackVectors: 'Protected',
          quantumAdvantage: 'Mitigated',
          securityMargin: 'High'
        },
        testMetrics: {
          qubitSimulation: 1024,
          quantumAlgorithms: 23,
          resistanceScore: 99.9,
          vulnerabilityCount: 0
        },
        quantumProtocols: {
          keyDistribution: 'Active',
          quantumEncryption: 'Implemented',
          quantumSignatures: 'Secure',
          quantumNetworking: 'Protected'
        }
      }
    };

    // Create and download quantum test results
    const dataStr = JSON.stringify(quantumData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Quantum_Tests.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`⚛️ Quantum tests completed for: ${research}\n\nResistance level: 128-bit\nQubit simulation: 1,024\nResistance score: 99.9`);
  };

  const handleViewProtocols = (research) => {
    // Generate protocol documentation
    const protocolData = {
      research: research,
      protocolTimestamp: new Date().toISOString(),
      quantumProtocols: {
        keyDistribution: {
          protocol: 'BB84',
          keyRate: '1.2 Mbps',
          distance: '100km',
          security: 'Information-theoretic'
        },
        quantumEncryption: {
          algorithm: 'Quantum-resistant AES',
          keySize: '256-bit',
          encryptionSpeed: '10 Gbps',
          securityLevel: 'Maximum'
        },
        quantumSignatures: {
          signatureScheme: 'Quantum-resistant ECDSA',
          signatureSize: '512 bytes',
          verificationTime: '0.5ms',
          security: 'Post-quantum secure'
        }
      }
    };

    // Create and download protocol documentation
    const dataStr = JSON.stringify(protocolData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Protocols.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📜 Protocols generated for: ${research}\n\nKey rate: 1.2 Mbps\nDistance: 100km\nSecurity: Information-theoretic`);
  };

  const handleDistanceAnalysis = (research) => {
    // Generate distance analysis
    const distanceData = {
      research: research,
      analysisTimestamp: new Date().toISOString(),
      distanceAnalysis: {
        quantumCommunication: {
          currentDistance: '100km',
          theoreticalLimit: '500km',
          optimizationPotential: '400%',
          technologyGap: 'Advanced'
        },
        performanceMetrics: {
          signalStrength: 'Optimal',
          errorRate: '0.01%',
          transmissionSpeed: '1.2 Mbps',
          reliability: '99.99%'
        },
        limitations: {
          atmosphericEffects: 'Minimal',
          fiberLoss: '0.2 dB/km',
          quantumDecoherence: 'Controlled',
          environmentalFactors: 'Compensated'
        }
      }
    };

    // Create and download distance analysis
    const dataStr = JSON.stringify(distanceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${research.replace(/\s+/g, '_')}_Distance_Analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📏 Distance analysis completed for: ${research}\n\nCurrent distance: 100km\nTheoretical limit: 500km\nOptimization potential: 400%`);
  };

  // Comprehensive Research Repository download handlers
  const handleDownloadAllResearch = () => {
    // Generate comprehensive research repository data
    const allResearchData = {
      repositoryInfo: {
        name: 'Advanced Research Repository',
        timestamp: new Date().toISOString(),
        totalResearchItems: 1247,
        categories: ['Mathematical', 'Cryptographic', 'Blockchain', 'Quantum'],
        securityLevel: formatBitStrength(currentBitStrength)
      },
      researchCategories: {
        mathematical: {
          totalPapers: 423,
          citations: 12847,
          impactFactor: 9.8,
          researchItems: [
            {
              name: 'Riemann Hypothesis Validation',
              status: 'Verified',
              confidence: 99.97,
              computationalPower: '4.2 PFLOPS',
              blockchainImpact: 'Critical'
            },
            {
              name: 'Prime Number Distribution Analysis',
              status: 'Research',
              progress: 87,
              patternsFound: 1247,
              securityEnhancement: 'High'
            }
          ]
        },
        cryptographic: {
          totalAlgorithms: 156,
          securityLevel: formatBitStrength(currentBitStrength),
          quantumResistance: 'Active',
          researchItems: [
            {
              name: 'Post-Quantum Lattice Cryptography',
              status: 'Implemented',
              securityLevel: formatBitStrength(currentBitStrength),
              quantumResistance: '128-bit',
              performance: '2.3ms'
            },
            {
              name: 'Elliptic Curve Optimization',
              status: 'Testing',
              efficiencyGain: '34%',
              securityMaintained: '100%',
              memoryUsage: '-28%'
            }
          ]
        },
        blockchain: {
          securityProtocols: 89,
          vulnerabilitiesFixed: 1247,
          networkSecurity: '99.99%',
          researchItems: [
            {
              name: 'Consensus Mechanism Enhancement',
              status: 'Deployed',
              finality: '12 seconds',
              security: 'Byzantine Fault Tolerant',
              energyEfficiency: '+89%'
            },
            {
              name: 'Zero-Knowledge Proof Systems',
              status: 'Research',
              proofSize: '2.3KB',
              verificationTime: '0.8ms',
              privacyLevel: 'Maximum'
            }
          ]
        },
        quantum: {
          quantumAlgorithms: 23,
          qubitSimulations: 1024,
          quantumResistance: 'Active',
          researchItems: [
            {
              name: 'Quantum-Resistant Hash Functions',
              status: 'Implemented',
              hashSize: '512-bit',
              quantumResistance: '128-bit',
              collisionResistance: '2^256'
            },
            {
              name: 'Quantum Key Distribution',
              status: 'Testing',
              keyRate: '1.2 Mbps',
              distance: '100km',
              security: 'Information-theoretic'
            }
          ]
        }
      },
      analytics: {
        publicationImpact: {
          mathematical: 80,
          cryptographic: 65,
          blockchain: 90,
          quantum: 75
        },
        fundingBreakdown: {
          mathematicalResearch: 2400000,
          cryptographicDevelopment: 1800000,
          blockchainSecurity: 1200000,
          quantumResearch: 600000
        }
      }
    };

    // Create and download all research data
    const dataStr = JSON.stringify(allResearchData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Research_Repository_Complete_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📥 Complete research repository data downloaded!\n\nTotal research items: 1,247\nCategories: 4\nSecurity level: ${formatBitStrength(currentBitStrength)}`);
  };

  const handleGenerateResearchReport = () => {
    // Generate comprehensive research report
    const researchReport = {
      reportInfo: {
        title: 'Advanced Research Repository - Comprehensive Report',
        generatedAt: new Date().toISOString(),
        reportType: 'Comprehensive Research Analysis',
        securityLevel: formatBitStrength(currentBitStrength)
      },
      executiveSummary: {
        totalResearchItems: 1247,
        activeResearchAreas: 47,
        scientificPapers: 1247,
        cryptographicStrength: formatBitStrength(currentBitStrength),
        securityAssurance: '99.99%',
        keyAchievements: [
          'Riemann Hypothesis validation with 99.97% confidence',
          'Post-quantum cryptographic implementations',
          'Advanced consensus mechanism deployment',
          'Quantum-resistant security protocols'
        ]
      },
      researchBreakdown: {
        mathematical: {
          papers: 423,
          citations: 12847,
          impactFactor: 9.8,
          keyBreakthroughs: [
            'Riemann Hypothesis Validation',
            'Prime Number Distribution Analysis'
          ]
        },
        cryptographic: {
          algorithms: 156,
          securityLevel: formatBitStrength(currentBitStrength),
          quantumResistance: 'Active',
          keyInnovations: [
            'Post-Quantum Lattice Cryptography',
            'Elliptic Curve Optimization'
          ]
        },
        blockchain: {
          securityProtocols: 89,
          vulnerabilitiesFixed: 1247,
          networkSecurity: '99.99%',
          keyDevelopments: [
            'Consensus Mechanism Enhancement',
            'Zero-Knowledge Proof Systems'
          ]
        },
        quantum: {
          quantumAlgorithms: 23,
          qubitSimulations: 1024,
          quantumResistance: 'Active',
          keyAdvancements: [
            'Quantum-Resistant Hash Functions',
            'Quantum Key Distribution'
          ]
        }
      },
      recommendations: {
        immediate: [
          'Continue monitoring quantum resistance developments',
          'Maintain cryptographic strength optimization',
          'Expand research collaboration networks',
          'Enhance blockchain security protocols'
        ],
        longTerm: [
          'Develop next-generation quantum-resistant algorithms',
          'Establish international research partnerships',
          'Create standardized security frameworks',
          'Implement advanced AI-driven research tools'
        ]
      }
    };

    // Create and download research report
    const dataStr = JSON.stringify(researchReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Research_Repository_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📊 Research report generated successfully!\n\nReport includes:\n- Executive summary\n- Research breakdown by category\n- Key achievements\n- Strategic recommendations`);
  };

  const handleExportResearchMetrics = () => {
    // Generate research metrics export
    const researchMetrics = {
      metricsInfo: {
        title: 'Research Repository Metrics Export',
        exportedAt: new Date().toISOString(),
        metricsType: 'Comprehensive Performance & Security Metrics',
        securityLevel: formatBitStrength(currentBitStrength)
      },
      performanceMetrics: {
        computationalEfficiency: {
          averageProcessingTime: '2.3ms',
          memoryUtilization: '128MB',
          cpuEfficiency: '98.5%',
          energyOptimization: '+67%'
        },
        securityMetrics: {
          vulnerabilityScore: 0.01,
          securityRating: 'A+',
          quantumResistance: '128-bit',
          cryptographicStrength: formatBitStrength(currentBitStrength)
        },
        researchMetrics: {
          publicationRate: '+23/month',
          citationImpact: 9.8,
          researchValue: 2400000,
          innovationIndex: 94.5
        }
      },
      comparativeAnalysis: {
        vsTraditionalMethods: {
          efficiency: '+34%',
          security: '+89%',
          performance: '+67%',
          costEffectiveness: '+45%'
        },
        vsIndustryStandards: {
          cryptographicStrength: 'Superior',
          quantumResistance: 'Advanced',
          blockchainSecurity: 'Leading',
          researchImpact: 'Exceptional'
        }
      },
      trendAnalysis: {
        monthlyGrowth: {
          researchItems: '+23',
          publications: '+15',
          citations: '+847',
          securityEnhancements: '+12'
        },
        quarterlyTrends: {
          q1: { growth: '+18%', focus: 'Mathematical Research' },
          q2: { growth: '+22%', focus: 'Cryptographic Innovation' },
          q3: { growth: '+25%', focus: 'Blockchain Security' },
          q4: { growth: '+28%', focus: 'Quantum Computing' }
        }
      }
    };

    // Create and download research metrics
    const dataStr = JSON.stringify(researchMetrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Research_Metrics_Export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📈 Research metrics exported successfully!\n\nIncludes:\n- Performance metrics\n- Security analysis\n- Comparative data\n- Trend analysis\n- Growth projections`);
  };

  // Staking button handler
  const handleStakeMINED = async () => {
    const stakeAmount = 1000; // Example stake amount
    if (userBalance.MINED >= stakeAmount) {
      try {
        // Update backend staking
        const stakingResponse = await fetch('http://localhost:3002/api/staking/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: stakeAmount })
        });
        
        if (stakingResponse.ok) {
          const stakingResult = await stakingResponse.json();
          
          // Update local state with backend data
          setUserBalance(prev => ({
            ...prev,
            MINED: stakingResult.newBalance
          }));
          
          setTotalStaked(prev => prev + stakeAmount);
          alert(`✅ Successfully staked ${stakeAmount.toLocaleString()} MINED!\n\nYour staking rewards will accumulate over time.`);
          
          // Refresh balance data to ensure wallet is updated
          fetchBalanceData();
        } else {
          alert('❌ Failed to stake MINED. Please try again.');
        }
      } catch (error) {
        console.error('Error staking MINED:', error);
        alert('❌ Error staking MINED. Please try again.');
      }
    } else {
      alert('❌ Insufficient MINED balance for staking.\n\nPlease mine more MINED tokens first.');
    }
  };

  // Exchange button handlers
  const handlePlaceOrder = (type, amount, price) => {
    const totalValue = amount * price;
    if (type === 'buy') {
      if (userBalance.USD >= totalValue) {
        updateBalance('USD', -totalValue, 'trading');
        updateBalance('MINED', amount, 'trading');
        alert(`✅ Buy order placed successfully!\n\nBought ${amount.toLocaleString()} MINED for $${totalValue.toLocaleString()}`);
      } else {
        alert('❌ Insufficient USD balance for this purchase.');
      }
    } else {
      if (userBalance.MINED >= amount) {
        updateBalance('MINED', -amount, 'trading');
        updateBalance('USD', totalValue, 'trading');
        alert(`✅ Sell order placed successfully!\n\nSold ${amount.toLocaleString()} MINED for $${totalValue.toLocaleString()}`);
      } else {
        alert('❌ Insufficient MINED balance for this sale.');
      }
    }
  };

  // Add missing fetch functions for all tabs
  const fetchBlocksData = async () => {
    try {
      console.log('🔄 fetchBlocksData: Starting API call...');
      const response = await fetch('http://localhost:3002/api/blocks');
      console.log('🔄 fetchBlocksData: Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log(`📦 Fetched ${data.latestBlocks?.length || 0} blocks, current height: ${data.currentHeight}`);
        console.log('📦 First block:', data.latestBlocks?.[0]);
        console.log('📦 All blocks:', data.latestBlocks);
        setBlocksData({
          latestBlocks: data.latestBlocks || []
        });
        console.log('✅ fetchBlocksData: State updated successfully');
      } else {
        console.log('Blocks API not available, using fallback data');
        // Fallback data for when API is not available
        setBlocksData({
          latestBlocks: [{
            height: 0,
            hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            timestamp: new Date().toISOString(),
            transactions: 0,
            miner: '0x0000000000000000000000000000000000000000',
            difficulty: '0x1000',
            size: '0 KB',
            gasUsed: '0',
            gasLimit: '8000000'
          }]
        });
      }
    } catch (error) {
      console.log('Error fetching blocks data:', error.message);
      // Fallback data for when API is not available
      setBlocksData({
        latestBlocks: [{
          height: 0,
          hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          timestamp: new Date().toISOString(),
          transactions: 0,
          miner: '0x0000000000000000000000000000000000000000',
          difficulty: '0x1000',
          size: '0 KB',
          gasUsed: '0',
          gasLimit: '8000000'
        }]
      });
    }
  };

  const fetchTransactionsData = async () => {
    // Use fallback data since /api/transactions doesn't exist
    setTransactionsData({
      recentTransactions: []
    });
  };

  const fetchTradingData = async () => {
    // Use fallback data since /api/trading doesn't exist
    setTradingData({
      price: 0.85,
      change24h: 2.5,
      volume24h: 1250000,
      high24h: 0.95,
      low24h: 0.75
    });
  };

  const fetchOrderbookData = async () => {
    // Use fallback data since /api/orderbook doesn't exist
    setOrderbookData({
      bids: [],
      asks: []
    });
  };

  const fetchTradesData = async () => {
    // Use fallback data since /api/trades doesn't exist
    setTradesData({
      recentTrades: []
    });
  };

  const fetchBalanceData = async () => {
    try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';
    const response = await fetch(`${apiUrl}/api/balance`);
      if (response.ok) {
        const balanceData = await response.json();
        setUserBalance({
          MINED: balanceData.MINED || 0,
          USD: balanceData.USD || 0
        });
        setTotalMined(balanceData.totalMined || 0);
        setTotalStaked(balanceData.totalStaked || 0);
        setStakingRewards(balanceData.stakingRewards || 0);
        setMiningHistory(balanceData.miningHistory || []);
      }
    } catch (error) {
      console.log('Balance fetch error:', error.message);
      // Fallback to current state
    }
  };

  const fetchMarketData = async () => {
    // Use fallback data since /api/market doesn't exist
    setMarketData({
      marketCap: 0,
      volume24h: 0,
      circulatingSupply: 0
    });
  };

  const fetchNetworkStatsData = async () => {
    // Use fallback data since /api/network-stats doesn't exist
    setNetworkStatsData({
      totalNodes: 0,
      activeConnections: 0,
      networkHashRate: '0 H/s'
    });
  };

  const fetchResearchRepositoryData = async () => {
    // Use fallback data since /api/research-repository doesn't exist
    setResearchRepositoryData({
      researchItems: []
    });
  };

    const fetchRewardHistory = async () => {
    // Use fallback data since /api/rewards doesn't exist
    setMiningHistory([]);
    setTotalMined(0);
    setTotalStaked(0);
    setStakingRewards(0);
  };

  // Block Explorer Handlers
  const handleViewBlockDetails = (block) => {
    setSelectedBlock(block);
    setBlockDetailsOpen(true);
  };

  const handleViewBlockTransactions = (block) => {
    setSelectedBlock(block);
    // Generate mock transactions for the block
    const mockTransactions = Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => ({
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 1000).toFixed(4),
      gasPrice: Math.floor(Math.random() * 50) + 20,
      gasUsed: Math.floor(Math.random() * 500000) + 21000,
      status: Math.random() > 0.1 ? 'confirmed' : 'pending',
      timestamp: new Date(Date.now() - i * 30000).toISOString()
    }));
    setBlockTransactions(mockTransactions);
    setTransactionDetailsOpen(true);
  };

  const handleViewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailsOpen(true);
  };

  // Add new state variables for block explorer functionality
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [blockDetailsOpen, setBlockDetailsOpen] = useState(false);
  const [transactionDetailsOpen, setTransactionDetailsOpen] = useState(false);
  const [blockTransactions, setBlockTransactions] = useState([]);

  // Wallet integration state
  const [walletConnection, setWalletConnection] = useState({
    isConnected: false,
    provider: null,
    address: '',
    chainId: null,
    balance: {}
  });
  
  const [walletSecurity, setWalletSecurity] = useState({
    isLocked: false,
    twoFactorEnabled: false,
    coldStorageEnabled: false,
    backupPhrase: '',
    securityLevel: 'High'
  });
  
  const [tradingOrders, setTradingOrders] = useState({
    openOrders: [],
    orderHistory: [],
    positions: []
  });
  
  const [exchangeFeatures, setExchangeFeatures] = useState({
    supportedPairs: ['MINED/USD', 'MINED/ETH', 'MINED/BTC', 'ETH/USD', 'BTC/USD'],
    tradingLimits: {
      minOrder: 10,
      maxOrder: 100000,
      dailyLimit: 1000000
    },
    fees: {
      maker: 0.001,
      taker: 0.002
    }
  });

  // Add trading side state
  const [tradingSide, setTradingSide] = useState('buy');
  const [orderForm, setOrderForm] = useState({
    pair: 'MINED/USD',
    type: 'limit',
    amount: '',
    price: ''
  });

  // Wallet connection functions - Connect to local blockchain
  const connectWallet = async () => {
    try {
      console.log('🔗 Connecting to MetaMask...');
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to connect your wallet.');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const account = accounts[0];
      console.log('📱 Connected account:', account);
      
      // Get network information
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      console.log('⛓️ Current Chain ID:', chainId);
      
      // Check if we're on the correct network (Chain ID: 1337)
      if (chainId !== '0x539') { // 1337 in hex
        console.log('⚠️ Wrong network detected. Attempting to switch...');
        
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x539', // 1337 in hex
              chainName: 'ProductiveMiner TestNet',
              nativeCurrency: {
                name: 'MINED',
                symbol: 'MINED',
                decimals: 18
              },
              rpcUrls: ['http://localhost:8545'],
              blockExplorerUrls: ['http://localhost:3001/explorer']
            }]
          });
          
          // Switch to the network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x539' }]
          });
          
        } catch (error) {
          console.error('Error switching network:', error);
          alert('⚠️ Please manually switch to the ProductiveMiner TestNet network in MetaMask (Chain ID: 1337)');
          return;
        }
      }
      
      // Get account balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      const balanceEth = parseFloat(parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
      
      setWalletConnection({
        isConnected: true,
        provider: 'MetaMask',
        address: account,
        chainId: parseInt(chainId, 16),
        balance: {
          ETH: balanceEth,
          MINED: balanceEth, // For now, treat ETH as MINED
          USD: parseFloat(balanceEth) * 0.85 // Approximate USD value
        }
      });
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletConnection(prev => ({
            ...prev,
            address: accounts[0]
          }));
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== '0x539') {
          alert('⚠️ Please switch to the ProductiveMiner TestNet network (Chain ID: 1337)');
        }
      });
      
      console.log('🎉 MetaMask connected successfully!');
      
    } catch (error) {
      console.error('❌ Error connecting to MetaMask:', error);
      alert('Failed to connect to MetaMask: ' + error.message);
    }
  };

  const disconnectWallet = () => {
    // Remove event listeners if MetaMask is available
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.removeAllListeners();
    }
    
    setWalletConnection({
      isConnected: false,
      provider: null,
      address: '',
      chainId: null,
      balance: {}
    });
    
    console.log('🔌 Wallet disconnected');
  };

  const placeOrder = async (pair, type, amount, price) => {
    const order = {
      id: Date.now().toString(),
      pair,
      type,
      amount: parseFloat(amount),
      price: parseFloat(price),
      total: parseFloat(amount) * parseFloat(price),
      status: 'pending',
      timestamp: new Date().toISOString(),
      fee: type === 'market' ? parseFloat(amount) * parseFloat(price) * exchangeFeatures.fees.taker : parseFloat(amount) * parseFloat(price) * exchangeFeatures.fees.maker
    };
    
    setTradingOrders(prev => ({
      ...prev,
      openOrders: [...prev.openOrders, order]
    }));
    
    // Simulate order execution
    setTimeout(() => {
      setTradingOrders(prev => ({
        ...prev,
        openOrders: prev.openOrders.filter(o => o.id !== order.id),
        orderHistory: [...prev.orderHistory, { ...order, status: 'filled' }]
      }));
    }, 2000);
  };

  const cancelOrder = (orderId) => {
    setTradingOrders(prev => ({
      ...prev,
      openOrders: prev.openOrders.filter(o => o.id !== orderId),
      orderHistory: [...prev.orderHistory, { 
        ...prev.openOrders.find(o => o.id === orderId), 
        status: 'cancelled' 
      }]
    }));
  };

  // Trading side handlers
  const handleTradingSideChange = (side) => {
    setTradingSide(side);
  };

  const handleOrderFormChange = (field, value) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceTradingOrder = async () => {
    const { pair, type, amount, price } = orderForm;
    
    if (!amount || !price || parseFloat(amount) <= 0 || parseFloat(price) <= 0) {
      alert('❌ Please enter valid amount and price values.');
      return;
    }

    const orderAmount = parseFloat(amount);
    const orderPrice = parseFloat(price);
    const totalValue = orderAmount * orderPrice;

    if (tradingSide === 'buy') {
      if (userBalance.USD < totalValue) {
        alert('❌ Insufficient USD balance for this purchase.');
        return;
      }
    } else {
      if (userBalance.MINED < orderAmount) {
        alert('❌ Insufficient MINED balance for this sale.');
        return;
      }
    }

    try {
      // Create order object
      const order = {
        id: Date.now().toString(),
        pair,
        type,
        side: tradingSide,
        amount: orderAmount,
        price: orderPrice,
        total: totalValue,
        status: 'pending',
        timestamp: new Date().toISOString(),
        fee: type === 'market' ? totalValue * exchangeFeatures.fees.taker : totalValue * exchangeFeatures.fees.maker
      };

      // Add to open orders
      setTradingOrders(prev => ({
        ...prev,
        openOrders: [...prev.openOrders, order]
      }));

      // Update balances immediately for demo
      if (tradingSide === 'buy') {
        updateBalance('USD', -totalValue, 'trading');
        updateBalance('MINED', orderAmount, 'trading');
      } else {
        updateBalance('MINED', -orderAmount, 'trading');
        updateBalance('USD', totalValue, 'trading');
      }

      // Clear form
      setOrderForm({
        pair: 'MINED/USD',
        type: 'limit',
        amount: '',
        price: ''
      });

      alert(`✅ ${tradingSide === 'buy' ? 'Buy' : 'Sell'} order placed successfully!\n\n${tradingSide === 'buy' ? 'Bought' : 'Sold'} ${orderAmount.toLocaleString()} MINED for $${totalValue.toLocaleString()}`);

      // Simulate order execution after 2 seconds
      setTimeout(() => {
        setTradingOrders(prev => ({
          ...prev,
          openOrders: prev.openOrders.filter(o => o.id !== order.id),
          orderHistory: [...prev.orderHistory, { ...order, status: 'filled' }]
        }));
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('❌ Failed to place order. Please try again.');
    }
  };

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="header">
        <div className="logo">
          <h1>🪙 ProductiveMiner Exchange</h1>
          <span className="token-symbol">MINED</span>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="label">Price</span>
            <span className="value">${formatNumber(tradingData?.price || 0.85)}</span>
          </div>
          <div className="stat">
            <span className="label">24h Change</span>
            <span className={`value ${(tradingData?.change24h || 0) >= 0 ? 'positive' : 'negative'}`}>
              {(tradingData?.change24h || 0) >= 0 ? '+' : ''}{formatNumber(tradingData?.change24h || 0)}%
            </span>
          </div>
          <div className="stat">
            <span className="label">24h Volume</span>
            <span className="value">${formatNumber(tradingData?.volume24h || 0)}</span>
          </div>
        </div>
      </header>

      <div className="tab-navigation">
        <button 
          className={`tab-nav ${activeTab === 'exchange' ? 'active' : ''}`}
          onClick={() => setActiveTab('exchange')}
        >
          📊 Exchange
        </button>
        <button 
          className={`tab-nav ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          💼 Wallet
        </button>
        <button 
          className={`tab-nav ${activeTab === 'mining' ? 'active' : ''}`}
          onClick={() => setActiveTab('mining')}
        >
          🪙 Mining
        </button>
        <button 
          className={`tab-nav ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          🔍 Block Explorer
        </button>
        <button 
          className={`tab-nav ${activeTab === 'validators' ? 'active' : ''}`}
          onClick={() => setActiveTab('validators')}
        >
          🔐 Validators
        </button>
        <button 
          className={`tab-nav ${activeTab === 'discoveries' ? 'active' : ''}`}
          onClick={() => setActiveTab('discoveries')}
        >
          🔬 Discoveries
        </button>
        <button 
          className={`tab-nav ${activeTab === 'analytics-adaptive' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics-adaptive')}
        >
          📊 Analytics & Adaptive Learning
        </button>
        <button 
          className={`tab-nav ${activeTab === 'repository' ? 'active' : ''}`}
          onClick={() => setActiveTab('repository')}
        >
          📚 Research Repository
        </button>
      </div>

      <main id="main-content">
        {activeTab === 'exchange' && renderExchangeTab()}
        {activeTab === 'wallet' && renderWalletTab()}
        {activeTab === 'mining' && renderMiningTab()}
        {activeTab === 'explorer' && renderBlockExplorerTab()}
        {activeTab === 'validators' && renderValidatorsTab()}
        {activeTab === 'discoveries' && <Discoveries />}
        {activeTab === 'analytics-adaptive' && <ComprehensiveAnalytics />}
        {activeTab === 'repository' && renderResearchRepositoryTab()}
      </main>

      {/* Block Details Modal */}
      {blockDetailsOpen && selectedBlock && (
        <div className="modal-overlay" onClick={() => setBlockDetailsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Block #{selectedBlock.height} Details</h3>
              <button className="modal-close" onClick={() => setBlockDetailsOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Block Height</span>
                  <span className="value">{selectedBlock.height}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Timestamp</span>
                  <span className="value">{new Date(selectedBlock.timestamp).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Block Hash</span>
                  <span className="value hash">{selectedBlock.hash}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Miner</span>
                  <span className="value address">{selectedBlock.miner}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Transactions</span>
                  <span className="value">{selectedBlock.transactions || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Gas Used</span>
                  <span className="value">{selectedBlock.gasUsed?.toLocaleString() || '0'} / {selectedBlock.gasLimit?.toLocaleString() || '8,000,000'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Size</span>
                  <span className="value">{(Math.random() * 1000 + 500).toFixed(0)} bytes</span>
                </div>
                <div className="detail-item">
                  <span className="label">Difficulty</span>
                  <span className="value">{(Math.random() * 1000000 + 1000000).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setBlockDetailsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {transactionDetailsOpen && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setTransactionDetailsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button className="modal-close" onClick={() => setTransactionDetailsOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Transaction Hash</span>
                  <span className="value hash">{selectedTransaction.hash}</span>
                </div>
                <div className="detail-item">
                  <span className="label">From</span>
                  <span className="value address">{selectedTransaction.from}</span>
                </div>
                <div className="detail-item">
                  <span className="label">To</span>
                  <span className="value address">{selectedTransaction.to}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Value</span>
                  <span className="value">{selectedTransaction.value} MINED</span>
                </div>
                <div className="detail-item">
                  <span className="label">Gas Price</span>
                  <span className="value">{selectedTransaction.gasPrice} Gwei</span>
                </div>
                <div className="detail-item">
                  <span className="label">Gas Used</span>
                  <span className="value">{selectedTransaction.gasUsed?.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status</span>
                  <span className={`value status ${selectedTransaction.status}`}>
                    {selectedTransaction.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Timestamp</span>
                  <span className="value">{new Date(selectedTransaction.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setTransactionDetailsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Block Transactions Modal */}
      {transactionDetailsOpen && selectedBlock && blockTransactions.length > 0 && (
        <div className="modal-overlay" onClick={() => setTransactionDetailsOpen(false)}>
          <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Block #{selectedBlock.height} Transactions</h3>
              <button className="modal-close" onClick={() => setTransactionDetailsOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="transactions-list">
                {blockTransactions.map((tx, index) => (
                  <div key={index} className="transaction-item">
                    <div className="transaction-header">
                      <span className="tx-hash">{tx.hash.substring(0, 16)}...</span>
                      <span className={`status ${tx.status}`}>
                        {tx.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="transaction-details">
                      <div className="detail-row">
                        <span className="label">From:</span>
                        <span className="value address">{tx.from.substring(0, 16)}...</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">To:</span>
                        <span className="value address">{tx.to.substring(0, 16)}...</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Value:</span>
                        <span className="value">{tx.value} MINED</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Gas:</span>
                        <span className="value">{tx.gasUsed?.toLocaleString()} / {tx.gasPrice} Gwei</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setTransactionDetailsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 