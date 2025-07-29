// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ProductiveMiner is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    struct Discovery {
        address miner;
        string workType;
        uint256 difficulty;
        string result;
        string proofOfWork;
        uint256 quantumSecurity;
        uint256 timestamp;
        uint256 reward;
        bool verified;
    }

    struct MiningSession {
        address miner;
        string workType;
        uint256 difficulty;
        uint256 startTime;
        uint256 endTime;
        uint256 progress;
        bool active;
    }

    mapping(bytes32 => Discovery) public discoveries;
    mapping(address => MiningSession[]) public miningSessions;
    mapping(address => uint256) public minerRewards;
    mapping(string => bool) public workTypes;

    uint256 public totalDiscoveries;
    uint256 public totalRewardsDistributed;
    uint256 public maxDifficulty = 50;
    uint256 public baseReward = 100;
    uint256 public blockTime = 30;
    uint256 public quantumSecurityLevel = 256;

    event DiscoverySubmitted(
        bytes32 indexed discoveryId,
        address indexed miner,
        string workType,
        uint256 difficulty,
        uint256 reward
    );

    event MiningSessionStarted(
        address indexed miner,
        string workType,
        uint256 difficulty
    );

    event MiningSessionCompleted(
        address indexed miner,
        string workType,
        uint256 difficulty
    );

    constructor() Ownable(msg.sender) {
        // Initialize supported work types
        workTypes["Prime Pattern Discovery"] = true;
        workTypes["Riemann Zero Computation"] = true;
        workTypes["Yang-Mills Field Theory"] = true;
        workTypes["Goldbach Conjecture Verification"] = true;
        workTypes["Navier-Stokes Simulation"] = true;
        workTypes["Birch-Swinnerton-Dyer"] = true;
        workTypes["Elliptic Curve Cryptography"] = true;
        workTypes["Lattice Cryptography"] = true;
        workTypes[unicode"Poincaré Conjecture"] = true;
    }

    function submitDiscovery(
        string memory _workType,
        uint256 _difficulty,
        string memory _result,
        string memory _proofOfWork,
        uint256 _quantumSecurity
    ) external nonReentrant {
        require(workTypes[_workType], "Work type not supported");
        require(_difficulty <= maxDifficulty, "Difficulty too high");
        require(_quantumSecurity >= quantumSecurityLevel, "Insufficient quantum security");

        bytes32 discoveryId = keccak256(
            abi.encodePacked(
                msg.sender,
                _workType,
                _difficulty,
                _result,
                _proofOfWork,
                _quantumSecurity,
                block.timestamp
            )
        );

        require(discoveries[discoveryId].timestamp == 0, "Discovery already exists");

        uint256 reward = calculateReward(_difficulty, _quantumSecurity);

        discoveries[discoveryId] = Discovery({
            miner: msg.sender,
            workType: _workType,
            difficulty: _difficulty,
            result: _result,
            proofOfWork: _proofOfWork,
            quantumSecurity: _quantumSecurity,
            timestamp: block.timestamp,
            reward: reward,
            verified: false
        });

        minerRewards[msg.sender] += reward;
        totalDiscoveries++;
        totalRewardsDistributed += reward;

        emit DiscoverySubmitted(
            discoveryId,
            msg.sender,
            _workType,
            _difficulty,
            reward
        );
    }

    function startMiningSession(
        string memory _workType,
        uint256 _difficulty
    ) external {
        require(workTypes[_workType], "Work type not supported");
        require(_difficulty <= maxDifficulty, "Difficulty too high");

        MiningSession memory session = MiningSession({
            miner: msg.sender,
            workType: _workType,
            difficulty: _difficulty,
            startTime: block.timestamp,
            endTime: 0,
            progress: 0,
            active: true
        });

        miningSessions[msg.sender].push(session);

        emit MiningSessionStarted(msg.sender, _workType, _difficulty);
    }

    function completeMiningSession(uint256 _sessionIndex) external {
        require(_sessionIndex < miningSessions[msg.sender].length, "Invalid session index");
        require(miningSessions[msg.sender][_sessionIndex].active, "Session not active");

        miningSessions[msg.sender][_sessionIndex].endTime = block.timestamp;
        miningSessions[msg.sender][_sessionIndex].active = false;

        emit MiningSessionCompleted(
            msg.sender,
            miningSessions[msg.sender][_sessionIndex].workType,
            miningSessions[msg.sender][_sessionIndex].difficulty
        );
    }

    function calculateReward(uint256 _difficulty, uint256 _quantumSecurity) public view returns (uint256) {
        uint256 baseRewardAmount = baseReward * _difficulty;
        uint256 quantumBonus = (_quantumSecurity / quantumSecurityLevel) * 10;
        return baseRewardAmount + quantumBonus;
    }

    function getMinerRewards(address _miner) external view returns (uint256) {
        return minerRewards[_miner];
    }

    function getMiningSessions(address _miner) external view returns (MiningSession[] memory) {
        return miningSessions[_miner];
    }

    function getDiscovery(bytes32 _discoveryId) external view returns (Discovery memory) {
        return discoveries[_discoveryId];
    }

    // Admin functions
    function setMaxDifficulty(uint256 _maxDifficulty) external onlyOwner {
        maxDifficulty = _maxDifficulty;
    }

    function setBaseReward(uint256 _baseReward) external onlyOwner {
        baseReward = _baseReward;
    }

    function setBlockTime(uint256 _blockTime) external onlyOwner {
        blockTime = _blockTime;
    }

    function setQuantumSecurityLevel(uint256 _level) external onlyOwner {
        quantumSecurityLevel = _level;
    }

    function addWorkType(string memory _workType) external onlyOwner {
        workTypes[_workType] = true;
    }

    function removeWorkType(string memory _workType) external onlyOwner {
        workTypes[_workType] = false;
    }
} 