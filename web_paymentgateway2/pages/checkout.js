// pages/checkout.js
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart } = useCart(); // Ambil data keranjang dari context

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <Link href="/select-items">
        <button className="text-blue-500 mb-4">&larr; Kembali Belanja</button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {cart.length === 0 ? (
        <p>Keranjangmu kosong.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item._id} className="flex justify-between items-center border-b py-2">
              <p>{item.name} (x{item.quantity})</p>
              <p>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
            </div>
          ))}
          <div className="mt-4 text-right">
            <h2 className="text-xl font-bold">Subtotal: Rp {subtotal.toLocaleString('id-ID')}</h2>
            {/* Di sini nanti bisa tambah Tax dan Total */}
          </div>
        </div>
      )}
    </div>
  );
}

<div className="mt-6 text-right">
  <Link href="/payment">
    <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-800">
      Continue to Payment &rarr;
    </button>
  </Link>
</div>