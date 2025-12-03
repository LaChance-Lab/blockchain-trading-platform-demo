import * as dotenv from 'dotenv';

dotenv.config();

export interface Config {
  moralis: {
    apiKey: string;
  };
  solana: {
    network: string;
    addresses: string[];
    enabled: boolean;
  };
  evm: {
    chain: string;
    addresses: string[];
    enabled: boolean;
  };
  indexing: {
    intervalMs: number;
  };
}

export const config: Config = {
  moralis: {
    apiKey: process.env.MORALIS_API_KEY || '',
  },
  solana: {
    network: process.env.SOLANA_NETWORK || 'mainnet',
    addresses: process.env.SOLANA_ADDRESSES?.split(',').filter(Boolean) || [],
    enabled: process.env.ENABLE_SOLANA_INDEXING !== 'false',
  },
  evm: {
    chain: process.env.EVM_CHAIN || 'eth',
    addresses: process.env.EVM_ADDRESSES?.split(',').filter(Boolean) || [],
    enabled: process.env.ENABLE_EVM_INDEXING !== 'false',
  },
  indexing: {
    intervalMs: parseInt(process.env.INDEX_INTERVAL_MS || '60000', 10),
  },
};

// Validate configuration
if (!config.moralis.apiKey) {
  throw new Error('MORALIS_API_KEY is required. Please set it in your .env file.');
}
