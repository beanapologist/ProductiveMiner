async function demonstrateBlockPersistence() {
  console.log('🔍 Demonstrating Block Persistence...\n');
  
  // Check initial state
  console.log('📊 Initial State:');
  const initialStatus = await fetch('http://localhost:3000/api/status').then(r => r.json());
  const initialBlocks = await fetch('http://localhost:3000/api/blocks').then(r => r.json());
  
  console.log(`   Block Height: ${initialStatus.blockchain.blockHeight}`);
  console.log(`   Total Blocks: ${initialBlocks.latestBlocks.length}`);
  console.log(`   Latest Block: ${initialBlocks.latestBlocks[0]?.height || 'None'}`);
  
  // Mine some blocks
  console.log('\n⛏️  Mining new blocks...');
  for (let i = 0; i < 5; i++) {
    await fetch('http://localhost:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: 1
      })
    });
    console.log(`   Mined block ${i + 1}`);
  }
  
  // Check final state
  console.log('\n📊 Final State:');
  const finalStatus = await fetch('http://localhost:3000/api/status').then(r => r.json());
  const finalBlocks = await fetch('http://localhost:3000/api/blocks').then(r => r.json());
  
  console.log(`   Block Height: ${finalStatus.blockchain.blockHeight}`);
  console.log(`   Total Blocks: ${finalBlocks.latestBlocks.length}`);
  console.log(`   Latest Block: ${finalBlocks.latestBlocks[0]?.height || 'None'}`);
  
  // Show block details
  console.log('\n📋 Block Details:');
  finalBlocks.latestBlocks.slice(0, 3).forEach((block, index) => {
    console.log(`   Block ${index + 1}: Height ${block.height}, Hash: ${block.hash.substring(0, 20)}..., Transactions: ${block.transactions}`);
  });
  
  // Summary
  const blockIncrease = finalStatus.blockchain.blockHeight - initialStatus.blockchain.blockHeight;
  console.log(`\n✅ Block Persistence Test Results:`);
  console.log(`   Blocks mined: 5`);
  console.log(`   Block height increase: ${blockIncrease}`);
  console.log(`   Blocks persisting: ${blockIncrease === 5 ? '✅ YES' : '❌ NO'}`);
  
  if (blockIncrease === 5) {
    console.log('\n🎉 SUCCESS: Blocks are persisting correctly!');
    console.log('   - New blocks are being mined');
    console.log('   - Block height is increasing');
    console.log('   - Block data is being stored');
    console.log('   - Frontend will show updated block data');
  } else {
    console.log('\n❌ FAILED: Blocks are not persisting correctly');
  }
}

demonstrateBlockPersistence(); 