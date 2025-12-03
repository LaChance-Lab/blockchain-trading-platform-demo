# Solana Trading Platform Infrastructure

A comprehensive indexing solution for Solana and EVM blockchain data using the Moralis API. This project provides real-time indexing of transactions, token balances, NFTs, and native balances for multiple addresses across both Solana and EVM chains.

## Features

- 🔄 **Dual Chain Support**: Index data from both Solana and EVM chains simultaneously
- 📊 **Comprehensive Data**: Index transactions, token balances, NFTs, and native balances
- ⚙️ **Configurable**: Easy configuration via environment variables
- 🔁 **Continuous Indexing**: Run continuously with configurable intervals or one-time execution
- 🛡️ **Error Handling**: Robust error handling and logging
- 📝 **TypeScript**: Fully typed for better development experience

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Moralis API key ([Get one here](https://moralis.io/))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-trading-platform-infrastructure
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

4. Configure your `.env` file:
```env
MORALIS_API_KEY=your_moralis_api_key_here
SOLANA_NETWORK=mainnet
SOLANA_ADDRESSES=address1,address2,address3
EVM_CHAIN=eth
EVM_ADDRESSES=0xaddress1,0xaddress2,0xaddress3
INDEX_INTERVAL_MS=60000
ENABLE_SOLANA_INDEXING=true
ENABLE_EVM_INDEXING=true
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MORALIS_API_KEY` | Your Moralis API key | - | Yes |
| `SOLANA_NETWORK` | Solana network (mainnet, devnet, testnet) | mainnet | No |
| `SOLANA_ADDRESSES` | Comma-separated list of Solana addresses | - | No |
| `EVM_CHAIN` | EVM chain (eth, bsc, polygon, avax, etc.) | eth | No |
| `EVM_ADDRESSES` | Comma-separated list of EVM addresses | - | No |
| `INDEX_INTERVAL_MS` | Indexing interval in milliseconds | 60000 | No |
| `ENABLE_SOLANA_INDEXING` | Enable/disable Solana indexing | true | No |
| `ENABLE_EVM_INDEXING` | Enable/disable EVM indexing | true | No |

### Supported EVM Chains

- `eth` - Ethereum Mainnet
- `bsc` - Binance Smart Chain
- `polygon` - Polygon
- `avax` - Avalanche
- `fantom` - Fantom
- `cronos` - Cronos
- And more (check Moralis documentation)

## Usage

### Development Mode

Run with TypeScript directly (requires `ts-node`):
```bash
npm run dev
```

### Production Mode

1. Build the project:
```bash
npm run build
```

2. Run the compiled code:
```bash
npm start
```

### One-Time Execution

Run indexing once and exit:
```bash
npm run dev -- --once
# or
npm start -- --once
```

### Continuous Indexing

By default, the indexer runs continuously at the configured interval. To stop it, press `Ctrl+C`.

## Project Structure

```
solana-trading-platform-infrastructure/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuration management
│   ├── indexers/
│   │   ├── solanaIndexer.ts      # Solana data indexer
│   │   └── evmIndexer.ts         # EVM data indexer
│   ├── utils/
│   │   └── moralisClient.ts      # Moralis API client setup
│   └── index.ts                  # Main entry point
├── dist/                         # Compiled JavaScript (generated)
├── .env                          # Environment variables (create from env.example)
├── env.example                   # Environment variables template
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Indexed Data

### Solana Data
- **Transactions**: Transaction history with signatures, block times, amounts, and fees
- **Token Balances**: SPL token balances with USD values
- **NFTs**: NFT holdings with metadata
- **Native Balance**: SOL balance

### EVM Data
- **Transactions**: Transaction history with hashes, block numbers, gas info
- **Token Balances**: ERC-20 token balances with USD values
- **NFTs**: ERC-721/ERC-1155 NFT holdings with metadata
- **Native Balance**: Native token balance (ETH, BNB, MATIC, etc.)
- **Token Prices**: Token price information

## Extending the Code

### Adding Database Storage

To persist indexed data, you can extend the indexers. Example:

```typescript
// In solanaIndexer.ts or evmIndexer.ts
async saveToDatabase(address: string, data: any) {
  // Implement your database save logic here
  // Example: await db.transactions.insertMany(data.transactions);
}
```

### Custom Processing

Add custom processing logic in the `indexAll()` methods of each indexer to:
- Filter transactions
- Calculate statistics
- Send notifications
- Update dashboards
- etc.

## Error Handling

The indexer includes comprehensive error handling:
- API errors are caught and logged
- Individual address failures don't stop the entire process
- Graceful shutdown on SIGINT/SIGTERM

## Rate Limits

Be aware of Moralis API rate limits. Adjust `INDEX_INTERVAL_MS` accordingly to avoid hitting rate limits.

## Troubleshooting

### Common Issues

1. **"MORALIS_API_KEY is required"**
   - Make sure you've created a `.env` file with your API key

2. **API Errors**
   - Verify your API key is valid
   - Check your Moralis account limits
   - Ensure addresses are in the correct format

3. **No data returned**
   - Verify addresses are correct
   - Check network/chain configuration
   - Some addresses may have no transactions or balances

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
