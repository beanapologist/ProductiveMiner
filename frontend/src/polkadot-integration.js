// Polkadot.js integration for TestNet Hybrid (PoW/PoS)
// Replaces Web3.js functionality with Polkadot.js API for hybrid consensus

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

class PolkadotHybridIntegration {
    constructor() {
        this.api = null;
        this.keyring = null;
        this.isConnected = false;
        this.wsProvider = null;
    }

    async initialize() {
        try {
            console.log('Initializing Polkadot Hybrid Integration...');
            
            // Wait for crypto to be ready
            await cryptoWaitReady();
            
            // Initialize keyring
            this.keyring = new Keyring({ type: 'sr25519' });
            
            // Connect to local Substrate node
            this.wsProvider = new WsProvider('ws://127.0.0.1:9944');
            this.api = await ApiPromise.create({ provider: this.wsProvider });
            
            // Wait for API to be ready
            await this.api.isReady;
            
            this.isConnected = true;
            console.log('Polkadot Hybrid integration initialized successfully');
            
            // Subscribe to chain events
            this.subscribeToEvents();
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Polkadot Hybrid integration:', error);
            return false;
        }
    }

    async subscribeToEvents() {
        if (!this.api) return;

        // Subscribe to new blocks
        this.api.rpc.chain.subscribeNewHeads((header) => {
            console.log('New block:', header.number.toNumber());
            this.onNewBlock(header);
        });

        // Subscribe to ProductiveMiner events
        this.api.query.system.events((events) => {
            events.forEach(({ event }) => {
                if (event.section === 'productiveMiner') {
                    this.onProductiveMinerEvent(event);
                }
            });
        });
    }

    onNewBlock(header) {
        // Handle new block events
        const blockNumber = header.number.toNumber();
        console.log(`New block: ${blockNumber}`);
        
        // Update UI with new block information
        if (window.updateBlockInfo) {
            window.updateBlockInfo(blockNumber);
        }
    }

    onProductiveMinerEvent(event) {
        console.log('ProductiveMiner Hybrid event:', event);
        
        // Handle different event types
        switch (event.method) {
            case 'DiscoverySubmitted':
                this.handleDiscoverySubmitted(event);
                break;
            case 'MiningSessionStarted':
                this.handleMiningSessionStarted(event);
                break;
            case 'MiningSessionCompleted':
                this.handleMiningSessionCompleted(event);
                break;
            case 'StakeDeposited':
                this.handleStakeDeposited(event);
                break;
            case 'StakeWithdrawn':
                this.handleStakeWithdrawn(event);
                break;
            case 'ValidationCompleted':
                this.handleValidationCompleted(event);
                break;
            case 'HybridRewardDistributed':
                this.handleHybridRewardDistributed(event);
                break;
            default:
                console.log('Unknown event:', event.method);
        }
    }

    handleDiscoverySubmitted(event) {
        const [discoveryId, miner, workType, difficulty, powReward, posReward] = event.data;
        console.log('Discovery submitted (Hybrid):', {
            discoveryId: discoveryId.toString(),
            miner: miner.toString(),
            workType: workType.toString(),
            difficulty: difficulty.toNumber(),
            powReward: powReward.toString(), // $MINED
            posReward: posReward.toString()  // $RETH
        });
        
        // Update UI
        if (window.updateDiscoveries) {
            window.updateDiscoveries({
                id: discoveryId.toString(),
                miner: miner.toString(),
                workType: workType.toString(),
                difficulty: difficulty.toNumber(),
                powReward: powReward.toString(),
                posReward: posReward.toString()
            });
        }
    }

    handleMiningSessionStarted(event) {
        const [miner, workType, difficulty, stakeAmount] = event.data;
        console.log('Mining session started (with stake):', {
            miner: miner.toString(),
            workType: workType.toString(),
            difficulty: difficulty.toNumber(),
            stakeAmount: stakeAmount.toString()
        });
        
        // Update UI
        if (window.updateMiningSessions) {
            window.updateMiningSessions({
                miner: miner.toString(),
                workType: workType.toString(),
                difficulty: difficulty.toNumber(),
                stakeAmount: stakeAmount.toString(),
                status: 'active'
            });
        }
    }

    handleMiningSessionCompleted(event) {
        const [miner, workType, difficulty] = event.data;
        console.log('Mining session completed:', {
            miner: miner.toString(),
            workType: workType.toString(),
            difficulty: difficulty.toNumber()
        });
        
        // Update UI
        if (window.updateMiningSessions) {
            window.updateMiningSessions({
                miner: miner.toString(),
                workType: workType.toString(),
                difficulty: difficulty.toNumber(),
                status: 'completed'
            });
        }
    }

