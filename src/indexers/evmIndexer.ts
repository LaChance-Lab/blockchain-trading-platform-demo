import { getEvmApi, handleApiError, initializeMoralis } from '../utils/moralisClient';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { config } from '../config';

export interface EVMTransaction {
  hash: string;
  blockNumber: string;
  blockTimestamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  status: string;
  contractAddress?: string;
}

export interface EVMTokenBalance {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceUsd?: number;
}

export interface EVMNFT {
  tokenAddress: string;
  tokenId: string;
  name: string;
  symbol: string;
  tokenUri?: string;
  metadata?: any;
}

export class EVMIndexer {
  private addresses: string[];
  private chain: string;

  constructor() {
    this.addresses = config.evm.addresses;
    this.chain = config.evm.chain;
  }

  /**
   * Get EVM chain enum
   */
  private getChain(): EvmChain {
    const chainMap: { [key: string]: EvmChain } = {
      eth: EvmChain.ETHEREUM,
      ethereum: EvmChain.ETHEREUM,
      bsc: EvmChain.BSC,
      polygon: EvmChain.POLYGON,
      avax: EvmChain.AVALANCHE,
      avalanche: EvmChain.AVALANCHE,
      fantom: EvmChain.FANTOM,
      cronos: EvmChain.CRONOS,
    };
    return chainMap[this.chain.toLowerCase()] || EvmChain.ETHEREUM;
  }

  /**
   * Index transactions for an EVM address
   */
  async indexTransactions(address: string): Promise<EVMTransaction[]> {
    try {
      await initializeMoralis();
      const evmApi = getEvmApi();
      
      console.log(`[EVM] Indexing transactions for address: ${address}`);
      
      const response = await evmApi.transaction.getWalletTransactions({
        address,
        chain: this.getChain(),
        limit: 100,
      });

      const transactions: EVMTransaction[] = [];
      const data = response.toJSON();
      
      if (data && Array.isArray(data)) {
        for (const tx of data) {
          transactions.push({
            hash: tx.hash || '',
            blockNumber: tx.blockNumber || '',
            blockTimestamp: tx.blockTimestamp || '',
            from: tx.fromAddress || '',
            to: tx.toAddress || '',
            value: tx.value || '0',
            gas: tx.gas || '0',
            gasPrice: tx.gasPrice || '0',
            status: tx.receiptStatus || 'unknown',
            contractAddress: tx.contractAddress || undefined,
          });
        }
      }

      console.log(`[EVM] Found ${transactions.length} transactions for ${address}`);
      return transactions;
    } catch (error) {
      handleApiError(error, 'EVMIndexer.indexTransactions');
      return [];
    }
  }

  /**
   * Index token balances for an EVM address
   */
  async indexTokenBalances(address: string): Promise<EVMTokenBalance[]> {
    try {
      await initializeMoralis();
      const evmApi = getEvmApi();
      
      console.log(`[EVM] Indexing token balances for address: ${address}`);
      
      const response = await evmApi.token.getWalletTokenBalances({
        address,
        chain: this.getChain(),
      });

      const balances: EVMTokenBalance[] = [];
      const data = response.toJSON();
      
      if (data && Array.isArray(data)) {
        for (const token of data) {
          balances.push({
            tokenAddress: token.tokenAddress || '',
            name: token.name || 'Unknown',
            symbol: token.symbol || 'UNKNOWN',
            decimals: token.decimals || 18,
            balance: token.balance || '0',
            balanceUsd: token.balanceUsd ? parseFloat(token.balanceUsd) : undefined,
          });
        }
      }

      console.log(`[EVM] Found ${balances.length} token balances for ${address}`);
      return balances;
    } catch (error) {
      handleApiError(error, 'EVMIndexer.indexTokenBalances');
      return [];
    }
  }

  /**
   * Index NFTs for an EVM address
   */
  async indexNFTs(address: string): Promise<EVMNFT[]> {
    try {
      await initializeMoralis();
      const evmApi = getEvmApi();
      
      console.log(`[EVM] Indexing NFTs for address: ${address}`);
      
      const response = await evmApi.nft.getWalletNFTs({
        address,
        chain: this.getChain(),
      });

      const nfts: EVMNFT[] = [];
      const data = response.toJSON();
      
      if (data && Array.isArray(data)) {
        for (const nft of data) {
          nfts.push({
            tokenAddress: nft.tokenAddress || '',
            tokenId: nft.tokenId || '',
            name: nft.name || '',
            symbol: nft.symbol || '',
            tokenUri: nft.tokenUri || undefined,
            metadata: nft.metadata || undefined,
          });
        }
      }

      console.log(`[EVM] Found ${nfts.length} NFTs for ${address}`);
      return nfts;
    } catch (error) {
      handleApiError(error, 'EVMIndexer.indexNFTs');
      return [];
    }
  }

  /**
   * Get native token balance for an EVM address
   */
  async getNativeBalance(address: string): Promise<string> {
    try {
      await initializeMoralis();
      const evmApi = getEvmApi();
      
      const response = await evmApi.balance.getNativeBalance({
        address,
        chain: this.getChain(),
      });

      const data = response.toJSON();
      return data.balance?.ether || '0';
    } catch (error) {
      handleApiError(error, 'EVMIndexer.getNativeBalance');
      return '0';
    }
  }

  /**
   * Get token price for a token address
   */
  async getTokenPrice(tokenAddress: string): Promise<any> {
    try {
      await initializeMoralis();
      const evmApi = getEvmApi();
      
      const response = await evmApi.token.getTokenPrice({
        address: tokenAddress,
        chain: this.getChain(),
      });

      const data = response.toJSON();
      return {
        tokenAddress,
        price: data.usdPrice || '0',
        priceFormatted: data.usdPriceFormatted || '0',
      };
    } catch (error) {
      handleApiError(error, 'EVMIndexer.getTokenPrice');
      return null;
    }
  }

  /**
   * Index all data for all configured addresses
   */
  async indexAll(): Promise<void> {
    if (this.addresses.length === 0) {
      console.log('[EVM] No addresses configured for indexing');
      return;
    }

    console.log(`[EVM] Starting indexing for ${this.addresses.length} addresses...`);

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

        console.log(`[EVM] Completed indexing for ${address}:`);
        console.log(`  - Transactions: ${transactions.length}`);
        console.log(`  - Token Balances: ${tokenBalances.length}`);
        console.log(`  - NFTs: ${nfts.length}`);
        console.log(`  - Native Balance: ${nativeBalance} ${this.getChainSymbol()}`);

        // Here you can save the data to a database or process it further
        // await this.saveToDatabase(address, { transactions, tokenBalances, nfts, nativeBalance });

      } catch (error) {
        console.error(`[EVM] Error indexing address ${address}:`, error);
      }
    }
  }

  /**
   * Get chain symbol (ETH, BNB, MATIC, etc.)
   */
  private getChainSymbol(): string {
    const chainMap: { [key: string]: string } = {
      eth: 'ETH',
      bsc: 'BNB',
      polygon: 'MATIC',
      avax: 'AVAX',
      fantom: 'FTM',
      cronos: 'CRO',
    };
    return chainMap[this.chain.toLowerCase()] || this.chain.toUpperCase();
  }
}
