#!/usr/bin/env node

// Test script for Polkadot migration
// Verifies that all migration components are properly set up

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Polkadot Migration Components...\n');

// Colors for output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'blue') {
    console.log(`${colors[color]}[TEST]${colors.reset} ${message}`);
}

function checkFile(filePath, description) {
    try {
        if (fs.existsSync(filePath)) {
            log(`✅ ${description} - Found`, 'green');
            return true;
        } else {
            log(`❌ ${description} - Missing`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ ${description} - Error checking file`, 'red');
        return false;
    }
}

function checkDirectory(dirPath, description) {
    try {
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            log(`✅ ${description} - Found`, 'green');
            return true;
        } else {
            log(`❌ ${description} - Missing`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ ${description} - Error checking directory`, 'red');
        return false;
    }
}

function checkPackageJson(packagePath, requiredDeps) {
    try {
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
            
            let allFound = true;
            requiredDeps.forEach(dep => {
                if (dependencies[dep]) {
                    log(`✅ Dependency ${dep} - Found`, 'green');
                } else {
                    log(`❌ Dependency ${dep} - Missing`, 'red');
                    allFound = false;
                }
            });
            
            return allFound;
        } else {
            log(`❌ Package.json not found at ${packagePath}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Error reading package.json: ${error.message}`, 'red');
        return false;
    }
}

// Test results tracking
let testsPassed = 0;
let testsFailed = 0;

function runTest(testName, testFunction) {
    try {
        const result = testFunction();
        if (result) {
            testsPassed++;
        } else {
            testsFailed++;
        }
    } catch (error) {
        log(`❌ Test '${testName}' failed with error: ${error.message}`, 'red');
        testsFailed++;
    }
}

// Test 1: Check configuration files
log('Testing Configuration Files...');
runTest('Polkadot Genesis Config', () => 
    checkFile('config/polkadot-genesis.json', 'Polkadot Genesis Configuration')
);

runTest('Polkadot Node Config', () => 
    checkFile('config/polkadot-node-config.toml', 'Polkadot Node Configuration')
);

// Test 2: Check contract migration
log('\nTesting Contract Migration...');
runTest('ProductiveMiner Pallet', () => 
    checkFile('contracts/ProductiveMinerPallet.rs', 'ProductiveMiner Substrate Pallet')
);

// Test 3: Check migration scripts
log('\nTesting Migration Scripts...');
runTest('Migration Script', () => 
    checkFile('scripts/migrate-to-polkadot.sh', 'Polkadot Migration Script')
);

runTest('Migration Script Permissions', () => {
    const scriptPath = 'scripts/migrate-to-polkadot.sh';
    if (fs.existsSync(scriptPath)) {
        const stats = fs.statSync(scriptPath);
        const isExecutable = (stats.mode & fs.constants.S_IXUSR) !== 0;
        if (isExecutable) {
            log('✅ Migration script is executable', 'green');
            return true;
        } else {
            log('❌ Migration script is not executable', 'red');
            return false;
        }
    }
    return false;
});

// Test 4: Check frontend integration
log('\nTesting Frontend Integration...');
runTest('Polkadot Integration File', () => 
    checkFile('frontend/src/polkadot-integration.js', 'Polkadot.js Integration')
);

runTest('Frontend Package.json', () => 
    checkFile('frontend/package.json', 'Frontend Package Configuration')
);

// Test 5: Check frontend dependencies
log('\nTesting Frontend Dependencies...');
const requiredPolkadotDeps = [
    '@polkadot/api',
    '@polkadot/keyring',
    '@polkadot/util',
    '@polkadot/util-crypto'
];

runTest('Polkadot.js Dependencies', () => 
    checkPackageJson('frontend/package.json', requiredPolkadotDeps)
);

// Test 6: Check documentation
log('\nTesting Documentation...');
runTest('Migration Guide', () => 
    checkFile('POLKADOT_MIGRATION_GUIDE.md', 'Migration Guide Documentation')
);

// Test 7: Check for old Ethereum files (should still exist during migration)
log('\nChecking Legacy Files (should exist during migration)...');
runTest('Legacy Besu Config', () => 
    checkFile('config/besu-genesis.json', 'Legacy Besu Configuration')
);

runTest('Legacy Solidity Contracts', () => 
    checkFile('contracts/ProductiveMiner.sol', 'Legacy Solidity Contract')
);

// Test 8: Validate configuration content
log('\nValidating Configuration Content...');
runTest('Genesis Config Validation', () => {
    try {
        const genesisPath = 'config/polkadot-genesis.json';
        if (fs.existsSync(genesisPath)) {
            const genesis = JSON.parse(fs.readFileSync(genesisPath, 'utf8'));
            
            const requiredFields = ['name', 'id', 'chainType', 'genesis'];
            const allFieldsPresent = requiredFields.every(field => genesis.hasOwnProperty(field));
            
            if (allFieldsPresent) {
                log('✅ Genesis configuration has required fields', 'green');
                return true;
            } else {
                log('❌ Genesis configuration missing required fields', 'red');
                return false;
            }
        }
        return false;
    } catch (error) {
        log(`❌ Error validating genesis config: ${error.message}`, 'red');
        return false;
    }
});

// Test 9: Check pallet content
log('\nValidating Pallet Content...');
runTest('Pallet Structure Validation', () => {
    try {
        const palletPath = 'contracts/ProductiveMinerPallet.rs';
        if (fs.existsSync(palletPath)) {
            const content = fs.readFileSync(palletPath, 'utf8');
            
            const requiredElements = [
                '#![cfg_attr(not(feature = "std"), no_std)]',
                'decl_module!',
                'decl_storage!',
                'decl_event!',
                'submit_discovery'
            ];
            
            const allElementsPresent = requiredElements.every(element => 
                content.includes(element)
            );
            
            if (allElementsPresent) {
                log('✅ Pallet has required structure elements', 'green');
                return true;
            } else {
                log('❌ Pallet missing required structure elements', 'red');
                return false;
            }
        }
        return false;
    } catch (error) {
        log(`❌ Error validating pallet: ${error.message}`, 'red');
        return false;
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 MIGRATION TEST SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! Migration components are ready.');
    console.log('\nNext steps:');
    console.log('1. Run: ./scripts/migrate-to-polkadot.sh');
    console.log('2. Test the Polkadot node: curl -H "Content-Type: application/json" -d \'{"id":1, "jsonrpc":"2.0", "method": "system_chain", "params":[]}\' http://localhost:9944');
    console.log('3. Start the frontend: cd frontend && npm start');
} else {
    console.log('\n⚠️  Some tests failed. Please fix the issues before proceeding with migration.');
    console.log('\nCommon fixes:');
    console.log('- Run: chmod +x scripts/migrate-to-polkadot.sh');
    console.log('- Install dependencies: cd frontend && npm install');
    console.log('- Check file permissions and paths');
}

console.log('\n' + '='.repeat(50)); 