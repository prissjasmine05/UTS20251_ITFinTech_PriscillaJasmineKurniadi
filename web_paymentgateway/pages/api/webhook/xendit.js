import Payment from '../../../models/Payment';
import connectDB from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("Webhook received!"); // Log untuk debugging

    // 1. Ambil token verifikasi dari header
    const xenditWebhookToken = req.headers['x-callback-token'];
    
    // 2. Verifikasi apakah token cocok
    if (xenditWebhookToken !== process.env.XENDIT_CALLBACK_TOKEN) {
      console.error("Webhook Error: Invalid callback token");
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 3. Ambil data penting dari body request
    const { external_id, status } = req.body;
    console.log(`Webhook data: external_id=${external_id}, status=${status}`);

    // 4. Proses hanya jika statusnya PAID (LUNAS)
    if (status === 'PAID') {
      await connectDB();
      
      const payment = await Payment.findOneAndUpdate(
        { externalId: external_id }, 
        { status: 'PAID' },           
        { new: true }              
      );

      if (!payment) {
        console.warn(`Webhook: Payment with external_id ${external_id} not found.`);
        return res.status(200).json({ message: 'Payment not found, but webhook acknowledged.' });
      }
      
      console.log(`Webhook SUCCESS: Payment ${external_id} updated to PAID.`);
    }

    // 5. Selalu kirim balasan 200 OK ke Xendit jika tidak ada error
    res.status(200).json({ message: 'Webhook received successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

