// models/Payment.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  paymentId: string;
  status: string;
}

const PaymentSchema: Schema = new Schema({
  paymentId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
