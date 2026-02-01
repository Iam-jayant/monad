const { JsonRpcProvider } = require('ethers');

async function checkConnection() {
    const url = "https://testnet-rpc.monad.xyz";
    console.log(`Checking connection to ${url}...`);
    try {
        const provider = new JsonRpcProvider(url);
        const network = await provider.getNetwork();
        console.log("Connected to chain ID:", network.chainId.toString());
        const blockNumber = await provider.getBlockNumber();
        console.log("Current block number:", blockNumber);
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

checkConnection();
