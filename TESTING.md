# Testing Signal - Quadratic Voting Platform

## Testing Options

### Option 1: Local Hardhat Network (Recommended for Development)

1. **Start Local Hardhat Node**
   ```bash
   npx hardhat node
   ```
   This will start a local blockchain on `http://127.0.0.1:8545`

2. **Deploy to Local Network** (in a new terminal)
   ```bash
   npm run deploy:local
   ```

3. **Copy the Contract Address** from the deployment output and update `.env`:
   ```
   VITE_CONTRACT_ADDRESS=0x...
   ```

4. **Add Local Network to MetaMask**
   - Network Name: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

5. **Import Test Account** to MetaMask
   - Hardhat provides test accounts with private keys
   - Copy one of the private keys from the hardhat node output
   - Import it into MetaMask

6. **Start Frontend**
   ```bash
   npm run dev
   ```

7. **Test the Application**
   - Connect wallet (use the imported test account)
   - Initialize credits
   - Submit a test project
   - Vote for projects
   - View results

---

### Option 2: Monad Testnet (When Available)

> **Note**: Monad testnet may not be publicly available yet. Check [Monad's official documentation](https://docs.monad.xyz) for testnet access.

1. **Get Monad Testnet Tokens**
   - Visit Monad testnet faucet (when available)
   - Get test MON tokens for gas fees

2. **Update `.env`** with Monad RPC URL
   ```
   VITE_MONAD_RPC_URL=<actual_monad_testnet_rpc>
   MONAD_RPC_URL=<actual_monad_testnet_rpc>
   ```

3. **Deploy to Monad**
   ```bash
   npm run deploy
   ```

4. **Update Contract Address** in `.env`

5. **Add Monad Testnet to MetaMask**
   - Network Name: Monad Testnet
   - RPC URL: (from Monad docs)
   - Chain ID: 41454
   - Currency Symbol: MON

6. **Test on Monad Testnet**

---

## Testing Checklist

### Smart Contract Testing

- [ ] Contract compiles without errors
  ```bash
  npm run compile
  ```

- [ ] Contract deploys successfully
  ```bash
  npm run deploy:local
  ```

- [ ] Can initialize voter credits
- [ ] Can submit projects
- [ ] Can vote for projects
- [ ] Quadratic cost calculation works correctly
- [ ] Can view results

### Frontend Testing

- [ ] Wallet connects successfully
- [ ] Network switching works
- [ ] Credit initialization flow works
- [ ] Project submission form works
- [ ] Vote allocation interface works
- [ ] Real-time cost calculation updates
- [ ] Results page displays correctly
- [ ] Responsive design works on mobile

### Parallel Execution Testing (Monad Specific)

When testing on Monad testnet:

1. **Create Multiple Test Wallets**
2. **Initialize Credits** for all wallets
3. **Submit Multiple Projects**
4. **Vote Simultaneously** from different wallets
5. **Verify** that transactions process in parallel without conflicts

---

## Manual Testing Scenarios

### Scenario 1: Basic Voting Flow

1. Connect wallet
2. Initialize 100 credits
3. Submit a project with metadata
4. Vote 5 votes for the project (cost: 25 credits)
5. Verify remaining credits: 75
6. Check results page shows 5 vote power

### Scenario 2: Multiple Projects

1. Submit 3 different projects
2. Allocate votes:
   - Project 1: 3 votes (cost: 9)
   - Project 2: 5 votes (cost: 25)
   - Project 3: 2 votes (cost: 4)
3. Total cost: 38 credits
4. Remaining: 62 credits
5. Verify all projects show correct vote power

### Scenario 3: Vote Modification

1. Vote 5 votes for a project (cost: 25)
2. Change to 7 votes (new cost: 49, additional: 24)
3. Verify credits deducted correctly
4. Change to 3 votes (new cost: 9, refund: 40)
5. Verify credits refunded correctly

### Scenario 4: Credit Limit

1. Try to vote 11 votes (cost: 121 credits)
2. Verify transaction fails (insufficient credits)
3. Vote 10 votes (cost: 100 credits)
4. Verify success with 0 remaining credits

---

## Troubleshooting

### Contract Deployment Fails

**Issue**: RPC connection error
- **Solution**: Ensure Hardhat node is running for local testing
- **Solution**: Check Monad testnet RPC URL is correct

**Issue**: Insufficient funds
- **Solution**: Ensure deployer wallet has test tokens

### Frontend Issues

**Issue**: Contract address not found
- **Solution**: Update `VITE_CONTRACT_ADDRESS` in `.env`
- **Solution**: Restart dev server after updating `.env`

**Issue**: Wallet won't connect
- **Solution**: Ensure correct network is added to MetaMask
- **Solution**: Check RPC URL is accessible

**Issue**: Transactions fail
- **Solution**: Ensure wallet has sufficient gas tokens
- **Solution**: Check contract is deployed correctly

---

## Development Tips

### Quick Reset for Testing

```bash
# Stop hardhat node (Ctrl+C)
# Restart hardhat node
npx hardhat node

# Redeploy contract
npm run deploy:local

# Update .env with new contract address
# Restart frontend
npm run dev
```

### Testing with Multiple Accounts

1. Hardhat provides 20 test accounts
2. Import multiple accounts to MetaMask
3. Switch between accounts to test multi-voter scenarios

### Debugging

- Check browser console for errors
- Check Hardhat node output for transaction logs
- Use MetaMask activity tab to view transaction details

---

## Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Optimize gas costs** if needed
3. **Add more features** (voting periods, project categories, etc.)
4. **Deploy to Monad mainnet** when ready
5. **Get security audit** before production use

---

**Happy Testing! 🚀**
