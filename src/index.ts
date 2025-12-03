import { SolanaIndexer } from './indexers/solanaIndexer';
import { EVMIndexer } from './indexers/evmIndexer';
import { config } from './config';

class IndexerService {
  private solanaIndexer: SolanaIndexer;
  private evmIndexer: EVMIndexer;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.solanaIndexer = new SolanaIndexer();
    this.evmIndexer = new EVMIndexer();
  }

  /**
   * Run indexing once
   */
  async runOnce(): Promise<void> {
    console.log('='.repeat(60));
    console.log('Starting indexing process...');
    console.log('='.repeat(60));

    const promises: Promise<void>[] = [];

    if (config.solana.enabled) {
      promises.push(this.solanaIndexer.indexAll());
    } else {
      console.log('[Solana] Indexing is disabled');
    }

    if (config.evm.enabled) {
      promises.push(this.evmIndexer.indexAll());
    } else {
      console.log('[EVM] Indexing is disabled');
    }

    await Promise.all(promises);

    console.log('='.repeat(60));
    console.log('Indexing process completed');
    console.log('='.repeat(60));
  }

  /**
   * Start continuous indexing with interval
   */
  start(): void {
    console.log(`Starting continuous indexing (interval: ${config.indexing.intervalMs}ms)`);
    
    // Run immediately
    this.runOnce().catch(console.error);

    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.runOnce().catch(console.error);
    }, config.indexing.intervalMs);
  }

  /**
   * Stop continuous indexing
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('Indexing stopped');
    }
  }
}

// Main execution
async function main() {
  const indexerService = new IndexerService();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    indexerService.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    indexerService.stop();
    process.exit(0);
  });

  // Start indexing
  const runOnce = process.argv.includes('--once');
  
  if (runOnce) {
    await indexerService.runOnce();
  } else {
    indexerService.start();
  }
}

// Run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { IndexerService };
