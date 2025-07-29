import { ApiPromise, WsProvider } from '@polkadot/api';
import axios from 'axios';

class HybridIntegration {
    constructor() {
        this.api = null;
        this.backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';
        this.substrateUrl = process.env.REACT_APP_SUBSTRATE_URL || 'ws://localhost:9944';
        this.isConnected = false;
        this.substrateConnected = false;
    }

    // Initialize connections
    async initialize() {
        try {
            // Connect to Substrate node
            const provider = new WsProvider(this.substrateUrl);
            this.api = await ApiPromise.create({ provider });
            this.substrateConnected = true;
            console.log('✅ Connected to hybrid Substrate node');

            // Test backend connection
            const response = await axios.get(`${this.backendUrl}/api/health`);
            if (response.data.status === 'healthy') {
                this.isConnected = true;
                console.log('✅ Connected to backend API');
            }

            return {
                substrate: this.substrateConnected,
                backend: this.isConnected
            };
        } catch (error) {
            console.error('❌ Connection failed:', error);
            return {
                substrate: false,
                backend: false
            };
        }
    }

    // Backend API methods
    async getBackendHealth() {
        try {
            const response = await axios.get(`${this.backendUrl}/api/health`);
            return response.data;
        } catch (error) {
            console.error('Backend health check failed:', error);
            return null;
        }
    }

    async getBackendBalance() {
        try {
            const response = await axios.get(`${this.backendUrl}/api/balance`);
            return response.data;
        } catch (error) {
            console.error('Failed to get balance from backend:', error);
            return null;
        }
    }

    async startBackendMining(workType, difficulty) {
        try {
            const response = await axios.post(`${this.backendUrl}/api/mining/mine`, {
                workType,
                difficulty
            });
            return response.data;
        } catch (error) {
            console.error('Failed to start mining on backend:', error);
            return null;
        }
    }

    // Substrate node methods
    async getSubstrateBalance(address) {
        try {
            if (!this.api) return null;
            
            const { data: balance } = await this.api.query.system.account(address);
            return {
                free: balance.free.toString(),
                reserved: balance.reserved.toString(),
                miscFrozen: balance.miscFrozen.toString(),
                feeFrozen: balance.feeFrozen.toString()
            };
        } catch (error) {
            console.error('Failed to get Substrate balance:', error);
            return null;
        }
    }

    async submitDiscovery(discovery) {
        try {
            if (!this.api) return null;
            
            const tx = this.api.tx.productiveMiner.submitDiscovery(
                discovery.workType,
                discovery.difficulty,
                discovery.problem,
                discovery.solution,
                discovery.proof
            );
            
            return await tx.signAndSend(this.api.createType('AccountId', discovery.miner));
        } catch (error) {
            console.error('Failed to submit discovery to Substrate:', error);
            return null;
        }
    }

    async startMiningSession(workType, difficulty, stakeAmount) {
        try {
            if (!this.api) return null;
            
            const tx = this.api.tx.productiveMiner.startMiningSession(
                workType,
                difficulty,
                stakeAmount
            );
            
            return await tx.signAndSend(this.api.createType('AccountId', 'miner'));
        } catch (error) {
            console.error('Failed to start mining session on Substrate:', error);
            return null;
        }
    }

    async depositStake(amount) {
        try {
            if (!this.api) return null;
            
            const tx = this.api.tx.productiveMiner.depositStake(amount);
            return await tx.signAndSend(this.api.createType('AccountId', 'staker'));
        } catch (error) {
            console.error('Failed to deposit stake on Substrate:', error);
            return null;
        }
    }

    async withdrawStake(amount) {
        try {
            if (!this.api) return null;
            
            const tx = this.api.tx.productiveMiner.withdrawStake(amount);
            return await tx.signAndSend(this.api.createType('AccountId', 'staker'));
        } catch (error) {
            console.error('Failed to withdraw stake on Substrate:', error);
            return null;
        }
    }

    async validateDiscovery(discoveryId) {
        try {
            if (!this.api) return null;
            
            const tx = this.api.tx.productiveMiner.validateDiscovery(discoveryId);
            return await tx.signAndSend(this.api.createType('AccountId', 'validator'));
        } catch (error) {
            console.error('Failed to validate discovery on Substrate:', error);
            return null;
        }
    }

    // Hybrid methods that combine both systems
    async getHybridBalance(address) {
        const backendBalance = await this.getBackendBalance();
        const substrateBalance = await this.getSubstrateBalance(address);
        
        return {
            backend: backendBalance,
            substrate: substrateBalance,
            hybrid: {
                MINED: (backendBalance?.MINED || 0) + (parseInt(substrateBalance?.free || 0) / 1e18),
                RETH: parseInt(substrateBalance?.free || 0) / 1e18
            }
        };
    }

    async startHybridMining(workType, difficulty, stakeAmount = 0) {
        // Start mining on both systems
        const backendResult = await this.startBackendMining(workType, difficulty);
        const substrateResult = stakeAmount > 0 ? 
            await this.startMiningSession(workType, difficulty, stakeAmount) : null;
        
        return {
            backend: backendResult,
            substrate: substrateResult,
            hybrid: true
        };
    }

    async getHybridStats() {
        try {
            const backendHealth = await this.getBackendHealth();
            const substrateHealth = this.substrateConnected ? 'connected' : 'disconnected';
            
            return {
                backend: backendHealth,
                substrate: substrateHealth,
                hybrid: this.isConnected && this.substrateConnected
            };
        } catch (error) {
            console.error('Failed to get hybrid stats:', error);
            return null;
        }
    }

    // Event listeners for real-time updates
    subscribeToEvents(callback) {
        if (!this.api) return;
        
        this.api.query.system.events((events) => {
            events.forEach((record) => {
                const { event } = record;
                if (event.section === 'productiveMiner') {
                    callback({
                        type: 'substrate',
                        event: event.method,
                        data: event.data
                    });
                }
            });
        });
    }

    // Disconnect
    async disconnect() {
        if (this.api) {
            await this.api.disconnect();
        }
        this.isConnected = false;
        this.substrateConnected = false;
    }
}

export default HybridIntegration; 