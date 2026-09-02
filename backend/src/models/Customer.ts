import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  accountAgeDays: number;
  transactionCount: number;
  totalAmount: number;
  riskLevel: "Low" | "Medium" | "High";
  status: "Active" | "Under Review" | "Blocked";
}

const schema = new Schema<ICustomer>({
  customerId: { type: String, unique: true, required: true },
  name: String, email: String, phone: String, country: String,
  accountAgeDays: Number, transactionCount: Number, totalAmount: Number,
  riskLevel: { type: String, enum: ["Low","Medium","High"], default: "Low" },
  status: { type: String, enum: ["Active","Under Review","Blocked"], default: "Active" }
}, { timestamps: true });

export default mongoose.model<ICustomer>("Customer", schema);
