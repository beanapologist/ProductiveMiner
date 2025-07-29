#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    construct_runtime, parameter_types,
    traits::Everything,
};
use sp_core::H256;
use sp_runtime::{
    traits::{BlakeTwo256, IdentityLookup},
    Perbill,
};

pub use pallet_productive_miner;

type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Runtime>;
type Block = frame_system::mocking::MockBlock<Runtime>;

construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = Block,
        UncheckedExtrinsic = UncheckedExtrinsic,
    {
        System: frame_system::{Pallet, Call, Config, Storage, Event<T>},
        Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},
        ProductiveMiner: pallet_productive_miner::{Pallet, Call, Storage, Event<T>},
    }
);

parameter_types! {
    pub const BlockHashCount: u64 = 250;
    pub const MaximumBlockWeight: u32 = 1024;
    pub const MaximumBlockLength: u32 = 2 * 1024;
    pub const AvailableBlockRatio: Perbill = Perbill::from_percent(75);
    pub const ExistentialDeposit: u128 = 500;
    pub const MaxDifficulty: u32 = 1000000;
    pub const BaseReward: u128 = 100;
    pub const BlockTime: u32 = 6000;
    pub const QuantumSecurityLevel: u32 = 256;
    pub const MinStakeAmount: u128 = 1000;
    pub const PoWRewardMultiplier: u32 = 2;
    pub const PoSRewardMultiplier: u32 = 3;
}

impl frame_system::Config for Runtime {
    type BaseCallFilter = Everything;
    type BlockWeights = ();
    type BlockLength = ();
    type DbWeight = ();
    type RuntimeOrigin = RuntimeOrigin;
    type RuntimeCall = RuntimeCall;
    type Index = u64;
    type BlockNumber = u64;
    type Hash = H256;
    type Hashing = BlakeTwo256;
    type AccountId = u64;
    type Lookup = IdentityLookup<Self::AccountId>;
    type Header = sp_runtime::testing::Header;
    type RuntimeEvent = RuntimeEvent;
    type BlockHashCount = BlockHashCount;
    type Version = ();
    type PalletInfo = PalletInfo;
    type AccountData = pallet_balances::AccountData<u128>;
    type OnNewAccount = ();
    type OnKilledAccount = ();
    type SystemWeightInfo = ();
    type SS58Prefix = ();
    type OnSetCode = ();
    type MaxConsumers = frame_support::traits::ConstU32<16>;
}

impl pallet_balances::Config for Runtime {
    type MaxReserves = ();
    type ReserveIdentifier = [u8; 8];
    type MaxLocks = ();
    type Balance = u128;
    type DustRemoval = ();
    type RuntimeEvent = RuntimeEvent;
    type ExistentialDeposit = ExistentialDeposit;
    type AccountStore = System;
    type WeightInfo = ();
    type FreezeIdentifier = ();
    type MaxFreezes = ();
    type HoldIdentifier = ();
    type MaxHolds = ();
}

impl pallet_productive_miner::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type Currency = Balances;
    type MaxDifficulty = MaxDifficulty;
    type BaseReward = BaseReward;
    type BlockTime = BlockTime;
    type QuantumSecurityLevel = QuantumSecurityLevel;
    type MinStakeAmount = MinStakeAmount;
    type PoWRewardMultiplier = PoWRewardMultiplier;
    type PoSRewardMultiplier = PoSRewardMultiplier;
}
