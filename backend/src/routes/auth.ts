import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
export const authRouter = Router();

// User signup
authRouter.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { email, name, password: hash, role: "USER" } });
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ success: true, token });
});

// User login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ success: true, token });
});
