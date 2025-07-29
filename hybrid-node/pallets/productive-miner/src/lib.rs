#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode};
use frame_support::{
    decl_module, decl_storage, decl_event, decl_error, ensure,
    traits::{Get, ReservableCurrency},
    dispatch::DispatchResult,
};
use frame_system::ensure_signed;
use sp_runtime::traits::Hash;
use sp_std::prelude::*;
use scale_info::TypeInfo;

#[cfg(test)]
mod tests;

pub trait Config: frame_system::Config {
    type RuntimeEvent: From<Event<Self>> + Into<<Self as frame_system::Config>::RuntimeEvent>;
    type Currency: ReservableCurrency<Self::AccountId>;
    type MaxDifficulty: Get<u32>;
    type BaseReward: Get<u128>;
    type BlockTime: Get<u32>;
    type QuantumSecurityLevel: Get<u32>;
    type MinStakeAmount: Get<u128>;
    type PoWRewardMultiplier: Get<u32>;
    type PoSRewardMultiplier: Get<u32>;
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, TypeInfo)]
pub struct Discovery<AccountId, BlockNumber> {
    miner: AccountId,
    work_type: Vec<u8>,
    difficulty: u32,
    result: Vec<u8>,
    proof_of_work: Vec<u8>,
    quantum_security: u32,
    timestamp: BlockNumber,
    pow_reward: u128,  // $MINED earned
    pos_reward: u128,  // $RETH earned
    verified: bool,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, TypeInfo)]
pub struct MiningSession<AccountId, BlockNumber> {
    miner: AccountId,
    work_type: Vec<u8>,
    difficulty: u32,
    start_time: BlockNumber,
    end_time: Option<BlockNumber>,
    progress: u32,
    active: bool,
    stake_amount: u128,  // PoS stake for validation
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, TypeInfo)]
pub struct StakeInfo {
    amount: u128,
    validation_count: u32,
    total_rewards: u128,
}

decl_storage! {
    trait Store for Module<T: Config> as ProductiveMiner {
        // PoW Components
        Discoveries get(fn discoveries): map hasher(blake2_128_concat) T::Hash => Option<Discovery<T::AccountId, T::BlockNumber>>;
        MiningSessions get(fn mining_sessions): double_map hasher(blake2_128_concat) T::AccountId, hasher(blake2_128_concat) u32 => Option<MiningSession<T::AccountId, T::BlockNumber>>;
        
        // PoS Components
        Stakes get(fn stakes): map hasher(blake2_128_concat) T::AccountId => Option<StakeInfo>;
        Validators get(fn validators): map hasher(blake2_128_concat) T::AccountId => bool;
        
        // Hybrid Rewards
        MinerRewards get(fn miner_rewards): map hasher(blake2_128_concat) T::AccountId => u128;  // $MINED
        ValidatorRewards get(fn validator_rewards): map hasher(blake2_128_concat) T::AccountId => u128;  // $RETH
        
        // System State
        WorkTypes get(fn work_types): map hasher(blake2_128_concat) Vec<u8> => bool;
        TotalDiscoveries get(fn total_discoveries): u32;
        TotalValidations get(fn total_validations): u32;
        TotalPowRewards get(fn total_pow_rewards): u128;  // Total $MINED distributed
        TotalPosRewards get(fn total_pos_rewards): u128;  // Total $RETH distributed
        
        // Configuration
        MaxDifficulty get(fn max_difficulty): u32;
        BaseReward get(fn base_reward): u128;
        BlockTime get(fn block_time): u32;
        QuantumSecurityLevel get(fn quantum_security_level): u32;
        MinStakeAmount get(fn min_stake_amount): u128;
        PoWRewardMultiplier get(fn pow_reward_multiplier): u32;
        PoSRewardMultiplier get(fn pos_reward_multiplier): u32;
    }
}

