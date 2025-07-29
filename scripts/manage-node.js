#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function checkPort(port) {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    return stdout.trim();
  } catch (error) {
    return null;
  }
}

async function killProcess(pid) {
  try {
    await execAsync(`kill ${pid}`);
    console.log(`✅ Killed process ${pid} on port 8545`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to kill process ${pid}:`, error.message);
    return false;
  }
}

async function startNode(port = 8545) {
  try {
    console.log(`🚀 Starting Hardhat node on port ${port}...`);
    const child = exec(`npx hardhat node --port ${port}`, {
      stdio: 'inherit'
    });
    
    child.on('error', (error) => {
      console.error('❌ Failed to start Hardhat node:', error.message);
    });
    
    child.on('exit', (code) => {
      console.log(`Hardhat node stopped with code ${code}`);
    });
    
    return child;
  } catch (error) {
    console.error('❌ Failed to start Hardhat node:', error.message);
    return null;
  }
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      const port = process.argv[3] || 8545;
      const existingPid = await checkPort(port);
      
      if (existingPid) {
        console.log(`⚠️  Port ${port} is already in use by process ${existingPid}`);
        const response = await new Promise(resolve => {
          process.stdout.write('Do you want to kill the existing process? (y/N): ');
          process.stdin.once('data', data => {
            resolve(data.toString().trim().toLowerCase());
          });
        });
        
        if (response === 'y' || response === 'yes') {
          await killProcess(existingPid);
          await startNode(port);
        } else {
          console.log('❌ Aborted. Use a different port or kill the process manually.');
        }
      } else {
        await startNode(port);
      }
      break;
      
    case 'stop':
      const pid = await checkPort(8545);
      if (pid) {
        await killProcess(pid);
      } else {
        console.log('✅ No Hardhat node running on port 8545');
      }
      break;
      
    case 'status':
      const runningPid = await checkPort(8545);
      if (runningPid) {
        console.log(`✅ Hardhat node is running on port 8545 (PID: ${runningPid})`);
      } else {
        console.log('❌ No Hardhat node running on port 8545');
      }
      break;
      
    default:
      console.log(`
🔧 Hardhat Node Manager

Usage:
  node scripts/manage-node.js <command> [port]

Commands:
  start [port]  - Start Hardhat node (default port: 8545)
  stop          - Stop Hardhat node on port 8545
  status        - Check if Hardhat node is running

Examples:
  node scripts/manage-node.js start
  node scripts/manage-node.js start 8546
  node scripts/manage-node.js stop
  node scripts/manage-node.js status
      `);
  }
}

main().catch(console.error); 