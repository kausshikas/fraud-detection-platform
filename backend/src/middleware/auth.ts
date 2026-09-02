import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Authentication required" });
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
