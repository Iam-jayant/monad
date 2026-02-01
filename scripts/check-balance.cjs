const { JsonRpcProvider, Wallet, formatEther } = require('ethers');
require('dotenv').config();

async function checkBalance() {
    const url = "https://testnet-rpc.monad.xyz";
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        console.error("No PRIVATE_KEY found in .env");
        return;
    }

    try {
        const provider = new JsonRpcProvider(url);
        const wallet = new Wallet(privateKey, provider);
        console.log(`Checking balance for: ${wallet.address}`);

        const balance = await provider.getBalance(wallet.address);
        console.log(`Balance: ${formatEther(balance)} MON`);

        const network = await provider.getNetwork();
        console.log(`Connected to chain: ${network.chainId}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

checkBalance();
