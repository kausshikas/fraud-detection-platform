import { Router } from "express";
import Alert from "../models/Alert";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await Alert.find().sort({ createdAt: -1 }).limit(200));
});

router.patch("/:id", async (req, res) => {
  const alert = await Alert.findOneAndUpdate({ alertId: req.params.id }, { status: req.body.status }, { new: true });
  if (!alert) return res.status(404).json({ message: "Alert not found" });
  res.json(alert);
});

export default router;
