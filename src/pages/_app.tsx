import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WishlistProvider } from '../context/wishlist';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WishlistProvider>
      <Component {...pageProps} />
    </WishlistProvider>
  );
}

export default MyApp;
