import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  planId: {
    type: Number,
    required: true,
  },
  paymentLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
