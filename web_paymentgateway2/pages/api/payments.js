import { Xendit } from 'xendit-node';

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, total, customer } = req.body;

    if (!cart || !total || !customer) {
      return res.status(400).json({ error: 'Missing required data in request' });
    }

    const externalId = `invoice-uts-${Date.now()}`;

    // --- INI PERBAIKAN FINALNYA ---
    // Nama fungsinya adalah `createInvoice`, bukan `create`.
    const invoice = await xenditClient.Invoice.createInvoice({ data: {
      externalId,
      amount: total,
      payerEmail: customer.email,
      description: `Pembayaran oleh ${customer.name} untuk pesanan #${externalId}`,
      customer: {
        given_names: customer.name,
        email: customer.email,
        address: customer.address,
      },
      successRedirectUrl: 'http://localhost:3000/success',
      failureRedirectUrl: 'http://localhost:3000/failure',
  }});

    res.status(200).json({ invoiceUrl: invoice.invoiceUrl });

  } catch (error) {
    console.error('Xendit API Error:', error);
    const errorMessage = error.message || 'Failed to create payment invoice';
    res.status(500).json({ error: errorMessage });
  }
}