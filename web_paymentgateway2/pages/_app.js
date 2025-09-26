import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';

// Ini adalah komponen "kulit" utama untuk semua halaman
function MyApp({ Component, pageProps }) {
  return (
    // CartProvider membungkus semua halaman agar keranjang bisa diakses di mana saja
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;