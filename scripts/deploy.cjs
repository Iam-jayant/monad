const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying QuadraticVoting contract to Monad testnet...\n");

    // Configuration
    console.log("Configuration:");
    console.log("- Initial Credits per Voter: 100 (Constant)");

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Account balance: ${ethers.formatEther(balance)} MON`);

    // Deploy contract
    const QuadraticVoting = await ethers.getContractFactory("QuadraticVoting");
    const contract = await QuadraticVoting.deploy(); // No constructor args

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log("✅ QuadraticVoting deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '../.env');

    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const regex = /^VITE_CONTRACT_ADDRESS=.*$/m;
    const newEntry = `VITE_CONTRACT_ADDRESS=${contractAddress}`;

    if (regex.test(envContent)) {
        envContent = envContent.replace(regex, newEntry);
    } else {
        envContent += `\n${newEntry}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated .env with new contract address: ${contractAddress}`);

    console.log("=".repeat(60));
    console.log("NEXT STEPS:");
    console.log("=".repeat(60));
    console.log("1. Verify the contract (if block explorer available):");
    console.log(`   npx hardhat verify --network monad ${contractAddress}`);
    console.log("\n2. Restart frontend to pick up changes:");
    console.log("   npm run dev");
    console.log("=".repeat(60) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
