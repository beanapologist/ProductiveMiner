#!/bin/bash

# Simple migration test script
# Tests the basic components without full compilation

set -e

echo "🧪 Testing Migration Components (Simple)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test results
tests_passed=0
tests_failed=0

test_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        print_success "$description - Found"
        ((tests_passed++))
        return 0
    else
        print_error "$description - Missing"
        ((tests_failed++))
        return 1
    fi
}

test_directory() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        print_success "$description - Found"
        ((tests_passed++))
        return 0
    else
        print_error "$description - Missing"
        ((tests_failed++))
        return 1
    fi
}

# Test 1: Configuration files
print_status "Testing Configuration Files..."
test_file "config/polkadot-genesis.json" "Polkadot Genesis Configuration"
test_file "config/polkadot-node-config.toml" "Polkadot Node Configuration"

# Test 2: Contract migration
print_status "Testing Contract Migration..."
test_file "contracts/ProductiveMinerPallet.rs" "ProductiveMiner Substrate Pallet"
test_file "substrate-node/pallets/productive-miner/src/lib.rs" "Pallet Source Code"

# Test 3: Migration scripts
print_status "Testing Migration Scripts..."
test_file "scripts/migrate-to-polkadot.sh" "Polkadot Migration Script"
test_file "scripts/test-polkadot-migration.cjs" "Migration Test Script"

# Test 4: Frontend integration
print_status "Testing Frontend Integration..."
test_file "frontend/src/polkadot-integration.js" "Polkadot.js Integration"
test_file "frontend/package.json" "Frontend Package Configuration"

# Test 5: Project structure
print_status "Testing Project Structure..."
test_directory "substrate-node" "Substrate Node Directory"
test_directory "substrate-node/pallets" "Pallets Directory"
test_directory "substrate-node/pallets/productive-miner" "Productive Miner Pallet"

# Test 6: Documentation
print_status "Testing Documentation..."
test_file "POLKADOT_MIGRATION_GUIDE.md" "Migration Guide"
test_file "MIGRATION_SUMMARY.md" "Migration Summary"

# Test 7: Legacy preservation
print_status "Testing Legacy Preservation..."
test_file "config/besu-genesis.json" "Legacy Besu Configuration"
test_file "contracts/ProductiveMiner.sol" "Legacy Solidity Contract"

# Test 8: Rust environment
print_status "Testing Rust Environment..."
if command -v rustc &> /dev/null; then
    print_success "Rust compiler - Available"
    ((tests_passed++))
else
    print_error "Rust compiler - Not available"
    ((tests_failed++))
fi

if command -v cargo &> /dev/null; then
    print_success "Cargo package manager - Available"
    ((tests_passed++))
else
    print_error "Cargo package manager - Not available"
    ((tests_failed++))
fi

# Summary
echo ""
echo "=================================================="
echo "📊 MIGRATION TEST SUMMARY (Simple)"
echo "=================================================="
echo "✅ Tests Passed: $tests_passed"
echo "❌ Tests Failed: $tests_failed"
echo "📈 Success Rate: $(( (tests_passed * 100) / (tests_passed + tests_failed) ))%"

if [ $tests_failed -eq 0 ]; then
    echo ""
    echo "🎉 All basic migration components are in place!"
    echo ""
    echo "Next steps:"
    echo "1. The migration infrastructure is ready"
    echo "2. You can now proceed with the actual migration"
    echo "3. Test the components individually as needed"
    echo ""
    echo "To test the Polkadot node (when ready):"
    echo "curl -H 'Content-Type: application/json' -d '{\"id\":1, \"jsonrpc\":\"2.0\", \"method\": \"system_chain\", \"params\":[]}' http://localhost:9944"
else
    echo ""
    echo "⚠️  Some components are missing. Please check the errors above."
fi

echo "==================================================" 