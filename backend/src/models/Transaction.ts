import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  transactionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  country: string;
  paymentMethod: "UPI" | "Card" | "Net Banking" | "Wallet";
  deviceId: string;
  ipAddress: string;
  timestamp: Date;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  status: "Safe" | "Suspicious" | "Blocked";
  reasons: string[];
}

const schema = new Schema<ITransaction>({
  transactionId: { type: String, unique: true, required: true },
  customerId: String, customerName: String, amount: Number, country: String,
  paymentMethod: { type: String, enum: ["UPI","Card","Net Banking","Wallet"] },
  deviceId: String, ipAddress: String, timestamp: Date,
  riskScore: Number,
  riskLevel: { type: String, enum: ["Low","Medium","High"] },
  status: { type: String, enum: ["Safe","Suspicious","Blocked"] },
  reasons: [String]
}, { timestamps: true });

export default mongoose.model<ITransaction>("Transaction", schema);
