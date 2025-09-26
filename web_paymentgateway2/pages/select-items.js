import Link from 'next/link';
import { useCart } from '../context/CartContext'; // 1. Import useCart, bukan lagi useState

export default function SelectItemsPage({ products }) {
  // 2. Ambil cart dan addToCart dari context global, bukan state lokal lagi
  const { cart, addToCart } = useCart();

  // Kita bisa cek di console untuk memastikan data dari context berhasil diambil
  console.log('Cart from context:', cart); 

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold">Toko Kopi</h1>
        <Link href="/checkout">
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
            {/* Logika untuk menampilkan jumlah item di keranjang */}
            Keranjang ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </Link>
      </header>
      
      <main className="container mx-auto p-4">
        {products.length === 0 ? (
          <p>Tidak ada produk yang tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600">Kategori: {product.category}</p>
                <p className="text-gray-600 flex-grow mb-4">{product.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <p className="text-lg font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    Add +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Bagian ini tidak berubah sama sekali, tetap diperlukan
export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    const { data } = await res.json();
    return {
      props: {
        products: data,
      },
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      props: {
        products: [],
      },
    };
  }
}