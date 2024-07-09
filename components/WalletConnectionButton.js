"use client";

import { useEffect, useState } from 'react';
import { getProvider, getBalance } from '../utils/solana';

export default function WalletConnectionButton() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      const provider = await getProvider();
      if (provider && provider.publicKey) {
        const address = provider.publicKey.toString();
        setWalletAddress(address);
        const accountBalance = await getBalance(address);
        setBalance(accountBalance);
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
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
