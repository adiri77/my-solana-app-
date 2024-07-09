"use client";

import { useEffect, useState } from 'react';
import { getProvider, getBalance, getTokenAccounts, getTokenMetadata, decodeTokenAccount } from '../utils/solana';

export default function WalletConnectionButton() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const connectWallet = async () => {
      const provider = await getProvider();
      if (provider && provider.publicKey) {
        const address = provider.publicKey.toString();
        setWalletAddress(address);
        const accountBalance = await getBalance(address);
        setBalance(accountBalance);
        const tokens = await getTokenAccounts(address);
        setTokenAccounts(tokens);

        const nftPromises = tokens.map(async (token) => {
          const decodedToken = decodeTokenAccount(token.account.data);
          const metadata = await getTokenMetadata(decodedToken.mint);
          if (metadata && metadata.data.data.symbol === 'NFT') {
            return metadata;
          }
          return null;
        });

        const nftResults = await Promise.all(nftPromises);
        const nftList = nftResults.filter(nft => nft !== null);
        const nftData = await Promise.all(nftList.map(async (nft) => {
          const response = await fetch(nft.data.data.uri);
          const data = await response.json();
          return {
            ...nft,
            imageUrl: data.image
          };
        }));
        setNfts(nftData);
      }
    };

    connectWallet();
  }, []);

  const connectWallet = async () => {
    const provider = await getProvider();
    if (provider) {
      try {
        const response = await provider.connect();
        if (response.publicKey) {
          const address = response.publicKey.toString();
          setWalletAddress(address);
          const accountBalance = await getBalance(address);
          setBalance(accountBalance);
          const tokens = await getTokenAccounts(address);
          setTokenAccounts(tokens);
          console.log(tokens, "'''''''''''''''''''''''''''''''''''token");

          const nftPromises = tokens.map(async (token) => {
            console.log(token.account.data, "''''''''''''''''''''////////////////");
            const decodedToken = decodeTokenAccount(token.account.data);
            const metadata = await getTokenMetadata(decodedToken.mint);
            console.log(metadata, "..............................meta-data");
            if (metadata && metadata.data.data.symbol !== null) {
              return metadata;
            }
            return null;
          });

          const nftResults = await Promise.all(nftPromises);
          console.log(nftResults, "'''''''''''''''''''''''''''''''''''nft-1");
          const nftList = nftResults.filter(nft => nft !== null);
          console.log(nftList, "'''''''''''''''''''''''''''''''''''nft-LIST");
          const nftData = await Promise.all(nftList.map(async (nft) => {
            const response = await fetch(nft.data.data.uri);
            const data = await response.json();
            return {
              ...nft,
              imageUrl: data.image
            };
          }));
          setNfts(nftData);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Please install Phantom wallet.');
    }
  };

  return (
    <div>
      {walletAddress ? (
        <div>
          <p>Connected: {walletAddress}</p>
          <p>Balance: {balance !== null ? `${balance} SOL` : 'Loading...'}</p>
          <h3>Token Accounts:</h3>
          {tokenAccounts.length > 0 ? (
            <ul>
              {tokenAccounts.map((account, index) => (
                <li key={index}>
                  Account: {account.pubkey.toString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No token accounts found.</p>
          )}
          <h3>NFTs:</h3>
          {nfts.length > 0 ? (
            <ul>
              {nfts.map((nft, index) => (
                <li key={index}>
                  <p>Name: {nft.data.data.name}</p>
                  <p>Symbol: {nft.data.data.symbol}</p>
                  <img src={nft.imageUrl} alt={nft.data.data.name} width="100" />
                </li>
              ))}
            </ul>
          ) : (
            <p>No NFTs found.</p>
          )}
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
