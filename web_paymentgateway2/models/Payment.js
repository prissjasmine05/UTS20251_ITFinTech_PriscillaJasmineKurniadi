import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  externalId: { // ID unik dari invoice Xendit
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  payerEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'PAID', 'FAILED'], // Status hanya bisa salah satu dari ini
    default: 'PENDING',
  },
  cart: { // Simpan detail keranjang untuk arsip
    type: Array,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