    handleStakeDeposited(event) {
        const [validator, amount] = event.data;
        console.log('Stake deposited:', {
            validator: validator.toString(),
            amount: amount.toString()
        });
        
        // Update UI
        if (window.updateStakes) {
            window.updateStakes({
                validator: validator.toString(),
                amount: amount.toString(),
                action: 'deposited'
            });
        }
    }

    handleStakeWithdrawn(event) {
        const [validator, amount] = event.data;
        console.log('Stake withdrawn:', {
            validator: validator.toString(),
            amount: amount.toString()
        });
        
        // Update UI
        if (window.updateStakes) {
            window.updateStakes({
                validator: validator.toString(),
                amount: amount.toString(),
                action: 'withdrawn'
            });
        }
    }

    handleValidationCompleted(event) {
        const [validator, discoveryId, reward] = event.data;
        console.log('Validation completed:', {
            validator: validator.toString(),
            discoveryId: discoveryId.toString(),
            reward: reward.toString() // $RETH
        });
        
        // Update UI
        if (window.updateValidations) {
            window.updateValidations({
                validator: validator.toString(),
                discoveryId: discoveryId.toString(),
                reward: reward.toString()
            });
        }
    }

    handleHybridRewardDistributed(event) {
        const [account, powReward, posReward] = event.data;
        console.log('Hybrid reward distributed:', {
            account: account.toString(),
            powReward: powReward.toString(), // $MINED
            posReward: posReward.toString()  // $RETH
        });
        
        // Update UI
        if (window.updateHybridRewards) {
            window.updateHybridRewards({
                account: account.toString(),
                powReward: powReward.toString(),
                posReward: posReward.toString()
            });
        }
    }

    // Account management
    async createAccount(mnemonic = null) {
        try {
            let account;
            if (mnemonic) {
                account = this.keyring.addFromMnemonic(mnemonic);
            } else {
                account = this.keyring.addFromUri('//Alice'); // Default test account
            }
            
            console.log('Account created:', account.address);
            return account;
        } catch (error) {
            console.error('Failed to create account:', error);
            throw error;
        }
    }

    async getAccountBalance(address) {
        try {
            const { data: balance } = await this.api.query.system.account(address);
            return balance.free.toString();
        } catch (error) {
            console.error('Failed to get account balance:', error);
            throw error;
        }
    }

    // PoW: Mathematical mining functions
    async submitDiscovery(workType, difficulty, result, proofOfWork, quantumSecurity) {
        try {
            const account = this.keyring.getPair('//Alice');
            
            const tx = this.api.tx.productiveMiner.submitDiscovery(
                workType,
                difficulty,
                result,
                proofOfWork,
                quantumSecurity
            );
            
            const hash = await tx.signAndSend(account);
            console.log('Discovery submitted with hash:', hash.toHex());
            
            return hash.toHex();
        } catch (error) {
            console.error('Failed to submit discovery:', error);
            throw error;
        }
    }

    async startMiningSession(workType, difficulty, stakeAmount) {
        try {
            const account = this.keyring.getPair('//Alice');
            
            const tx = this.api.tx.productiveMiner.startMiningSession(
                workType,
                difficulty,
                stakeAmount
            );
            
            const hash = await tx.signAndSend(account);
            console.log('Mining session started with hash:', hash.toHex());
            
            return hash.toHex();
        } catch (error) {
            console.error('Failed to start mining session:', error);
            throw error;
        }
    }

    async completeMiningSession(sessionIndex) {
        try {
            const account = this.keyring.getPair('//Alice');
            
            const tx = this.api.tx.productiveMiner.completeMiningSession(sessionIndex);
            
            const hash = await tx.signAndSend(account);
            console.log('Mining session completed with hash:', hash.toHex());
            
            return hash.toHex();
        } catch (error) {
            console.error('Failed to complete mining session:', error);
            throw error;
        }
    }

    // PoS: Stake-based validation functions
    async depositStake(amount) {
        try {
            const account = this.keyring.getPair('//Alice');
            
            const tx = this.api.tx.productiveMiner.depositStake(amount);
            
            const hash = await tx.signAndSend(account);
            console.log('Stake deposited with hash:', hash.toHex());
            
            return hash.toHex();
        } catch (error) {
            console.error('Failed to deposit stake:', error);
            throw error;
        }
    }

    async withdrawStake(amount) {
        try {
            const account = this.keyring.getPair('//Alice');
            
            const tx = this.api.tx.productiveMiner.withdrawStake(amount);
            
            const hash = await tx.signAndSend(account);
            console.log('Stake withdrawn with hash:', hash.toHex());
            
            return hash.toHex();
        } catch (error) {
            console.error('Failed to withdraw stake:', error);
            throw error;
        }
    }

