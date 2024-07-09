// app/page.tsx
import WalletConnectionButton from '../components/WalletConnectionButton';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Solana App</h1>
      <WalletConnectionButton />
    </div>
  );
}
