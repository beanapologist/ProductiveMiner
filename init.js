require("dotenv").config();
const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

async function main() {
  const address = '0x58D7a414886bC069176Bf24DE05B203511082a41';
  await helpers.setBalance(address, ethers.utils.parseEther('100000'));
  console.log(`Set balance for ${address} to 100000 ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});