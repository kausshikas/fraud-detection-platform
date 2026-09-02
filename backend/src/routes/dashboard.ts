import { Router } from "express";
import Transaction from "../models/Transaction";
import Customer from "../models/Customer";
import Alert from "../models/Alert";

const router = Router();

router.get("/summary", async (_req, res) => {
  const [totalTransactions, customers, alerts, suspicious, highRisk] = await Promise.all([
    Transaction.countDocuments(),
    Customer.countDocuments(),
    Alert.countDocuments(),
    Transaction.countDocuments({ status: "Suspicious" }),
    Transaction.countDocuments({ riskLevel: "High" })
  ]);

  const risk = await Transaction.aggregate([{ $group: { _id: "$riskLevel", count: { $sum: 1 } } }]);
  const trend = await Transaction.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, transactions: { $sum: 1 }, fraud: { $sum: { $cond: [{ $in: ["$riskLevel", ["Medium","High"]] }, 1, 0] } } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({ totalTransactions, customers, alerts, suspicious, highRisk, risk, trend });
});

export default router;
