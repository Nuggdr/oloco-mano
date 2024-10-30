import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Refira-se ao modelo do usuário
  },
  planId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
    unique: true, // Garanta que não haja duplicatas
  },
  paymentLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
