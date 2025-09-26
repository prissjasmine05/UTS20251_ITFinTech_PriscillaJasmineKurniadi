// models/Payment.js
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  status: {
    type: String,
    default: 'pending', // Status default bisa "pending", "paid", dll
  },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
