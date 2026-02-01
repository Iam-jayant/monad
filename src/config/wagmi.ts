import { defineChain } from 'viem';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { localhost } from 'viem/chains';

// Define Monad testnet chain
export const monadTestnet = defineChain({
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Monad',
        symbol: 'MON',
    },
    rpcUrls: {
        default: {
            http: [import.meta.env.VITE_MONAD_RPC_URL || 'https://testnet.monad.xyz'],
        },
        public: {
            http: [import.meta.env.VITE_MONAD_RPC_URL || 'https://testnet.monad.xyz'],
        },
    },
    blockExplorers: {
        default: { name: 'Monad Explorer', url: 'https://explorer.testnet.monad.xyz' },
    },
    testnet: true,
});

// Use localhost for local testing, Monad testnet for production
const isLocalhost = import.meta.env.VITE_MONAD_RPC_URL?.includes('127.0.0.1') ||
    import.meta.env.VITE_MONAD_RPC_URL?.includes('localhost');

// Wagmi configuration with RainbowKit
export const config = getDefaultConfig({
    appName: 'Signal - Quadratic Voting',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3fbb6bba6f1de962d911bb5b5c9ddd26',
    chains: isLocalhost ? [localhost] : [monadTestnet],
    ssr: false,
});

// Contract configuration
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string} `;

export const CONTRACT_ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_initialCredits", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AlreadyInitialized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EmptyMetadataURI",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "required", "type": "uint256" },
            { "internalType": "uint256", "name": "available", "type": "uint256" }
        ],
        "name": "InsufficientCredits",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }],
        "name": "InvalidProjectId",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "credits", "type": "uint256" }
        ],
        "name": "CreditsInitialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "submitter", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "metadataURI", "type": "string" }
        ],
        "name": "ProjectSubmitted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "votes", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "votePowerAdded", "type": "uint256" }
        ],
        "name": "VoteCast",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "INITIAL_CREDITS",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "votes", "type": "uint256" }],
        "name": "calculateCost",
        "outputs": [{ "internalType": "uint256", "name": "cost", "type": "uint256" }],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "creditsLeft",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }],
        "name": "getProjectMetadata",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }],
        "name": "getProjectResult",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "voter", "type": "address" }],
        "name": "getVoterInfo",
        "outputs": [
            { "internalType": "uint256", "name": "credits", "type": "uint256" },
            { "internalType": "bool", "name": "initialized", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "voter", "type": "address" },
            { "internalType": "uint256", "name": "projectId", "type": "uint256" }
        ],
        "name": "getVoterProjectVotes",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "hasInitialized",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "initializeCredits",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "projectCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "projectMetadataURI",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "projectSubmitter",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "projectVotePower",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "metadataURI", "type": "string" }],
        "name": "submitProject",
        "outputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "projectId", "type": "uint256" },
            { "internalType": "uint256", "name": "votes", "type": "uint256" }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "name": "votesByVoter",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
