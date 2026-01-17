# Signal - Quadratic Voting on Monad

A high-throughput Quadratic Voting platform optimized for Monad testnet's parallel execution capabilities.

## What is Quadratic Voting?

Quadratic Voting allows participants to express both preference and intensity of preference. The cost of votes increases quadratically:

- **Formula**: `cost = votes²`
- **Examples**: 1 vote = 1 credit, 2 votes = 4 credits, 3 votes = 9 credits, 10 votes = 100 credits

This encourages spreading votes across multiple projects rather than concentrating on one.

## Why Monad?

Monad's parallel execution model enables multiple voters to vote simultaneously without conflicts. Our contract is optimized for this:

- **Isolated voter state**: Each voter's data is in separate storage slots
- **Minimal shared state**: Only vote aggregation creates conflicts, which Monad handles efficiently
- **High throughput**: 100 voters can vote in parallel if voting for different projects

## Features

- Submit projects with rich metadata (name, description, links, team info)
- Allocate votes across multiple projects with real-time cost calculation
- Live leaderboard sorted by vote power
- Privacy-preserving (no voter identities exposed)

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Wallet**: wagmi + viem + RainbowKit
- **Contracts**: Solidity 0.8.24
- **Blockchain**: Monad Testnet

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:
- `VITE_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com)
- `PRIVATE_KEY`: Your deployer wallet private key

### 3. Deploy Contract

```bash
# Compile
npm run compile

# Deploy to Monad testnet
npm run deploy
```

Copy the deployed contract address and add to `.env`:
```
VITE_CONTRACT_ADDRESS=0x...
```

### 4. Run Frontend

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Usage

1. **Connect Wallet** and add Monad testnet
2. **Initialize Credits** to receive 100 voting credits
3. **Submit Project** with metadata (or provide IPFS/Arweave URI)
4. **Vote** by allocating votes across projects
5. **View Results** on the leaderboard

## Project Metadata Schema

```json
{
  "name": "Project Name",
  "description": "Short description",
  "thumbnail": "https://...",
  "demoLink": "https://...",
  "videoLink": "https://...",
  "repoLink": "https://...",
  "readmeLink": "https://...",
  "team": {
    "teamName": "Team Name",
    "members": ["Alice", "Bob"]
  }
}
```

See `example-metadata.json` for a complete example.

## Project Structure

```
monad/
├── contracts/              # Solidity smart contracts
│   └── QuadraticVoting.sol
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── src/
│   ├── components/         # React components
│   ├── config/             # Wagmi & chain config
│   ├── hooks/              # Contract interaction hooks
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   └── App.tsx
├── hardhat.config.cjs      # Hardhat configuration
└── package.json
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run compile      # Compile contracts
npm run deploy       # Deploy to Monad testnet
```

## Security Notes

This is an MVP for demonstration. For production:

- Add Sybil resistance (Gitcoin Passport, Proof of Humanity)
- Implement admin controls and moderation
- Add metadata validation
- Get a professional security audit

## License

MIT License - see LICENSE file for details

---

**Built for Monad • Optimized for Parallel Execution**
