// utils/solana.js
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

const SOLANA_DEVNET_RPC_ENDPOINT = clusterApiUrl('devnet');

export const getProvider = () => {
  if ('solana' in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open('https://phantom.app/', '_blank');
};

export const getBalance = async (publicKey) => {
  try {
    const connection = new Connection(SOLANA_DEVNET_RPC_ENDPOINT);
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / 1e9; // Convert from lamports to SOL
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};
