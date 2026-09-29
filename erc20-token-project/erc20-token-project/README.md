# ERC-20 Token: MyToken (MTK)

A blockchain mini project that creates, tests and deploys an ERC-20 token using
**Solidity**, **Hardhat** and **OpenZeppelin**.

## Features
| Feature | How it works |
|---|---|
| Standard ERC-20 | `transfer`, `approve`, `transferFrom`, `balanceOf`, `allowance` |
| Initial supply | Minted to the owner at deployment (100,000 MTK) |
| Minting | Owner-only, capped at 1,000,000 MTK (`MAX_SUPPLY`) |
| Burning | Any holder can burn their own tokens (`burn`, `burnFrom`) |
| Pausing | Owner can freeze all token movement in an emergency |

## Setup
```bash
npm install
npx hardhat compile
npx hardhat test
```

## Run locally
```bash
# terminal 1
npx hardhat node

# terminal 2
npm run deploy:local
```

## Deploy to Sepolia testnet
1. Get free test ETH from a Sepolia faucet.
2. Create a **new, test-only** MetaMask account and export its private key.
3. `cp .env.example .env` and fill in the RPC URL, private key and Etherscan key.
4. `npm run deploy:sepolia`
5. Add the printed contract address to MetaMask via *Import tokens*.

## Project structure
```
contracts/MyToken.sol   the token contract
test/MyToken.test.js    unit tests (deploy, transfer, mint, cap, burn, pause)
scripts/deploy.js       deployment + Etherscan verification
hardhat.config.js       compiler and network config
```

## Concepts to explain in your viva/report
- What ERC-20 is and why a standard interface matters (wallets, exchanges, DApps)
- 18 decimals: balances are integers, so 1 MTK = 10^18 base units
- `approve` / `transferFrom` flow used by DEXs and other contracts
- Why access control (`Ownable`) and a supply cap protect token holders
- Inheritance and the `_update` override in OpenZeppelin v5
- Gas cost, testnet vs mainnet, and contract verification

## Ideas to extend
- Token sale contract (buy MTK with test ETH at a fixed rate)
- Staking contract that pays reward tokens
- Vesting/timelock for team allocation
- React + ethers.js frontend for balance, transfer and burn
- `ERC20Permit` for gasless approvals

## Run the GUI (frontend dashboard)
1. `npx hardhat node` (terminal 1) and `npm run deploy:local` (terminal 2). Copy the token address.
2. In MetaMask add a network: RPC `http://127.0.0.1:8545`, chain ID `31337`, symbol `ETH`.
3. Import the first private key shown by `npx hardhat node` (test-only account, the token owner).
4. `npm run frontend` (terminal 3), then open http://localhost:3000
5. Paste the token address, click **Connect wallet**.
