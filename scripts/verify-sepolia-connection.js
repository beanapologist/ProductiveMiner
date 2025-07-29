const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying Sepolia Testnet Connection...\n");

  try {
    // Check if we can connect to Sepolia
    console.log("1. 🔗 Testing network connection...");
    
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
    const network = await provider.getNetwork();
    
    console.log(`✅ Connected to network: ${network.name}`);
    console.log(`📍 Chain ID: ${network.chainId}`);
    
    // Check gas price
    console.log("\n2. ⛽ Checking gas prices...");
    const feeData = await provider.getFeeData();
    const gasPriceGwei = ethers.formatUnits(feeData.gasPrice, "gwei");
    
    console.log(`💰 Current gas price: ${gasPriceGwei} gwei`);
    console.log(`⚡ Max fee per gas: ${ethers.formatUnits(feeData.maxFeePerGas || 0, "gwei")} gwei`);
    console.log(`🚀 Max priority fee: ${ethers.formatUnits(feeData.maxPriorityFeePerGas || 0, "gwei")} gwei`);

    // Check latest block
    console.log("\n3. 📊 Getting latest block info...");
    const latestBlock = await provider.getBlock("latest");
    
    console.log(`📦 Block number: ${latestBlock.number}`);
    console.log(`⏰ Block timestamp: ${new Date(latestBlock.timestamp * 1000).toISOString()}`);
    console.log(`⛽ Block gas limit: ${latestBlock.gasLimit.toString()}`);

    // Check account balance (if private key is set)
    if (process.env.SEPOLIA_PRIVATE_KEY) {
      console.log("\n4. 👤 Checking account balance...");
      
      const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
      const balance = await provider.getBalance(wallet.address);
      const balanceEth = ethers.formatEther(balance);
      
      console.log(`👤 Account address: ${wallet.address}`);
      console.log(`💰 Balance: ${balanceEth} ETH`);
      
      if (balance > 0) {
        console.log("✅ Account has sufficient balance for deployment");
      } else {
        console.log("⚠️  Account has no balance - get Sepolia ETH from faucets");
      }
    } else {
      console.log("\n4. ⚠️  No private key configured - skipping balance check");
    }

    // Test contract compilation
    console.log("\n5. 📦 Testing contract compilation...");
    
    const ProductiveMiner = await ethers.getContractFactory("ProductiveMiner");
    const deploymentData = ProductiveMiner.interface.encodeDeploy();
    const estimatedGas = await provider.estimateGas({
      data: deploymentData
    });
    
    const estimatedCost = ethers.formatEther(estimatedGas * feeData.gasPrice);
    
    console.log(`⛽ Estimated deployment gas: ${estimatedGas.toString()}`);
    console.log(`💰 Estimated deployment cost: ${estimatedCost} ETH`);

    // Network status summary
    console.log("\n📈 Network Status Summary:");
    console.log("===========================");
    console.log(`🌐 Network: Sepolia Testnet`);
    console.log(`🔗 Chain ID: ${network.chainId}`);
    console.log(`⛽ Gas Price: ${gasPriceGwei} gwei`);
    console.log(`📦 Latest Block: ${latestBlock.number}`);
    console.log(`💰 Deployment Cost: ~${estimatedCost} ETH`);
    
    if (process.env.SEPOLIA_PRIVATE_KEY) {
      const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
      const balance = await provider.getBalance(wallet.address);
      const balanceEth = ethers.formatEther(balance);
      console.log(`👤 Account: ${wallet.address}`);
      console.log(`💰 Balance: ${balanceEth} ETH`);
    }

    console.log("\n✅ Sepolia connection verified successfully!");
    console.log("🚀 Ready for deployment");

  } catch (error) {
    console.error("❌ Failed to verify Sepolia connection:", error.message);
    
    if (error.message.includes("network")) {
      console.error("\n💡 Troubleshooting tips:");
      console.error("1. Check your SEPOLIA_URL in .env file");
      console.error("2. Verify your Infura/Alchemy API key");
      console.error("3. Ensure you have internet connection");
    }
    
    process.exit(1);
  }
}

main().catch(console.error); 