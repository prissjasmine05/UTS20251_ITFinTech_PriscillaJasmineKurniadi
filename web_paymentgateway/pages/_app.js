import '../styles/globals.css';
import AppWrapper from '../context/AppWrapper'; // Impor pembungkus baru

// Ini adalah komponen "kulit" utama untuk semua halaman
function MyApp({ Component, pageProps }) {
  return (
    // AppWrapper sekarang yang menangani semua logic provider
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;

