import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  externalId: { 
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
    enum: ['PENDING', 'PAID', 'FAILED'], 
    default: 'PENDING',
  },
  cart: { 
    type: Array,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
