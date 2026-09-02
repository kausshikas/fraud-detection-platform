import { Router } from "express";
import Customer from "../models/Customer";

const router = Router();

router.get("/", async (req, res) => {
  const q = String(req.query.search || "").trim();
  const filter = q ? { $or: [
    { customerId: { $regex: q, $options: "i" } },
    { name: { $regex: q, $options: "i" } },
    { email: { $regex: q, $options: "i" } },
    { country: { $regex: q, $options: "i" } }
  ] } : {};
  res.json(await Customer.find(filter).sort({ createdAt: -1 }).limit(200));
});

export default router;
