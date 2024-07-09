import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { programs } from '@metaplex/js';
import { struct, u8, blob } from 'buffer-layout';

const { metadata: { Metadata } } = programs;

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

export const getTokenAccounts = async (publicKey) => {
  const connection = new Connection(SOLANA_DEVNET_RPC_ENDPOINT);
  const accounts = await connection.getTokenAccountsByOwner(
    new PublicKey(publicKey),
    { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
  );
  return accounts.value;
};

const ACCOUNT_LAYOUT = struct([
  blob(32, 'mint'),
  blob(32, 'owner'),
  u64('amount'),
  blob(93, 'padding')
]);

function u64(property = 'u64') {
  return blob(8, property);
}

export const decodeTokenAccount = (data) => {
  const decodedData = ACCOUNT_LAYOUT.decode(data);
  decodedData.mint = new PublicKey(decodedData.mint).toString();
  decodedData.owner = new PublicKey(decodedData.owner).toString();
  return decodedData;
};

export const getTokenMetadata = async (mintAddress) => {
  const connection = new Connection(SOLANA_DEVNET_RPC_ENDPOINT);
  const mintPublicKey = new PublicKey(mintAddress);
  const metadataPDA = await Metadata.getPDA(mintPublicKey);
  const metadataAccount = await Metadata.load(connection, metadataPDA);
  return metadataAccount;
};
