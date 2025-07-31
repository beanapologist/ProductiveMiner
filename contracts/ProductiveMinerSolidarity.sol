// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ProductiveMiner Solidarity Contract
 * @dev Governs community participation, collaborative research, and equitable reward distribution
 * @author ProductiveMiner Community
 */
contract ProductiveMinerSolidarity is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    // ============ STRUCTS ============

    struct SolidarityMember {
        address memberAddress;
        uint256 joinedAt;
        uint256 contributionScore;
        uint256 reputationScore;
        uint256 totalRewards;
        uint256 collaborativeProjects;
        uint256 computationalContributions;
        uint256 patternsDiscovered;
        bool isActive;
        string expertise; // Prime patterns, Riemann zeros, etc.
    }

    // ============ COMPUTATIONAL RESULTS PROCESSING ============

    /**
     * @dev Submit computational results from mining operations
     * @param _workType Type of mathematical work performed
     * @param _totalRecords Number of records processed
     * @param _computationTime Time taken in milliseconds
     * @param _accuracy Accuracy percentage * 100 (9970 = 99.70%)
     * @param _patternsDiscovered Array of pattern types discovered
     */
    function submitComputationalResult(
        string memory _workType,
        uint256 _totalRecords,
        uint256 _computationTime,
        uint256 _accuracy,
        string[] memory _patternsDiscovered
    ) external nonReentrant {
        require(members[msg.sender].isActive, "Not a solidarity member");
        require(_totalRecords > 0, "Must process at least 1 record");
        require(_accuracy <= 10000, "Invalid accuracy percentage");
        require(_computationTime > 0, "Invalid computation time");
        
        uint256 resultId = totalComputationalResults;
        
        // Calculate solidarity bonus based on performance
        uint256 solidarityBonus = calculateComputationalBonus(
            _totalRecords,
            _computationTime,
            _accuracy,
            _patternsDiscovered.length
        );
        
        // Store computational result
        computationalResults[resultId] = ComputationalResult({
            resultId: resultId,
            miner: msg.sender,
            workType: _workType,
            totalRecords: _totalRecords,
            computationTime: _computationTime,
            accuracy: _accuracy,
            patternsDiscovered: _patternsDiscovered,
            timestamp: block.timestamp,
            verified: false,
            solidarityBonus: solidarityBonus
        });
        
        // Update member statistics
        members[msg.sender].computationalContributions = 
            members[msg.sender].computationalContributions.add(1);
        members[msg.sender].patternsDiscovered = 
            members[msg.sender].patternsDiscovered.add(_patternsDiscovered.length);
        
        // Award pattern discovery bonuses
        uint256 totalPatternBonus = 0;
        for (uint256 i = 0; i < _patternsDiscovered.length; i++) {
            uint256 patternBonus = patternDiscoveryBonuses[_patternsDiscovered[i]];
            if (patternBonus > 0) {
                totalPatternBonus = totalPatternBonus.add(patternBonus);
                emit PatternDiscovered(msg.sender, _patternsDiscovered[i], patternBonus);
            }
        }
        
        // Award total solidarity bonus
        if (solidarityBonus.add(totalPatternBonus) > 0) {
            members[msg.sender].totalRewards = 
                members[msg.sender].totalRewards.add(solidarityBonus.add(totalPatternBonus));
            
            emit SolidarityBonusAwarded(
                msg.sender, 
                solidarityBonus.add(totalPatternBonus), 
                "Computational Achievement"
            );
        }
        
        totalComputationalResults = totalComputationalResults.add(1);
        emit ComputationalResultSubmitted(resultId, msg.sender, _workType, _accuracy);
    }

    /**
     * @dev Calculate computational bonus based on performance metrics
     * @param _totalRecords Number of records processed
     * @param _computationTime Time taken in milliseconds
     * @param _accuracy Accuracy percentage * 100
     * @param _patternsCount Number of patterns discovered
     */
    function calculateComputationalBonus(
        uint256 _totalRecords,
        uint256 _computationTime,
        uint256 _accuracy,
        uint256 _patternsCount
    ) internal pure returns (uint256) {
        // Base bonus calculation
        uint256 baseBonus = 100; // 100 tokens base
        
        // Records processed bonus (1 token per 100 records)
        uint256 recordsBonus = _totalRecords.div(100);
        
        // Efficiency bonus (inverse of computation time, max 500 tokens)
        uint256 efficiencyBonus = 0;
        if (_computationTime > 0) {
            // Bonus for faster computation (based on records per second)
            uint256 recordsPerSecond = _totalRecords.mul(1000).div(_computationTime);
            efficiencyBonus = recordsPerSecond.mul(2); // 2 tokens per record/second
            if (efficiencyBonus > 500) efficiencyBonus = 500;
        }
        
        // Accuracy bonus (max 1000 tokens for 100% accuracy)
        uint256 accuracyBonus = _accuracy.div(10); // Convert from percentage*100 to token bonus
        
        // Pattern discovery bonus (100 tokens per pattern)
        uint256 patternBonus = _patternsCount.mul(100);
        
        return baseBonus.add(recordsBonus).add(efficiencyBonus).add(accuracyBonus).add(patternBonus);
    }

    /**
     * @dev Verify computational result (admin function)
     * @param _resultId Result ID to verify
     * @param _verified Verification status
     */
    function verifyComputationalResult(uint256 _resultId, bool _verified) external onlyOwner {
        require(_resultId < totalComputationalResults, "Invalid result ID");
        
        ComputationalResult storage result = computationalResults[_resultId];
        require(!result.verified, "Already verified");
        
        result.verified = _verified;
        
        if (_verified) {
            // Award additional verification bonus
            uint256 verificationBonus = result.solidarityBonus.div(10); // 10% verification bonus
            members[result.miner].totalRewards = 
                members[result.miner].totalRewards.add(verificationBonus);
            
            // Increase reputation for verified results
            uint256 reputationIncrease = result.accuracy.div(100); // Accuracy-based reputation gain
            members[result.miner].reputationScore = 
                members[result.miner].reputationScore.add(reputationIncrease);
            
            emit SolidarityBonusAwarded(result.miner, verificationBonus, "Result Verification");
        }
    }

    struct ComputationalResult {
        uint256 resultId;
        address miner;
        string workType;
        uint256 totalRecords;
        uint256 computationTime; // in milliseconds
        uint256 accuracy; // percentage * 100 (9970 = 99.70%)
        string[] patternsDiscovered;
        uint256 timestamp;
        bool verified;
        uint256 solidarityBonus;
    }

    struct CollaborativeProject {
        uint256 projectId;
        string title;
        string description;
        string[] workTypes; // Multiple mathematical domains
        address[] participants;
        uint256 totalBudget;
        uint256 rewardsDistributed;
        uint256 startTime;
        uint256 endTime;
        uint256 difficulty;
        bool isCompleted;
        mapping(address => uint256) contributions;
        mapping(address => bool) hasContributed;
    }

    struct GovernanceProposal {
        uint256 proposalId;
        address proposer;
        string title;
        string description;
        uint256 votingPeriod;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true = yes, false = no
    }

    struct RewardPool {
        uint256 totalPool;
        uint256 collaborativePool;
        uint256 individualPool;
        uint256 governancePool;
        uint256 emergencyPool;
        uint256 lastUpdate;
    }

    // ============ STATE VARIABLES ============

    IERC20 public productiveMinerToken;
    
    mapping(address => SolidarityMember) public members;
    mapping(uint256 => CollaborativeProject) public projects;
    mapping(uint256 => GovernanceProposal) public proposals;
    mapping(uint256 => ComputationalResult) public computationalResults;
    mapping(string => uint256) public patternDiscoveryBonuses;
    
    uint256 public totalMembers;
    uint256 public totalProjects;
    uint256 public totalProposals;
    uint256 public totalComputationalResults;
    
    RewardPool public rewardPool;
    
    // Solidarity parameters
    uint256 public constant MIN_REPUTATION_THRESHOLD = 100;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant COLLABORATION_BONUS = 150; // 150% bonus for collaborative work
    uint256 public constant REPUTATION_DECAY_RATE = 95; // 5% monthly decay
    
    // Mathematical work type constants
    string[] public supportedWorkTypes = [
        "Prime Pattern Discovery",
        "Riemann Zero Computation", 
        "Yang-Mills Field Theory",
        "Goldbach Conjecture Verification",
        "Navier-Stokes Simulation",
        "Birch-Swinnerton-Dyer",
        "Elliptic Curve Cryptography",
        "Lattice Cryptography",
        "Poincare Conjecture"
    ];

    // ============ EVENTS ============

    event MemberJoined(address indexed member, string expertise);
    event ProjectCreated(uint256 indexed projectId, string title, address[] participants);
    event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 value);
    event RewardsDistributed(uint256 indexed projectId, address indexed recipient, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool choice);
    event ReputationUpdated(address indexed member, uint256 newScore);
    event ComputationalResultSubmitted(uint256 indexed resultId, address indexed miner, string workType, uint256 accuracy);
    event PatternDiscovered(address indexed discoverer, string patternType, uint256 bonus);
    event SolidarityBonusAwarded(address indexed recipient, uint256 amount, string reason);

    // ============ CONSTRUCTOR ============

    constructor(address _tokenAddress) {
        productiveMinerToken = IERC20(_tokenAddress);
        
        // Initialize reward pool
        rewardPool = RewardPool({
            totalPool: 0,
            collaborativePool: 0,
            individualPool: 0,
            governancePool: 0,
            emergencyPool: 0,
            lastUpdate: block.timestamp
        });

        // Initialize pattern discovery bonuses (based on your actual results)
        patternDiscoveryBonuses["twin_primes"] = 500;     // 500 token bonus
        patternDiscoveryBonuses["cousin_primes"] = 400;   // 400 token bonus
        patternDiscoveryBonuses["sexy_primes"] = 350;     // 350 token bonus
        patternDiscoveryBonuses["mersenne_prime"] = 1000; // 1000 token bonus
        patternDiscoveryBonuses["goldbach_verification"] = 750; // 750 token bonus
    }

    // ============ MEMBER MANAGEMENT ============

    /**
     * @dev Join the solidarity community
     * @param _expertise Area of mathematical expertise
     */
    function joinSolidarity(string memory _expertise) external {
        require(!members[msg.sender].isActive, "Already a member");
        require(bytes(_expertise).length > 0, "Expertise required");
        
        members[msg.sender] = SolidarityMember({
            memberAddress: msg.sender,
            joinedAt: block.timestamp,
            contributionScore: 0,
            reputationScore: 100, // Starting reputation
            totalRewards: 0,
            collaborativeProjects: 0,
            computationalContributions: 0,
            patternsDiscovered: 0,
            isActive: true,
            expertise: _expertise
        });
        
        totalMembers = totalMembers.add(1);
        emit MemberJoined(msg.sender, _expertise);
    }

    /**
     * @dev Update member reputation based on contributions
     * @param _member Member address
     * @param _score New reputation score
     */
    function updateReputation(address _member, uint256 _score) external onlyOwner {
        require(members[_member].isActive, "Member not active");
        members[_member].reputationScore = _score;
        emit ReputationUpdated(_member, _score);
    }

    // ============ COLLABORATIVE PROJECTS ============

    /**
     * @dev Create a new collaborative research project
     * @param _title Project title
     * @param _description Project description
     * @param _workTypes Mathematical work types involved
     * @param _participants Initial participants
     * @param _budget Total project budget
     * @param _difficulty Project difficulty (1-100)
     */
    function createProject(
        string memory _title,
        string memory _description,
        string[] memory _workTypes,
        address[] memory _participants,
        uint256 _budget,
        uint256 _difficulty
    ) external nonReentrant {
        require(members[msg.sender].isActive, "Not a solidarity member");
        require(members[msg.sender].reputationScore >= MIN_REPUTATION_THRESHOLD, "Insufficient reputation");
        require(_participants.length > 1, "Collaborative project needs multiple participants");
        require(_budget > 0, "Budget must be positive");
        require(_difficulty > 0 && _difficulty <= 100, "Invalid difficulty");
        
        // Validate all participants are members
        for (uint256 i = 0; i < _participants.length; i++) {
            require(members[_participants[i]].isActive, "Participant not a member");
        }
        
        uint256 projectId = totalProjects;
        CollaborativeProject storage project = projects[projectId];
        
        project.projectId = projectId;
        project.title = _title;
        project.description = _description;
        project.workTypes = _workTypes;
        project.participants = _participants;
        project.totalBudget = _budget;
        project.rewardsDistributed = 0;
        project.startTime = block.timestamp;
        project.endTime = 0;
        project.difficulty = _difficulty;
        project.isCompleted = false;
        
        // Initialize participant tracking
        for (uint256 i = 0; i < _participants.length; i++) {
            project.hasContributed[_participants[i]] = false;
            project.contributions[_participants[i]] = 0;
            members[_participants[i]].collaborativeProjects = 
                members[_participants[i]].collaborativeProjects.add(1);
        }
        
        totalProjects = totalProjects.add(1);
        emit ProjectCreated(projectId, _title, _participants);
    }

    /**
     * @dev Make a contribution to a collaborative project
     * @param _projectId Project ID
     * @param _contributionValue Value of contribution
     */
    function makeContribution(uint256 _projectId, uint256 _contributionValue) external nonReentrant {
        require(_projectId < totalProjects, "Invalid project ID");
        require(!projects[_projectId].isCompleted, "Project completed");
        require(_contributionValue > 0, "Contribution must be positive");
        
        CollaborativeProject storage project = projects[_projectId];
        
        // Check if sender is a participant
        bool isParticipant = false;
        for (uint256 i = 0; i < project.participants.length; i++) {
            if (project.participants[i] == msg.sender) {
                isParticipant = true;
                break;
            }
        }
        require(isParticipant, "Not a project participant");
        
        // Record contribution
        project.contributions[msg.sender] = project.contributions[msg.sender].add(_contributionValue);
        project.hasContributed[msg.sender] = true;
        
        // Update member stats
        members[msg.sender].contributionScore = 
            members[msg.sender].contributionScore.add(_contributionValue);
        
        emit ContributionMade(_projectId, msg.sender, _contributionValue);
    }

    /**
     * @dev Complete a collaborative project and distribute rewards
     * @param _projectId Project ID
     */
    function completeProject(uint256 _projectId) external nonReentrant {
        require(_projectId < totalProjects, "Invalid project ID");
        require(!projects[_projectId].isCompleted, "Already completed");
        
        CollaborativeProject storage project = projects[_projectId];
        
        // Check if sender is a participant or owner
        bool canComplete = (msg.sender == owner());
        for (uint256 i = 0; i < project.participants.length; i++) {
            if (project.participants[i] == msg.sender) {
                canComplete = true;
                break;
            }
        }
        require(canComplete, "Not authorized to complete project");
        
        // Calculate total contributions
        uint256 totalContributions = 0;
        for (uint256 i = 0; i < project.participants.length; i++) {
            totalContributions = totalContributions.add(
                project.contributions[project.participants[i]]
            );
        }
        require(totalContributions > 0, "No contributions made");
        
        // Distribute rewards based on contributions
        uint256 collaborativeBonus = project.totalBudget.mul(COLLABORATION_BONUS).div(100);
        uint256 totalReward = project.totalBudget.add(collaborativeBonus);
        
        for (uint256 i = 0; i < project.participants.length; i++) {
            address participant = project.participants[i];
            uint256 contribution = project.contributions[participant];
            
            if (contribution > 0) {
                uint256 rewardShare = totalReward.mul(contribution).div(totalContributions);
                
                // Update member totals
                members[participant].totalRewards = 
                    members[participant].totalRewards.add(rewardShare);
                
                // Increase reputation based on contribution and difficulty
                uint256 reputationGain = contribution.mul(project.difficulty).div(100);
                members[participant].reputationScore = 
                    members[participant].reputationScore.add(reputationGain);
                
                project.rewardsDistributed = project.rewardsDistributed.add(rewardShare);
                emit RewardsDistributed(_projectId, participant, rewardShare);
            }
        }
        
        project.isCompleted = true;
        project.endTime = block.timestamp;
    }

    // ============ GOVERNANCE ============

    /**
     * @dev Create a governance proposal
     * @param _title Proposal title
     * @param _description Proposal description
     */
    function createProposal(string memory _title, string memory _description) external {
        require(members[msg.sender].isActive, "Not a solidarity member");
        require(members[msg.sender].reputationScore >= MIN_REPUTATION_THRESHOLD, "Insufficient reputation");
        
        uint256 proposalId = totalProposals;
        GovernanceProposal storage proposal = proposals[proposalId];
        
        proposal.proposalId = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = _title;
        proposal.description = _description;
        proposal.votingPeriod = block.timestamp.add(VOTING_PERIOD);
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.executed = false;
        
        totalProposals = totalProposals.add(1);
        emit ProposalCreated(proposalId, msg.sender, _title);
    }

    /**
     * @dev Vote on a governance proposal
     * @param _proposalId Proposal ID
     * @param _choice Vote choice (true = yes, false = no)
     */
    function vote(uint256 _proposalId, bool _choice) external {
        require(_proposalId < totalProposals, "Invalid proposal ID");
        require(members[msg.sender].isActive, "Not a solidarity member");
        require(block.timestamp <= proposals[_proposalId].votingPeriod, "Voting period ended");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");
        
        GovernanceProposal storage proposal = proposals[_proposalId];
        
        // Weight vote by reputation score
        uint256 voteWeight = members[msg.sender].reputationScore;
        
        if (_choice) {
            proposal.yesVotes = proposal.yesVotes.add(voteWeight);
        } else {
            proposal.noVotes = proposal.noVotes.add(voteWeight);
        }
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = _choice;
        
        emit VoteCast(_proposalId, msg.sender, _choice);
    }

    // ============ REWARD POOL MANAGEMENT ============

    /**
     * @dev Deposit tokens to reward pool
     * @param _amount Amount to deposit
     */
    function depositToRewardPool(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be positive");
        require(
            productiveMinerToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        // Distribute to different pools
        uint256 collaborative = _amount.mul(40).div(100); // 40%
        uint256 individual = _amount.mul(30).div(100);    // 30%
        uint256 governance = _amount.mul(20).div(100);    // 20%
        uint256 emergency = _amount.mul(10).div(100);     // 10%
        
        rewardPool.totalPool = rewardPool.totalPool.add(_amount);
        rewardPool.collaborativePool = rewardPool.collaborativePool.add(collaborative);
        rewardPool.individualPool = rewardPool.individualPool.add(individual);
        rewardPool.governancePool = rewardPool.governancePool.add(governance);
        rewardPool.emergencyPool = rewardPool.emergencyPool.add(emergency);
        rewardPool.lastUpdate = block.timestamp;
    }

    // ============ VIEW FUNCTIONS ============

    function getMember(address _member) external view returns (SolidarityMember memory) {
        return members[_member];
    }

    function getProject(uint256 _projectId) external view returns (
        uint256, string memory, string memory, string[] memory, 
        address[] memory, uint256, uint256, uint256, uint256, uint256, bool
    ) {
        CollaborativeProject storage project = projects[_projectId];
        return (
            project.projectId,
            project.title,
            project.description,
            project.workTypes,
            project.participants,
            project.totalBudget,
            project.rewardsDistributed,
            project.startTime,
            project.endTime,
            project.difficulty,
            project.isCompleted
        );
    }

    function getProjectContribution(uint256 _projectId, address _contributor) 
        external view returns (uint256) {
        return projects[_projectId].contributions[_contributor];
    }

    function getSupportedWorkTypes() external view returns (string[] memory) {
        return supportedWorkTypes;
    }

    function getRewardPoolStatus() external view returns (RewardPool memory) {
        return rewardPool;
    }

    function getComputationalResult(uint256 _resultId) external view returns (
        uint256, address, string memory, uint256, uint256, uint256, 
        string[] memory, uint256, bool, uint256
    ) {
        require(_resultId < totalComputationalResults, "Invalid result ID");
        ComputationalResult storage result = computationalResults[_resultId];
        return (
            result.resultId,
            result.miner,
            result.workType,
            result.totalRecords,
            result.computationTime,
            result.accuracy,
            result.patternsDiscovered,
            result.timestamp,
            result.verified,
            result.solidarityBonus
        );
    }

    function getMemberComputationalStats(address _member) external view returns (
        uint256 computationalContributions,
        uint256 patternsDiscovered,
        uint256 totalRewards,
        uint256 reputationScore
    ) {
        SolidarityMember storage member = members[_member];
        return (
            member.computationalContributions,
            member.patternsDiscovered,
            member.totalRewards,
            member.reputationScore
        );
    }

    function getPatternBonus(string memory _patternType) external view returns (uint256) {
        return patternDiscoveryBonuses[_patternType];
    }

    // ============ ADMIN FUNCTIONS ============

    function addWorkType(string memory _workType) external onlyOwner {
        supportedWorkTypes.push(_workType);
    }

    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        require(_amount <= rewardPool.emergencyPool, "Insufficient emergency funds");
        require(
            productiveMinerToken.transfer(owner(), _amount),
            "Transfer failed"
        );
        rewardPool.emergencyPool = rewardPool.emergencyPool.sub(_amount);
        rewardPool.totalPool = rewardPool.totalPool.sub(_amount);
    }

    /**
     * @dev Decay reputation scores monthly to encourage continued participation
     */
    function applyReputationDecay() external onlyOwner {
        // This should be called monthly by governance or automation
        // Implementation would iterate through active members and apply decay
        // Note: In production, this might be better handled off-chain or with a more gas-efficient approach
    }
}