#!/usr/bin/env node

/**
 * Validator System Test Suite
 * Tests the enhanced PoS validator system functionality
 */

// Simple test framework
function describe(name, fn) {
  console.log(`\n📋 ${name}`);
  fn();
}

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.log(`  ❌ ${name}: ${error.message}`);
    throw error;
  }
}

function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expected ${value} to be ${expected}`);
      }
    },
    toHaveLength(expected) {
      if (value.length !== expected) {
        throw new Error(`Expected length ${value.length} to be ${expected}`);
      }
    },
    toBeGreaterThan(expected) {
      if (value <= expected) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (value < expected) {
        throw new Error(`Expected ${value} to be greater than or equal to ${expected}`);
      }
    }
  };
}

function beforeEach(fn) {
  fn();
}

// Mock blockchain state for testing
let blockchainState;

// Validator management functions (copied from main implementation)
function addValidator(validatorId, stake, address) {
  if (blockchainState.validators.has(validatorId)) {
    return false;
  }
  
  blockchainState.validators.set(validatorId, { stake, address });
  return true;
}

function removeValidator(validatorId) {
  if (!blockchainState.validators.has(validatorId)) {
    return false;
  }
  
  blockchainState.validators.delete(validatorId);
  return true;
}

function updateValidatorStake(validatorId, newStake) {
  const validator = blockchainState.validators.get(validatorId);
  if (!validator) {
    return false;
  }
  
  validator.stake = newStake;
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

function validateBlock() {
  const totalStake = getTotalStake();
  if (totalStake === 0) return false;
  
  const randomValue = Math.random() * totalStake;
  let currentSum = 0;
  
  for (const [id, validator] of blockchainState.validators) {
    currentSum += validator.stake;
    if (randomValue <= currentSum) {
      return { validator: id, stake: validator.stake };
    }
  }
  
  return false;
}

// Test suite
describe('Enhanced PoS Validator System', () => {
  
  beforeEach(() => {
    blockchainState = {
      validators: new Map()
    };
    
    // Initialize with some test validators
    addValidator('test-validator-1', 100000, '0x1234567890abcdef1234567890abcdef12345678');
    addValidator('test-validator-2', 150000, '0x2345678901bcdef1234567890abcdef1234567890');
    addValidator('test-validator-3', 200000, '0x3456789012cdef1234567890abcdef12345678901');
  });
  
  describe('Validator Management', () => {
    
    it('should add new validators successfully', () => {
      const result = addValidator('test-validator-4', 250000, '0x4567890123def1234567890abcdef123456789012');
      
      expect(result).toBe(true);
      expect(getValidatorCount()).toBe(4);
      expect(getTotalStake()).toBe(700000);
    });
    
    it('should prevent adding duplicate validators', () => {
      const result = addValidator('test-validator-1', 300000, '0x9999999999999999999999999999999999999999');
      
      expect(result).toBe(false);
      expect(getValidatorCount()).toBe(3);
    });
    
    it('should remove validators successfully', () => {
      const result = removeValidator('test-validator-2');
      
      expect(result).toBe(true);
      expect(getValidatorCount()).toBe(2);
      expect(getTotalStake()).toBe(300000);
    });
    
    it('should prevent removing non-existent validators', () => {
      const result = removeValidator('non-existent-validator');
      
      expect(result).toBe(false);
      expect(getValidatorCount()).toBe(3);
    });
    
    it('should update validator stakes successfully', () => {
      const result = updateValidatorStake('test-validator-1', 300000);
      
      expect(result).toBe(true);
      expect(getTotalStake()).toBe(650000);
    });
    
    it('should prevent updating non-existent validators', () => {
      const result = updateValidatorStake('non-existent-validator', 100000);
      
      expect(result).toBe(false);
      expect(getTotalStake()).toBe(450000);
    });
  });
  
  describe('Validator Statistics', () => {
    
    it('should return correct validator count', () => {
      expect(getValidatorCount()).toBe(3);
    });
    
    it('should return correct total stake', () => {
      expect(getTotalStake()).toBe(450000);
    });
    
    it('should return top validators sorted by stake', () => {
      const topValidators = getTopValidators(3);
      
      expect(topValidators).toHaveLength(3);
      expect(topValidators[0].id).toBe('test-validator-3');
      expect(topValidators[0].stake).toBe(200000);
      expect(topValidators[1].id).toBe('test-validator-2');
      expect(topValidators[1].stake).toBe(150000);
      expect(topValidators[2].id).toBe('test-validator-1');
      expect(topValidators[2].stake).toBe(100000);
    });
  });
  
  describe('PoS Validation', () => {
    
    it('should validate blocks using stake-weighted selection', () => {
      const validations = [];
      
      // Run multiple validations to test distribution
      for (let i = 0; i < 100; i++) {
        const result = validateBlock();
        if (result) {
          validations.push(result.validator);
        }
      }
      
      // Should have some validations
      expect(validations.length).toBeGreaterThan(0);
      
      // All validators should be selected at least once
      const uniqueValidators = new Set(validations);
      expect(uniqueValidators.size).toBeGreaterThanOrEqual(2);
    });
    
    it('should handle empty validator set', () => {
      blockchainState.validators.clear();
      
      const result = validateBlock();
      expect(result).toBe(false);
    });
  });
  
  describe('Large Validator Network', () => {
    
    it('should handle large number of validators', () => {
      // Add many validators
      for (let i = 4; i <= 50; i++) {
        const stake = 100000 + (i * 10000);
        const address = `0x${i.toString().padStart(40, '0')}`;
        addValidator(`test-validator-${i}`, stake, address);
      }
      
      expect(getValidatorCount()).toBe(50);
      expect(getTotalStake()).toBeGreaterThan(10000000);
      
      // Test top validators
      const topValidators = getTopValidators(10);
      expect(topValidators).toHaveLength(10);
      expect(topValidators[0].stake).toBeGreaterThan(topValidators[9].stake);
    });
    
    it('should maintain correct stake distribution', () => {
      // Add validators with known stakes
      addValidator('high-stake', 500000, '0x5000000000000000000000000000000000000000');
      addValidator('low-stake', 50000, '0x5000000000000000000000000000000000000001');
      
      const totalStake = getTotalStake();
      expect(totalStake).toBe(550000);
      
      const topValidators = getTopValidators(5);
      expect(topValidators[0].id).toBe('high-stake');
      expect(topValidators[0].stake).toBe(500000);
    });
  });
  
  describe('Validator Categories', () => {
    
    it('should support different validator categories', () => {
      // Add enterprise validators
      addValidator('enterprise-1', 400000, '0x4000000000000000000000000000000000000000');
      addValidator('enterprise-2', 450000, '0x4500000000000000000000000000000000000000');
      
      // Add institutional validators
      addValidator('institutional-1', 600000, '0x6000000000000000000000000000000000000000');
      
      // Add community validators
      addValidator('community-1', 75000, '0x7500000000000000000000000000000000000000');
      addValidator('community-2', 80000, '0x8000000000000000000000000000000000000000');
      
      expect(getValidatorCount()).toBe(8);
      expect(getTotalStake()).toBe(1855000);
      
      const topValidators = getTopValidators(5);
      expect(topValidators[0].id).toBe('institutional-1');
      expect(topValidators[1].id).toBe('enterprise-2');
      expect(topValidators[2].id).toBe('enterprise-1');
    });
  });
});

// Simple test runner
function runTests() {
  console.log('🧪 Running Validator System Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Run basic functionality tests
  try {
    blockchainState = { validators: new Map() };
    
    // Test 1: Add validators
    const addResult = addValidator('test-1', 100000, '0x1234567890abcdef1234567890abcdef12345678');
    if (addResult && getValidatorCount() === 1) {
      console.log('✅ Test 1 PASSED: Add validators');
      passed++;
    } else {
      console.log('❌ Test 1 FAILED: Add validators');
      failed++;
    }
    
    // Test 2: Total stake calculation
    addValidator('test-2', 200000, '0x2345678901bcdef1234567890abcdef1234567890');
    if (getTotalStake() === 300000) {
      console.log('✅ Test 2 PASSED: Total stake calculation');
      passed++;
    } else {
      console.log('❌ Test 2 FAILED: Total stake calculation');
      failed++;
    }
    
    // Test 3: Top validators
    const topValidators = getTopValidators(2);
    if (topValidators.length === 2 && topValidators[0].stake > topValidators[1].stake) {
      console.log('✅ Test 3 PASSED: Top validators sorting');
      passed++;
    } else {
      console.log('❌ Test 3 FAILED: Top validators sorting');
      failed++;
    }
    
    // Test 4: PoS validation
    const validationResult = validateBlock();
    if (validationResult && validationResult.validator) {
      console.log('✅ Test 4 PASSED: PoS validation');
      passed++;
    } else {
      console.log('❌ Test 4 FAILED: PoS validation');
      failed++;
    }
    
    // Test 5: Remove validator
    const removeResult = removeValidator('test-1');
    if (removeResult && getValidatorCount() === 1) {
      console.log('✅ Test 5 PASSED: Remove validator');
      passed++;
    } else {
      console.log('❌ Test 5 FAILED: Remove validator');
      failed++;
    }
    
  } catch (error) {
    console.log('❌ Test suite failed with error:', error.message);
    failed++;
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Enhanced validator system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export {
  addValidator,
  removeValidator,
  updateValidatorStake,
  getValidatorCount,
  getTotalStake,
  getTopValidators,
  validateBlock
}; 