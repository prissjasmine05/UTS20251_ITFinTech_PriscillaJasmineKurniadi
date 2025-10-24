import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import ProfileIcon from '../components/ProfileIcon';
import LoginChooser from '../components/LoginChooser';

const categories = ['All', 'Drinks', 'Snacks', 'Bundles'];

export default function SelectItemsPage({ products }) {
  const { cart, addToCart, removeFromCart, getItemQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginChooser, setShowLoginChooser] = useState(false);

  const filteredProducts = products
    .filter(product => {
      if (selectedCategory === 'All') return true;
      return product.category === selectedCategory;
    })
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Check if user is logged in
  const checkAuth = () => {
    if (typeof window === 'undefined') return false;
    const user = localStorage.getItem('user');
    const admin = localStorage.getItem('admin');
    return !!(user || admin);
  };

  // Handle Add to Cart with auth check
  const handleAddToCart = (product) => {
    if (!checkAuth()) {
      setShowLoginChooser(true);
      return;
    }
    addToCart(product);
  };

  return (
    <div className="bg-[#F5F5DD] min-h-screen font-sans text-zinc-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <ProfileIcon />
          <h1 className="text-2xl font-bold text-zinc-800">PrisJ Cafe ☕</h1>
        </div>
        
        {/* Grup untuk Search Bar dan Keranjang */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-800 text-white placeholder-zinc-400 rounded-full px-4 py-2 w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-300"
          />
          <Link href="/checkout">
            <button className="relative bg-zinc-800 text-white font-bold py-2 px-5 rounded-full hover:bg-zinc-700 transition-colors">
              <span>🛒</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        {/* Filter Kategori */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm md:text-base ${
                selectedCategory === category
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => {
            const quantityInCart = getItemQuantity(product._id);
            return (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-1/3 flex-shrink-0">
                   <img 
                     src={product.imageUrl || `https://placehold.co/400x400/F5F5DD/4E443A?text=No+Image`} 
                     alt={product.name} 
                     className="w-full h-full object-cover"
                   />
                </div>
                
                <div className="w-2/3 p-5 flex flex-col">
                  <div>
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-lg font-black text-zinc-800 mb-2">
                        Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  
                  <p className="text-zinc-600 text-sm mb-4 flex-grow">{product.description}</p>
                  
                  <div className="mt-auto flex justify-end">
                    {quantityInCart === 0 ? (
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-zinc-200 text-zinc-800 font-bold py-2 px-5 rounded-full hover:bg-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 bg-zinc-800 text-white rounded-full px-3 py-1.5 shadow-md">
                        <button 
                          onClick={() => removeFromCart(product)} 
                          className="font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white rounded"
                        >
                          ➖
                        </button>
                        <span className="font-bold text-lg w-5 text-center">{quantityInCart}</span>
                        <button 
                          onClick={() => addToCart(product)} 
                          className="font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white rounded"
                        >
                          ➕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Login Chooser Modal */}
      <LoginChooser 
        show={showLoginChooser} 
        onClose={() => setShowLoginChooser(false)} 
      />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    const { data } = await res.json();
    return { props: { products: data } };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { props: { products: [] } };
  }
}