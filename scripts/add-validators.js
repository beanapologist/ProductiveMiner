#!/usr/bin/env node

/**
 * Validator Management Script
 * Demonstrates adding more validators to the Proof of Stake system
 */

import crypto from 'crypto';

// Simulate blockchain state for demonstration
const blockchainState = {
  validators: new Map()
};

// Initialize with existing validators
function initializeValidators() {
  blockchainState.validators.set('validator-1', { stake: 100000, address: '0x1234567890abcdef1234567890abcdef12345678' });
  blockchainState.validators.set('validator-2', { stake: 150000, address: '0x2345678901bcdef1234567890abcdef1234567890' });
  blockchainState.validators.set('validator-3', { stake: 200000, address: '0x3456789012cdef1234567890abcdef12345678901' });
  blockchainState.validators.set('validator-4', { stake: 125000, address: '0x4567890123def1234567890abcdef123456789012' });
  blockchainState.validators.set('validator-5', { stake: 175000, address: '0x5678901234ef1234567890abcdef1234567890123' });
  blockchainState.validators.set('validator-6', { stake: 225000, address: '0x6789012345f1234567890abcdef12345678901234' });
  blockchainState.validators.set('validator-7', { stake: 300000, address: '0x78901234561234567890abcdef123456789012345' });
  blockchainState.validators.set('validator-8', { stake: 250000, address: '0x8901234567234567890abcdef1234567890123456' });
  blockchainState.validators.set('validator-9', { stake: 180000, address: '0x901234567834567890abcdef12345678901234567' });
  blockchainState.validators.set('validator-10', { stake: 275000, address: '0xa01234567894567890abcdef123456789012345678' });
  blockchainState.validators.set('validator-11', { stake: 140000, address: '0xb1234567890567890abcdef1234567890123456789' });
  blockchainState.validators.set('validator-12', { stake: 190000, address: '0xc234567890167890abcdef12345678901234567890' });
  blockchainState.validators.set('validator-13', { stake: 320000, address: '0xd345678901278901abcdef123456789012345678901' });
  blockchainState.validators.set('validator-14', { stake: 160000, address: '0xe456789012389012abcdef1234567890123456789012' });
  blockchainState.validators.set('validator-15', { stake: 240000, address: '0xf567890123490123abcdef12345678901234567890123' });
}

// Validator management functions
function addValidator(validatorId, stake, address) {
  if (blockchainState.validators.has(validatorId)) {
    console.log(`❌ Validator ${validatorId} already exists`);
    return false;
  }
  
  blockchainState.validators.set(validatorId, { stake, address });
  console.log(`✅ Added validator ${validatorId} with stake ${stake}`);
  return true;
}

function getValidatorCount() {
  return blockchainState.validators.size;
}

function getTotalStake() {
  return Array.from(blockchainState.validators.values())
    .reduce((sum, validator) => sum + validator.stake, 0);
}

function getTopValidators(limit = 10) {
  return Array.from(blockchainState.validators.entries())
    .sort(([, a], [, b]) => b.stake - a.stake)
    .slice(0, limit)
    .map(([id, validator]) => ({
      id,
      stake: validator.stake,
      address: validator.address
    }));
}

function generateAddress() {
  return '0x' + crypto.randomBytes(20).toString('hex');
}

function generateStake() {
  // Generate stake between 100,000 and 500,000
  return Math.floor(Math.random() * 400000) + 100000;
}

// Add more validators
function addMoreValidators() {
  console.log('\n🔗 Adding more validators to the PoS system...\n');
  
  // Add validators 16-30
  for (let i = 16; i <= 30; i++) {
    const validatorId = `validator-${i}`;
    const stake = generateStake();
    const address = generateAddress();
    
    addValidator(validatorId, stake, address);
  }
  
  // Add some high-stake validators
  addValidator('validator-enterprise-1', 500000, generateAddress());
  addValidator('validator-enterprise-2', 450000, generateAddress());
  addValidator('validator-enterprise-3', 400000, generateAddress());
  
  // Add some institutional validators
  addValidator('validator-institutional-1', 600000, generateAddress());
  addValidator('validator-institutional-2', 550000, generateAddress());
  
  // Add some community validators with smaller stakes
  for (let i = 1; i <= 5; i++) {
    const validatorId = `validator-community-${i}`;
    const stake = Math.floor(Math.random() * 50000) + 50000; // 50k-100k
    const address = generateAddress();
    
    addValidator(validatorId, stake, address);
  }
}

// Display validator statistics
function displayValidatorStats() {
  console.log('\n📊 Validator Network Statistics:\n');
  
  const totalValidators = getValidatorCount();
  const totalStake = getTotalStake();
  const topValidators = getTopValidators(15);
  
  console.log(`Total Validators: ${totalValidators}`);
  console.log(`Total Stake: ${totalStake.toLocaleString()} tokens`);
  console.log(`Average Stake: ${Math.round(totalStake / totalValidators).toLocaleString()} tokens`);
  
  console.log('\n🏆 Top 15 Validators by Stake:');
  console.log('─'.repeat(80));
  console.log('Rank | Validator ID           | Stake      | Address');
  console.log('─'.repeat(80));
  
  topValidators.forEach((validator, index) => {
    const rank = (index + 1).toString().padStart(2);
    const id = validator.id.padEnd(22);
    const stake = validator.stake.toLocaleString().padStart(10);
    const address = validator.address.substring(0, 20) + '...';
    
    console.log(`${rank}   | ${id} | ${stake} | ${address}`);
  });
  
  console.log('─'.repeat(80));
}

// Simulate PoS validation
function simulatePoSValidation() {
  console.log('\n🎲 Simulating PoS Block Validation...\n');
  
  const totalStake = getTotalStake();
  const validators = Array.from(blockchainState.validators.entries());
  
  // Simulate 10 block validations
  for (let i = 1; i <= 10; i++) {
    const randomValue = Math.random() * totalStake;
    let currentSum = 0;
    let selectedValidator = null;
    
    for (const [id, validator] of validators) {
      currentSum += validator.stake;
      if (randomValue <= currentSum) {
        selectedValidator = { id, ...validator };
        break;
      }
    }
    
    if (selectedValidator) {
      console.log(`Block ${i}: ✅ Validated by ${selectedValidator.id} (stake: ${selectedValidator.stake.toLocaleString()})`);
    }
  }
}

// Main execution
function main() {
  console.log('🚀 Enhanced PoS Validator System');
  console.log('================================\n');
  
  // Initialize existing validators
  initializeValidators();
  console.log(`✅ Initialized ${getValidatorCount()} validators`);
  
  // Display initial stats
  displayValidatorStats();
  
  // Add more validators
  addMoreValidators();
  
  // Display updated stats
  displayValidatorStats();
  
  // Simulate PoS validation
  simulatePoSValidation();
  
  console.log('\n🎉 Validator network successfully expanded!');
  console.log(`📈 Network now has ${getValidatorCount()} validators with ${getTotalStake().toLocaleString()} total stake`);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  initializeValidators,
  addValidator,
  getValidatorCount,
  getTotalStake,
  getTopValidators,
  addMoreValidators,
  displayValidatorStats,
  simulatePoSValidation
}; 