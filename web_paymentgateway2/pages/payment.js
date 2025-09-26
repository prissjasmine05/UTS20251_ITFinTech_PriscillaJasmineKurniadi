import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function PaymentPage() {
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  // State untuk menyimpan data customer dari form
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  // Fungsi untuk handle perubahan di input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  // Fungsi final untuk handle pembayaran
  const handlePayment = async () => {
    // Validasi sederhana, pastikan semua field diisi
    if (!customer.name || !customer.email || !customer.address) {
      alert('Harap isi semua informasi customer.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kirim data keranjang, total, dan customer ke backend
        body: JSON.stringify({ cart, total, customer }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment creation failed');
      }
      const { invoiceUrl } = await response.json();
      window.location.href = invoiceUrl; // Redirect ke Xendit
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Gagal membuat link pembayaran: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto p-4 max-w-2xl">
        <Link href="/checkout">
            <button className="text-blue-500 mb-4">&larr; Back to Checkout</button>
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 border-b pb-4">Secure Checkout</h1>

            {/* Form Informasi Customer */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
              <div className="space-y-3">
                <input type="text" name="name" placeholder="Full Name" value={customer.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                <input type="email" name="email" placeholder="Email" value={customer.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                <textarea name="address" placeholder="Shipping Address" value={customer.address} onChange={handleInputChange} className="w-full p-2 border rounded-md" rows="3" required></textarea>
              </div>
            </div>

            {/* Order Summary */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                <div className="space-y-1 text-gray-700">
                    <div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between"><span>Tax (11%)</span><span>Rp {tax.toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between font-bold text-lg text-black"><span>Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
                </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading || cart.length === 0}
              className="bg-black text-white w-full font-bold py-3 px-6 rounded-lg hover:bg-gray-800 mt-8 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? 'Processing...' : 'Confirm & Pay'}
            </button>
        </div>
      </div>
    </div>
  );
}