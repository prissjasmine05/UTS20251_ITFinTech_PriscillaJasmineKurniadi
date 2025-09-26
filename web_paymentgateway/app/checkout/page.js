// app/checkout/page.js
import Link from 'next/link';

export default function Checkout() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p>Your selected products:</p>
      <ul>
        <li>Product 1 - $50</li>
        <li>Product 2 - $30</li>
      </ul>
      <p>Total: $80</p>
      <Link href="/payment">
        <button className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Proceed to Payment</button>
      </Link>
    </div>
  );
}
