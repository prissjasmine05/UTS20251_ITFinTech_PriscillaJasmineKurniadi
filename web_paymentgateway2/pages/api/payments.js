import { Xendit } from 'xendit-node';
import Payment from '../../models/Payment';
import connectDB from '../../lib/mongodb';

// Tentukan base URL secara dinamis
// Jika di Vercel, gunakan URL dari Vercel. Jika tidak (lokal), gunakan localhost.
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await connectDB(); // Pastikan koneksi DB dibuat di awal

  try {
    const { cart, total, customer } = req.body;

    if (!cart || !total || !customer) {
      return res.status(400).json({ error: 'Missing required data in request' });
    }

    const externalId = `invoice-uts-${Date.now()}`;

    // Buat payload untuk Xendit
    const invoicePayload = {
      externalId,
      amount: total,
      payerEmail: customer.email,
      description: `Pembayaran oleh ${customer.name} untuk pesanan #${externalId}`,
      customer: {
        given_names: customer.name,
        email: customer.email,
        address: customer.address,
      },
      // Gunakan BASE_URL yang sudah dinamis
      successRedirectUrl: `${BASE_URL}/success`,
      failureRedirectUrl: `${BASE_URL}/failure`,
    };

    // 1. Catat pembayaran di database kita dengan status PENDING
    await Payment.create({
      externalId: invoicePayload.externalId,
      amount: invoicePayload.amount,
      payerEmail: invoicePayload.payerEmail,
      status: 'PENDING',
      cart: cart,
    });

    // 2. Buat invoice di Xendit
    const invoice = await xenditClient.Invoice.createInvoice({ data: invoicePayload });

    res.status(200).json({ invoiceUrl: invoice.invoiceUrl });

  } catch (error) {
    console.error('Xendit API Error:', error);
    const errorMessage = error.message || 'Failed to create payment invoice';
    res.status(500).json({ error: errorMessage });
  }
}

