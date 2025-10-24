// pages/api/webhook/xendit.js
import connectDB from '../../../lib/mongodb';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1) Verifikasi callback token dari Xendit
    const xenditWebhookToken = req.headers['x-callback-token'];
    if (!xenditWebhookToken || xenditWebhookToken !== process.env.XENDIT_CALLBACK_TOKEN) {
      console.error('[XENDIT WEBHOOK] Invalid callback token');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 2) Ambil payload penting
    const {
      external_id,    // id invoice/checkout kamu
      status,         // PENDING | PAID | EXPIRED | ...
      paid_amount,    // optional, jumlah terbayar
      paid_at,        // optional, timestamp pembayaran
      invoice_url     // optional, url invoice
    } = req.body || {};

    console.log('[XENDIT WEBHOOK] received:', { external_id, status, paid_amount, paid_at });

    if (!external_id || !status) {
      return res.status(400).json({ message: 'Missing required fields from Xendit' });
    }

    await connectDB();

    // 3) Tangani status
    if (status === 'PAID') {
      const update = {
        status: 'PAID',
        // pakai paidAt dari Xendit kalau ada, fallback ke now
        paidAt: paid_at ? new Date(paid_at) : new Date(),
      };
      // opsional: sinkron amount bila dikirim (jaga-jaga)
      if (typeof paid_amount === 'number') update.amount = paid_amount;
      if (invoice_url) update.invoiceUrl = invoice_url;

      const payment = await Payment.findOneAndUpdate(
        { externalId: external_id },
        update,
        { new: true }
      );

      if (!payment) {
        console.warn(`[XENDIT WEBHOOK] Payment not found for externalId=${external_id}`);
        return res.status(200).json({ message: 'Payment not found, but webhook acknowledged.' });
      }

      console.log(`[XENDIT WEBHOOK] Payment ${external_id} updated to PAID with paidAt=${update.paidAt.toISOString()}`);
    } else if (status === 'EXPIRED') {
      await Payment.findOneAndUpdate(
        { externalId: external_id },
        { status: 'EXPIRED' }
      );
      console.log(`[XENDIT WEBHOOK] Payment ${external_id} marked as EXPIRED`);
    } else if (status === 'PENDING') {
      // optional: jaga-jaga kalau kamu mau nyimpan
      await Payment.findOneAndUpdate(
        { externalId: external_id },
        { status: 'PENDING' }
      );
      console.log(`[XENDIT WEBHOOK] Payment ${external_id} still PENDING`);
    } else {
      // status lain kalau mau kamu tangani
      console.log(`[XENDIT WEBHOOK] Unhandled status "${status}" for externalId=${external_id}`);
    }

    // 4) Kirim 200 OK supaya Xendit tidak retry
    return res.status(200).json({ message: 'Webhook processed' });
  } catch (err) {
    console.error('[XENDIT WEBHOOK] Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
