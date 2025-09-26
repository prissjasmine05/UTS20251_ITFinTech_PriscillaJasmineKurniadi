import Payment from '../../../models/Payment';
import connectDB from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Ambil token verifikasi dari header
  const xenditWebhookToken = req.headers['x-callback-token'];

  // Verifikasi apakah notifikasi ini benar-benar dari Xendit
  if (xenditWebhookToken !== process.env.XENDIT_CALLBACK_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { external_id, status } = req.body;

  // Jika statusnya PAID (LUNAS)
  if (status === 'PAID') {
    await connectDB();
    try {
      // Cari pembayaran di database kita berdasarkan external_id
      const payment = await Payment.findOneAndUpdate(
        { externalId: external_id },
        { status: 'PAID' }, // Update statusnya menjadi PAID
        { new: true }
      );

      if (!payment) {
        console.log(`Webhook: Payment with external_id ${external_id} not found.`);
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      console.log(`Webhook: Payment ${external_id} successfully updated to PAID.`);

    } catch (error) {
      console.error('Webhook DB update error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Kirim balasan sukses ke Xendit
  res.status(200).json({ message: 'Webhook received successfully' });
}
```

**Langkah 1.4: Tambahkan Token ke `.env.local`**
Buka `.env.local` dan tambahkan baris baru untuk token rahasia webhook.
```
XENDIT_CALLBACK_TOKEN="INI_TOKEN_RAHASIA_KITA_NANTI"
