// models/Payment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: string; // ID do usuário associado ao pagamento
  planId: number; // ID do plano
  status: string; // Status do pagamento
  date: Date; // Data do pagamento
  amount: number; // Valor do pagamento
}

const PaymentSchema: Schema = new Schema({
  userId: { type: String, required: true },
  planId: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