    async validateDiscovery(discoveryId) {
        try {
            const account = this.keyring.getPair('//Alice');
            
            const tx = this.api.tx.productiveMiner.validateDiscovery(discoveryId);
            
            const hash = await tx.signAndSend(account);
            console.log('Discovery validated with hash:', hash.toHex());
            
            return hash.toHex();
        } catch (error) {
            console.error('Failed to validate discovery:', error);
            throw error;
        }
    }

    // Query functions for hybrid system
    async getDiscoveries() {
        try {
            const discoveries = await this.api.query.productiveMiner.discoveries.entries();
            return discoveries.map(([key, discovery]) => ({
                id: key.args[0].toString(),
                ...discovery.toHuman()
            }));
        } catch (error) {
            console.error('Failed to get discoveries:', error);
            throw error;
        }
    }

    async getMiningSessions(address) {
        try {
            const sessions = await this.api.query.productiveMiner.miningSessions.entries(address);
            return sessions.map(([key, session]) => ({
                index: key.args[1].toNumber(),
                ...session.toHuman()
            }));
        } catch (error) {
            console.error('Failed to get mining sessions:', error);
            throw error;
        }
    }

    async getStakes(address) {
        try {
            const stake = await this.api.query.productiveMiner.stakes(address);
            return stake.toHuman();
        } catch (error) {
            console.error('Failed to get stakes:', error);
            throw error;
        }
    }

    async getValidators() {
        try {
            const validators = await this.api.query.productiveMiner.validators.entries();
            return validators.map(([key, isValidator]) => ({
                address: key.args[0].toString(),
                isValidator: isValidator.toHuman()
            }));
        } catch (error) {
            console.error('Failed to get validators:', error);
            throw error;
        }
    }

    // Hybrid reward queries
    async getMinerRewards(address) {
        try {
            const rewards = await this.api.query.productiveMiner.minerRewards(address);
            return rewards.toString(); // $MINED
        } catch (error) {
            console.error('Failed to get miner rewards:', error);
            throw error;
        }
    }

    async getValidatorRewards(address) {
        try {
            const rewards = await this.api.query.productiveMiner.validatorRewards(address);
            return rewards.toString(); // $RETH
        } catch (error) {
            console.error('Failed to get validator rewards:', error);
            throw error;
        }
    }

    async getTotalPowRewards() {
        try {
            const total = await this.api.query.productiveMiner.totalPowRewards();
            return total.toString(); // Total $MINED distributed
        } catch (error) {
            console.error('Failed to get total PoW rewards:', error);
            throw error;
        }
    }

    async getTotalPosRewards() {
        try {
            const total = await this.api.query.productiveMiner.totalPosRewards();
            return total.toString(); // Total $RETH distributed
        } catch (error) {
            console.error('Failed to get total PoS rewards:', error);
            throw error;
        }
    }

    async getTotalDiscoveries() {
        try {
            const total = await this.api.query.productiveMiner.totalDiscoveries();
            return total.toNumber();
        } catch (error) {
            console.error('Failed to get total discoveries:', error);
            throw error;
        }
    }

    async getTotalValidations() {
        try {
            const total = await this.api.query.productiveMiner.totalValidations();
            return total.toNumber();
        } catch (error) {
            console.error('Failed to get total validations:', error);
            throw error;
        }
    }

    // Chain information
    async getChainInfo() {
        try {
            const [chain, nodeName, nodeVersion] = await Promise.all([
                this.api.rpc.system.chain(),
                this.api.rpc.system.name(),
                this.api.rpc.system.version()
            ]);
            
            return {
                chain: chain.toString(),
                nodeName: nodeName.toString(),
                nodeVersion: nodeVersion.toString()
            };
        } catch (error) {
            console.error('Failed to get chain info:', error);
            throw error;
        }
    }

    async getLatestBlock() {
        try {
            const header = await this.api.rpc.chain.getHeader();
            return {
                number: header.number.toNumber(),
                hash: header.hash.toHex()
            };
        } catch (error) {
            console.error('Failed to get latest block:', error);
            throw error;
        }
    }

    // Disconnect
    async disconnect() {
        if (this.api) {
            await this.api.disconnect();
        }
        if (this.wsProvider) {
            this.wsProvider.disconnect();
        }
        this.isConnected = false;
        console.log('Disconnected from Polkadot Hybrid node');
    }
}

// Export the integration class
export default PolkadotHybridIntegration;

// Global instance for easy access
window.polkadotHybridIntegration = new PolkadotHybridIntegration(); 