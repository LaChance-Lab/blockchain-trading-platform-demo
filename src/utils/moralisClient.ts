import Moralis from 'moralis';
import { config } from '../config';

let isInitialized = false;

/**
 * Initialize Moralis SDK
 */
export async function initializeMoralis(): Promise<void> {
  if (!isInitialized) {
    await Moralis.start({
      apiKey: config.moralis.apiKey,
    });
    isInitialized = true;
    console.log('Moralis SDK initialized');
  }
}

/**
 * Get Moralis Solana API
 */
export function getSolApi() {
  if (!isInitialized) {
    throw new Error('Moralis not initialized. Call initializeMoralis() first.');
  }
  return Moralis.SolApi;
}

/**
 * Get Moralis EVM API
 */
export function getEvmApi() {
  if (!isInitialized) {
    throw new Error('Moralis not initialized. Call initializeMoralis() first.');
  }
  return Moralis.EvmApi;
}

// Helper function to handle API errors
export function handleApiError(error: any, context: string): void {
  if (error?.response?.data) {
    console.error(`[${context}] API Error:`, error.response.data);
  } else if (error?.message) {
    console.error(`[${context}] Error:`, error.message);
  } else {
    console.error(`[${context}] Unknown error:`, error);
  }
}
