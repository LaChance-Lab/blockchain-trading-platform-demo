import { getSolApi, handleApiError, initializeMoralis } from '../utils/moralisClient';
import { SolNetwork } from '@moralisweb3/common-sol-utils';
import { config } from '../config';

export interface SolanaTransaction {
  signature: string;
  blockTime: number;
  slot: number;
  from: string;
  to: string;
  amount: number;
  fee: number;
  status: string;
}

export interface SolanaTokenBalance {
  address: string;
  token: {
    name: string;
    symbol: string;
    decimals: number;
    mint: string;
  };
  balance: string;
  balanceUsd?: number;
}

export class SolanaIndexer {
  private addresses: string[];
  private network: string;

  constructor() {
    this.addresses = config.solana.addresses;
    this.network = config.solana.network;
  }

  /**
   * Get Solana network enum
   */
  private getNetwork(): SolNetwork {
    const networkMap: { [key: string]: SolNetwork } = {
      mainnet: SolNetwork.MAINNET,
      devnet: SolNetwork.DEVNET,
      testnet: SolNetwork.TESTNET,
    };
    return networkMap[this.network.toLowerCase()] || SolNetwork.MAINNET;
  }

  /**
   * Index transactions for a Solana address
   */
  async indexTransactions(address: string): Promise<SolanaTransaction[]> {
    try {
      await initializeMoralis();
      const solApi = getSolApi();
      
      console.log(`[Solana] Indexing transactions for address: ${address}`);
      
      const response = await solApi.account.getTransactions({
        address,
        network: this.getNetwork(),
        limit: 100,
      });

      const transactions: SolanaTransaction[] = [];
      const data = response.toJSON();
      
      if (data && Array.isArray(data)) {
        for (const tx of data) {
          transactions.push({
            signature: tx.signature || '',
            blockTime: tx.blockTime || 0,
            slot: tx.slot || 0,
            from: tx.source || '',
            to: tx.destination || '',
            amount: parseFloat(tx.amount || '0'),
            fee: parseFloat(tx.fee || '0'),
            status: tx.status || 'unknown',
          });
        }
      }

      console.log(`[Solana] Found ${transactions.length} transactions for ${address}`);
      return transactions;
    } catch (error) {
      handleApiError(error, 'SolanaIndexer.indexTransactions');
      return [];
    }
  }

  /**
   * Index token balances for a Solana address
   */
  async indexTokenBalances(address: string): Promise<SolanaTokenBalance[]> {
    try {
      await initializeMoralis();
      const solApi = getSolApi();
      
      console.log(`[Solana] Indexing token balances for address: ${address}`);
      
      const response = await solApi.account.getTokenAccounts({
        address,
        network: this.getNetwork(),
      });

      const balances: SolanaTokenBalance[] = [];
      const data = response.toJSON();
      
      if (data && Array.isArray(data)) {
        for (const account of data) {
          balances.push({
            address: account.address || '',
            token: {
              name: account.name || 'Unknown',
              symbol: account.symbol || 'UNKNOWN',
              decimals: account.decimals || 0,
              mint: account.mint || '',
            },
            balance: account.balance || '0',
            balanceUsd: account.balanceUsd ? parseFloat(account.balanceUsd) : undefined,
          });
        }
      }

      console.log(`[Solana] Found ${balances.length} token accounts for ${address}`);
      return balances;
    } catch (error) {
      handleApiError(error, 'SolanaIndexer.indexTokenBalances');
      return [];
    }
  }

  /**
   * Index NFT balances for a Solana address
   */
  async indexNFTs(address: string): Promise<any[]> {
    try {
      await initializeMoralis();
      const solApi = getSolApi();
      
      console.log(`[Solana] Indexing NFTs for address: ${address}`);
      
      const response = await solApi.account.getNFTs({
        address,
        network: this.getNetwork(),
      });

      const nfts: any[] = [];
      const data = response.toJSON();
      
      if (data && Array.isArray(data)) {
        for (const nft of data) {
          nfts.push({
            address: nft.address || '',
            name: nft.name || '',
            symbol: nft.symbol || '',
            tokenId: nft.tokenId || '',
            tokenUri: nft.tokenUri || '',
            metadata: nft.metadata || {},
          });
        }
      }

      console.log(`[Solana] Found ${nfts.length} NFTs for ${address}`);
      return nfts;
    } catch (error) {
      handleApiError(error, 'SolanaIndexer.indexNFTs');
      return [];
    }
  }

  /**
   * Get native SOL balance for an address
   */
  async getNativeBalance(address: string): Promise<number> {
    try {
      await initializeMoralis();
      const solApi = getSolApi();
      
      const response = await solApi.account.getBalance({
        address,
        network: this.getNetwork(),
      });

      const data = response.toJSON();
      return parseFloat(data.lamports || '0') / 1e9; // Convert lamports to SOL
    } catch (error) {
      handleApiError(error, 'SolanaIndexer.getNativeBalance');
      return 0;
    }
  }

  /**
   * Index all data for all configured addresses
   */
  async indexAll(): Promise<void> {
    if (this.addresses.length === 0) {
      console.log('[Solana] No addresses configured for indexing');
      return;
    }

    console.log(`[Solana] Starting indexing for ${this.addresses.length} addresses...`);

    for (const address of this.addresses) {
      try {
        // Index transactions
        const transactions = await this.indexTransactions(address);
        
        // Index token balances
        const tokenBalances = await this.indexTokenBalances(address);
        
        // Index NFTs
        const nfts = await this.indexNFTs(address);
        
        // Get native balance
        const nativeBalance = await this.getNativeBalance(address);

        console.log(`[Solana] Completed indexing for ${address}:`);
        console.log(`  - Transactions: ${transactions.length}`);
        console.log(`  - Token Accounts: ${tokenBalances.length}`);
        console.log(`  - NFTs: ${nfts.length}`);
        console.log(`  - Native SOL: ${nativeBalance} SOL`);

        // Here you can save the data to a database or process it further
        // await this.saveToDatabase(address, { transactions, tokenBalances, nfts, nativeBalance });

      } catch (error) {
        console.error(`[Solana] Error indexing address ${address}:`, error);
      }
    }
  }
}
