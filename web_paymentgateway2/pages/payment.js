// pages/payment.js
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function PaymentPage() {
  const { cart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11; // Contoh pajak 11%
  const total = subtotal + tax;

  const handlePayment = async () => {
    // --- LOGIC UNTUK MENGHUBUNGI API XENDIT AKAN ADA DI SINI ---
    alert('Tombol ini akan dihubungkan ke Xendit!');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link href="/checkout">
        <button className="text-blue-500 mb-4">&larr; Back to Checkout</button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Shipping Address (Dummy) */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
          <p>Jalan Jenderal Sudirman No. 1, Jakarta Pusat, 10220</p>
        </div>

        <hr className="my-6" />

        {/* Payment Method (Dummy) */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" name="payment" className="mr-2" defaultChecked />
              Credit/Debit Card
            </label>
            <label className="flex items-center">
              <input type="radio" name="payment" className="mr-2" />
              E-Wallet / Bank Transfer
            </label>
          </div>
        </div>

        <hr className="my-6" />

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="space-y-1 text-gray-700">
            <div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between"><span>Tax (11%)</span><span>Rp {tax.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="bg-black text-white w-full font-bold py-3 px-6 rounded hover:bg-gray-800 mt-8"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}