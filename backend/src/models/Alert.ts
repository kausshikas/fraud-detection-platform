import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  alertId: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  country: string;
  riskLevel: "Medium" | "High";
  reason: string;
  status: "Open" | "Investigating" | "Resolved";
  createdAt: Date;
}

const schema = new Schema<IAlert>({
  alertId: { type: String, unique: true, required: true },
  transactionId: String, customerId: String, customerName: String,
  amount: Number, country: String,
  riskLevel: { type: String, enum: ["Medium","High"] },
  reason: String,
  status: { type: String, enum: ["Open","Investigating","Resolved"], default: "Open" }
}, { timestamps: true });

export default mongoose.model<IAlert>("Alert", schema);
