// app/payment/page.js
export default function Payment() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p>Enter your payment details:</p>
        <input type="text" placeholder="Card Number" className="border p-2 w-full mb-4" />
        <input type="text" placeholder="Expiry Date" className="border p-2 w-full mb-4" />
        <button className="bg-green-500 text-white px-4 py-2 rounded">Pay Now</button>
      </div>
    );
  }
  