decl_event!(
    pub enum Event<T> where
        AccountId = <T as frame_system::Config>::AccountId,
        Hash = <T as frame_system::Config>::Hash,
    {
        // PoW Events
        DiscoverySubmitted(Hash, AccountId, Vec<u8>, u32, u128, u128),  // discoveryId, miner, workType, difficulty, powReward, posReward
        MiningSessionStarted(AccountId, Vec<u8>, u32, u128),  // miner, workType, difficulty, stakeAmount
        MiningSessionCompleted(AccountId, Vec<u8>, u32),
        
        // PoS Events
        StakeDeposited(AccountId, u128),  // validator, amount
        StakeWithdrawn(AccountId, u128),  // validator, amount
        ValidationCompleted(AccountId, Hash, u128),  // validator, discoveryId, reward
        
        // Hybrid Events
        HybridRewardDistributed(AccountId, u128, u128),  // account, powReward, posReward
    }
);

decl_error! {
    pub enum Error for Module<T: Config> {
        WorkTypeNotSupported,
        DifficultyTooHigh,
        InsufficientQuantumSecurity,
        DiscoveryNotFound,
        MiningSessionNotFound,
        MiningSessionAlreadyActive,
        InsufficientStake,
        NotAValidator,
        StakeTooLow,
        ValidationAlreadyCompleted,
    }
}

