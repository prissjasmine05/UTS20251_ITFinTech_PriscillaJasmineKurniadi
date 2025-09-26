import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, addToCart, removeFromCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  return (
    <div className="bg-[#F5F5DD] min-h-screen font-sans text-zinc-800 py-8">
      <div className="container mx-auto p-4 max-w-3xl">
        <Link href="/select-items">
          <button className="text-zinc-600 hover:text-zinc-900 font-semibold mb-4">&larr; Kembali ke Menu</button>
        </Link>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 border-b border-zinc-200 pb-4">Keranjang Belanja</h1>
          
          {cart.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">Keranjangmu masih kosong.</p>
          ) : (
            <div>
              {/* Keranjang */}
              <div className="space-y-5 mb-6">
                {cart.map(item => (
                  <div key={item._id} className="flex gap-4 items-center border-b border-zinc-200 pb-5">
                    {/* Gambar */}
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    {/* Info Item */}
                    <div className="flex-grow">
                      <h2 className="text-lg font-bold">{item.name}</h2>
                      <p className="text-sm text-zinc-500 mb-2">{item.description}</p>
                      <div className="flex items-center gap-3 bg-zinc-100 text-zinc-800 rounded-full px-3 py-1.5 shadow-sm w-fit">
                          <button onClick={() => removeFromCart(item)} className="font-bold text-lg text-zinc-500 hover:text-zinc-800">➖</button>
                          <span className="font-bold text-lg w-5 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="font-bold text-lg text-zinc-500 hover:text-zinc-800">➕</button>
                      </div>
                    </div>
                     {/* Harga Item */}
                    <p className="text-lg font-bold w-28 text-right">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Rangkuman Biaya */}
              <div className="space-y-2 text-lg">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Pajak (11%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t border-zinc-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Tombol Lanjut Pembayaran */}
              <div className="mt-8">
                <Link href="/payment">
                  <button className="w-full bg-zinc-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-zinc-700 transition-colors text-lg">
                    Lanjut ke Pembayaran &rarr;
                  </button>
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
