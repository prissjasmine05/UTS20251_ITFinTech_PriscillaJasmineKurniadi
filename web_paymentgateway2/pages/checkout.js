// pages/checkout.js
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    // Kita tambahkan styling agar lebih mirip dengan wireframe
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 max-w-2xl">
        <Link href="/select-items">
          <button className="text-blue-500 mb-4">&larr; Kembali Belanja</button>
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 border-b pb-4">Checkout</h1>
          {cart.length === 0 ? (
            <p>Keranjangmu kosong.</p>
          ) : (
            <div>
              {/* List Item */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between font-bold text-xl">
                  <span>Subtotal:</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* --- TOMBOL NAVIGASI YANG DITAMBAHKAN --- */}
              <div className="mt-8 text-right">
                <Link href="/payment">
                  <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors">
                    Continue to Payment &rarr;
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