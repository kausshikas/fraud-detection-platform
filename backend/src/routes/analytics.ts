import { Router } from "express";
import Transaction from "../models/Transaction";

const router = Router();

router.get("/", async (_req, res) => {
  const [byCountry, byMethod, byRisk, totals] = await Promise.all([
    Transaction.aggregate([{ $group: { _id: "$country", transactions: { $sum: 1 }, fraud: { $sum: { $cond: [{ $in: ["$riskLevel", ["Medium","High"]] }, 1, 0] } } } }, { $sort: { fraud: -1 } }]),
    Transaction.aggregate([{ $group: { _id: "$paymentMethod", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Transaction.aggregate([{ $group: { _id: "$riskLevel", count: { $sum: 1 } } }]),
    Transaction.aggregate([{ $group: { _id: null, amount: { $sum: "$amount" }, avg: { $avg: "$amount" }, count: { $sum: 1 } } }])
  ]);
  res.json({ byCountry, byMethod, byRisk, totals: totals[0] || { amount: 0, avg: 0, count: 0 } });
});

export default router;
