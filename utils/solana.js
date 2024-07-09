// utils/solana.js
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { programs } from '@metaplex/js';

const SOLANA_DEVNET_RPC_ENDPOINT = clusterApiUrl('devnet');
const { metadata: { Metadata } } = programs;

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

export const getTokenAccounts = async (publicKey) => {
  try {
    const connection = new Connection(SOLANA_DEVNET_RPC_ENDPOINT);
    const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(publicKey), {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    });
    return tokenAccounts.value;
  } catch (error) {
    console.error('Error fetching token accounts:', error);
    return null;
  }
};

export const getTokenMetadata = async (tokenMintAddress) => {
  try {
    const connection = new Connection(SOLANA_DEVNET_RPC_ENDPOINT);
    const metadataPDA = await Metadata.getPDA(new PublicKey(tokenMintAddress));
    const metadata = await Metadata.load(connection, metadataPDA);
    return metadata;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
};