decl_module! {
    pub struct Module<T: Config> for enum Call where origin: T::RuntimeOrigin {
        type Error = Error<T>;

        fn deposit_event() = default;

        // PoW: Submit mathematical discovery
        #[weight = 10_000]
        pub fn submit_discovery(
            origin,
            work_type: Vec<u8>,
            difficulty: u32,
            result: Vec<u8>,
            proof_of_work: Vec<u8>,
            quantum_security: u32,
        ) -> DispatchResult {
            let miner = ensure_signed(origin)?;
            
            ensure!(WorkTypes::contains_key(&work_type), Error::<T>::WorkTypeNotSupported);
            ensure!(difficulty <= MaxDifficulty::get(), Error::<T>::DifficultyTooHigh);
            ensure!(quantum_security >= QuantumSecurityLevel::get(), Error::<T>::InsufficientQuantumSecurity);

            let discovery_id = T::Hashing::hash_of(&(
                &miner,
                &work_type,
                &difficulty,
                &result,
                &proof_of_work,
                &quantum_security,
                &frame_system::Pallet::<T>::block_number(),
            ));

            // Calculate hybrid rewards
            let pow_reward = Self::calculate_pow_reward(difficulty, quantum_security);
            let pos_reward = Self::calculate_pos_reward(difficulty, quantum_security);

            let discovery = Discovery {
                miner: miner.clone(),
                work_type: work_type.clone(),
                difficulty,
                result,
                proof_of_work,
                quantum_security,
                timestamp: frame_system::Pallet::<T>::block_number(),
                pow_reward,
                pos_reward,
                verified: false,
            };

            Discoveries::<T>::insert(discovery_id, discovery);
            MinerRewards::<T>::mutate(&miner, |rewards| *rewards += pow_reward);
            TotalDiscoveries::mutate(|total| *total += 1);
            TotalPowRewards::mutate(|total| *total += pow_reward);

            Self::deposit_event(RawEvent::DiscoverySubmitted(
                discovery_id,
                miner,
                work_type,
                difficulty,
                pow_reward,
                pos_reward,
            ));

            Ok(())
        }

        // PoW: Start mining session with stake
        #[weight = 10_000]
        pub fn start_mining_session(
            origin,
            work_type: Vec<u8>,
            difficulty: u32,
            stake_amount: u128,
        ) -> DispatchResult {
            let miner = ensure_signed(origin)?;
            
            ensure!(WorkTypes::contains_key(&work_type), Error::<T>::WorkTypeNotSupported);
            ensure!(difficulty <= MaxDifficulty::get(), Error::<T>::DifficultyTooHigh);
            ensure!(stake_amount >= MinStakeAmount::get(), Error::<T>::StakeTooLow);

            // Reserve stake for PoS validation - convert to Balance type
            let balance_amount = TryInto::<<<T as Config>::Currency as frame_support::traits::Currency<<T as frame_system::Config>::AccountId>>::Balance>::try_into(stake_amount)
                .map_err(|_| Error::<T>::StakeTooLow)?;
            T::Currency::reserve(&miner, balance_amount)?;

            let session_count = MiningSessions::<T>::iter_prefix(&miner).count() as u32;
            
            let mining_session = MiningSession {
                miner: miner.clone(),
                work_type: work_type.clone(),
                difficulty,
                start_time: frame_system::Pallet::<T>::block_number(),
                end_time: None,
                progress: 0,
                active: true,
                stake_amount,
            };

            MiningSessions::<T>::insert(&miner, session_count, mining_session);

            Self::deposit_event(RawEvent::MiningSessionStarted(
                miner,
                work_type,
                difficulty,
                stake_amount,
            ));

            Ok(())
        }

        // PoW: Complete mining session
        #[weight = 10_000]
        pub fn complete_mining_session(
            origin,
            session_index: u32,
        ) -> DispatchResult {
            let miner = ensure_signed(origin)?;
            
            let session = MiningSessions::<T>::get(&miner, session_index)
                .ok_or(Error::<T>::MiningSessionNotFound)?;
            
            ensure!(session.active, Error::<T>::MiningSessionNotFound);

            let mut updated_session = session.clone();
            updated_session.end_time = Some(frame_system::Pallet::<T>::block_number());
            updated_session.active = false;
            updated_session.progress = 100;

            MiningSessions::<T>::insert(&miner, session_index, updated_session);

            Self::deposit_event(RawEvent::MiningSessionCompleted(
                miner,
                session.work_type,
                session.difficulty,
            ));

            Ok(())
        }

        // PoS: Deposit stake to become validator
        #[weight = 10_000]
        pub fn deposit_stake(
            origin,
            amount: u128,
        ) -> DispatchResult {
            let validator = ensure_signed(origin)?;
            
            ensure!(amount >= MinStakeAmount::get(), Error::<T>::StakeTooLow);

            // Reserve stake - convert to Balance type
            let balance_amount = TryInto::<<<T as Config>::Currency as frame_support::traits::Currency<<T as frame_system::Config>::AccountId>>::Balance>::try_into(amount)
                .map_err(|_| Error::<T>::StakeTooLow)?;
            T::Currency::reserve(&validator, balance_amount)?;

            let current_stake = Stakes::<T>::get(&validator).unwrap_or(StakeInfo {
                amount: 0,
                validation_count: 0,
                total_rewards: 0,
            });

            let new_stake = StakeInfo {
                amount: current_stake.amount + amount,
                validation_count: current_stake.validation_count,
                total_rewards: current_stake.total_rewards,
            };

            Stakes::<T>::insert(&validator, new_stake);
            Validators::<T>::insert(&validator, true);

            Self::deposit_event(RawEvent::StakeDeposited(validator, amount));

            Ok(())
        }

        // PoS: Withdraw stake
        #[weight = 10_000]
        pub fn withdraw_stake(
            origin,
            amount: u128,
        ) -> DispatchResult {
            let validator = ensure_signed(origin)?;
            
            let current_stake = Stakes::<T>::get(&validator)
                .ok_or(Error::<T>::NotAValidator)?;
            
            ensure!(amount <= current_stake.amount, Error::<T>::InsufficientStake);

            // Unreserve stake - convert to Balance type
            let balance_amount = TryInto::<<<T as Config>::Currency as frame_support::traits::Currency<<T as frame_system::Config>::AccountId>>::Balance>::try_into(amount)
                .map_err(|_| Error::<T>::InsufficientStake)?;
            T::Currency::unreserve(&validator, balance_amount);

            let new_stake = StakeInfo {
                amount: current_stake.amount - amount,
                validation_count: current_stake.validation_count,
                total_rewards: current_stake.total_rewards,
            };

            if new_stake.amount == 0 {
                Stakes::<T>::remove(&validator);
                Validators::<T>::remove(&validator);
            } else {
                Stakes::<T>::insert(&validator, new_stake);
            }

            Self::deposit_event(RawEvent::StakeWithdrawn(validator, amount));

            Ok(())
        }

        // PoS: Validate discovery (hybrid PoW/PoS)
        #[weight = 10_000]
        pub fn validate_discovery(
            origin,
            discovery_id: T::Hash,
        ) -> DispatchResult {
            let validator = ensure_signed(origin)?;
            
            ensure!(Validators::<T>::contains_key(&validator), Error::<T>::NotAValidator);
            
            let discovery = Discoveries::<T>::get(discovery_id)
                .ok_or(Error::<T>::DiscoveryNotFound)?;
            
            ensure!(!discovery.verified, Error::<T>::ValidationAlreadyCompleted);

            // Calculate validation reward based on stake
            let stake_info = Stakes::<T>::get(&validator).unwrap_or(StakeInfo {
                amount: 0,
                validation_count: 0,
                total_rewards: 0,
            });

            let validation_reward = discovery.pos_reward * stake_info.amount / MinStakeAmount::get();

            // Update validator rewards
            ValidatorRewards::<T>::mutate(&validator, |rewards| *rewards += validation_reward);
            TotalPosRewards::mutate(|total| *total += validation_reward);

            // Update validator stats
            Stakes::<T>::mutate(&validator, |stake_info| {
                if let Some(ref mut info) = stake_info {
                    info.validation_count += 1;
                    info.total_rewards += validation_reward;
                }
            });

            // Mark discovery as verified
            Discoveries::<T>::mutate(discovery_id, |discovery_opt| {
                if let Some(ref mut discovery) = discovery_opt {
                    discovery.verified = true;
                }
            });

            TotalValidations::mutate(|total| *total += 1);

            Self::deposit_event(RawEvent::ValidationCompleted(
                validator,
                discovery_id,
                validation_reward,
            ));

            Ok(())
        }

        // Initialize work types
        #[weight = 10_000]
        pub fn initialize_work_types(origin) -> DispatchResult {
            let _ = ensure_signed(origin)?;
            
            let work_types = vec![
                b"Prime Pattern Discovery".to_vec(),
                b"Riemann Zero Computation".to_vec(),
                b"Yang-Mills Field Theory".to_vec(),
                b"Goldbach Conjecture Verification".to_vec(),
                b"Navier-Stokes Simulation".to_vec(),
                b"Birch-Swinnerton-Dyer".to_vec(),
                b"Elliptic Curve Cryptography".to_vec(),
                b"Lattice Cryptography".to_vec(),
                b"Poincar\xE9 Conjecture".to_vec(),
            ];

            for work_type in work_types {
                WorkTypes::insert(&work_type, true);
            }

            Ok(())
        }
    }
}

impl<T: Config> Module<T> {
    // Calculate PoW reward ($MINED)
    fn calculate_pow_reward(difficulty: u32, quantum_security: u32) -> u128 {
        let base_reward = BaseReward::get() * difficulty as u128;
        let quantum_bonus = (quantum_security / QuantumSecurityLevel::get()) as u128 * 10;
        let pow_multiplier = PoWRewardMultiplier::get() as u128;
        
        (base_reward + quantum_bonus) * pow_multiplier
    }

    // Calculate PoS reward ($RETH)
    fn calculate_pos_reward(difficulty: u32, quantum_security: u32) -> u128 {
        let base_reward = BaseReward::get() * difficulty as u128;
        let quantum_bonus = (quantum_security / QuantumSecurityLevel::get()) as u128 * 5;
        let pos_multiplier = PoSRewardMultiplier::get() as u128;
        
        (base_reward + quantum_bonus) * pos_multiplier
    }
} 