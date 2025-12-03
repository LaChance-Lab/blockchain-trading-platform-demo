# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
MORALIS_API_KEY=your_moralis_api_key_here
SOLANA_NETWORK=mainnet
SOLANA_ADDRESSES=YourSolanaAddress1,YourSolanaAddress2
EVM_CHAIN=eth
EVM_ADDRESSES=0xYourEVMAddress1,0xYourEVMAddress2
INDEX_INTERVAL_MS=60000
ENABLE_SOLANA_INDEXING=true
ENABLE_EVM_INDEXING=true
```

## 3. Build the Project

```bash
npm run build
```

## 4. Run the Indexer

### One-time execution:
```bash
npm start -- --once
```

### Continuous indexing:
```bash
npm start
```

## Example Output

```
============================================================
Starting indexing process...
============================================================
[Solana] Starting indexing for 2 addresses...
[Solana] Indexing transactions for address: YourSolanaAddress1
[Solana] Found 10 transactions for YourSolanaAddress1
[Solana] Indexing token balances for address: YourSolanaAddress1
[Solana] Found 5 token accounts for YourSolanaAddress1
...
[EVM] Starting indexing for 2 addresses...
[EVM] Indexing transactions for address: 0xYourEVMAddress1
[EVM] Found 25 transactions for 0xYourEVMAddress1
...
============================================================
Indexing process completed
============================================================
```

## Troubleshooting

- **"MORALIS_API_KEY is required"**: Make sure your `.env` file exists and contains a valid API key
- **API Errors**: Check your Moralis account limits and API key validity
- **No data**: Verify addresses are correct and have transaction history
