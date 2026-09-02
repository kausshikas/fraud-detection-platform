import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { config } from "./config";
import auth from "./routes/auth";
import dashboard from "./routes/dashboard";
import transactions from "./routes/transactions";
import customers from "./routes/customers";
import alerts from "./routes/alerts";
import analytics from "./routes/analytics";

const app = express();
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "FraudGuard API", time: new Date() }));
app.use("/api/auth", auth);
app.use("/api/dashboard", dashboard);
app.use("/api/transactions", transactions);
app.use("/api/customers", customers);
app.use("/api/alerts", alerts);
app.use("/api/analytics", analytics);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

mongoose.connect(config.mongoUri).then(() => {
  app.listen(config.port, () => console.log(`FraudGuard API running on http://localhost:${config.port}`));
}).catch(err => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
