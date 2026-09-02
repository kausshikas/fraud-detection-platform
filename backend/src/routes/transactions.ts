import { Router } from "express";
import Transaction from "../models/Transaction";
import Customer from "../models/Customer";
import Alert from "../models/Alert";
import { scoreTransaction } from "../fraud/scoring";

const router = Router();

router.get("/", async (req, res) => {
  const q = String(req.query.search || "").trim();
  const risk = String(req.query.risk || "").trim();
  const status = String(req.query.status || "").trim();
  const filter: Record<string, unknown> = {};
  if (q) filter.$or = [
    { transactionId: { $regex: q, $options: "i" } },
    { customerName: { $regex: q, $options: "i" } },
    { country: { $regex: q, $options: "i" } }
  ];
  if (risk && risk !== "All") filter.riskLevel = risk;
  if (status && status !== "All") filter.status = status;
  const data = await Transaction.find(filter).sort({ timestamp: -1 }).limit(200);
  res.json(data);
});

router.post("/analyze", async (req, res) => {
  const { customerId, amount, country, paymentMethod, rapidTransactions, previousCountry } = req.body;
  if (!customerId || !amount || !country || !paymentMethod) return res.status(400).json({ message: "customerId, amount, country and paymentMethod are required" });

  const customer = await Customer.findOne({ customerId });
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  const result = scoreTransaction({
    amount: Number(amount), country, paymentMethod,
    accountAgeDays: customer.accountAgeDays,
    rapidTransactions: Number(rapidTransactions || 0),
    previousCountry
  });

  const transactionId = `TXN-${Date.now().toString().slice(-8)}`;
  const tx = await Transaction.create({
    transactionId, customerId, customerName: customer.name, amount: Number(amount),
    country, paymentMethod, deviceId: `DEV-${Math.floor(Math.random()*9000+1000)}`,
    ipAddress: `192.168.1.${Math.floor(Math.random()*220+10)}`,
    timestamp: new Date(), ...result
  });

  if (result.level !== "Low") {
    await Alert.create({
      alertId: `ALT-${Date.now().toString().slice(-8)}`,
      transactionId, customerId, customerName: customer.name, amount: Number(amount),
      country, riskLevel: result.level, reason: result.reasons.join(", ")
    });
  }

  res.status(201).json(tx);
});

export default router;
