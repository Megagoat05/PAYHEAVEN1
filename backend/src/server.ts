import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendNewUserEmail, sendTopUpEmail, sendPurchaseEmail } from '../services/emailService';
import nowPaymentsRoutes from "./routes/nowpayments";


dotenv.config();

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // change in production

app.use(cors());
app.use(express.json());
app.use("/api/nowpayments", nowPaymentsRoutes);
// -------------------- Middlewares --------------------
function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function adminAuth(req: any, res: any, next: any) {
  const { password } = req.headers;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Forbidden: Invalid admin password" });
  }
  next();
}

async function ensureActive(req: any, res: any, next: any) {
  const u = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { frozen: true },
  });
  if (!u) return res.status(404).json({ error: "User not found" });
  if (u.frozen) return res.status(403).json({ error: "Account frozen" });
  next();
}

// -------------------- Health --------------------
app.get("/", (_req, res) => {
  res.send("Server is running");
});

// -------------------- Auth --------------------
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash } });
  await sendNewUserEmail(user.email); 

  return res.json({
    message: "Registered successfully",
    user: {
      id: user.id,
      email: user.email,
      balance: user.balance,
      frozen: user.frozen,
    },
  });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      balance: user.balance,
      frozen: user.frozen,
    },
  });
});

// User self-service password reset
app.post("/auth/reset-password", auth, async (req: any, res) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Current and new password are required" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid)
    return res.status(401).json({ error: "Incorrect current password" });

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return res.json({ message: "Password updated successfully" });
});

// -------------------- Admin --------------------
app.post("/admin/topup", adminAuth, async (req, res) => {
  const { email, amount } = req.body as { email?: string; amount?: number };
  if (!email || !amount)
    return res.status(400).json({ error: "Email and amount required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const updated = await prisma.user.update({
    where: { email },
    data: { balance: user.balance + amount },
  });
  await sendTopUpEmail(user.email, amount);

  return res.json({ message: `Added ${amount} to ${email}`, balance: updated.balance });
});

app.post("/admin/freeze", adminAuth, async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "Email required" });

  const updated = await prisma.user.update({
    where: { email },
    data: { frozen: true },
  });

  return res.json({ message: `${email} is now frozen`, user: updated });
});

app.post("/admin/unfreeze", adminAuth, async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "Email required" });

  const updated = await prisma.user.update({
    where: { email },
    data: { frozen: false },
  });

  return res.json({ message: `${email} is now unfrozen`, user: updated });
});

app.post("/admin/reset-password", adminAuth, async (req, res) => {
  const { email, newPassword } = req.body as {
    email?: string;
    newPassword?: string;
  };
  if (!email || !newPassword)
    return res
      .status(400)
      .json({ error: "Email and new password required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { passwordHash: newHash },
  });

  return res.json({ message: `Password reset for ${email}` });
});

app.delete("/admin/delete", adminAuth, async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "Email required" });

  await prisma.user.delete({ where: { email } });
  return res.json({ message: `${email} deleted successfully` });
});

// -------------------- Wallet: Self Top-Up (Fixed & Debugged) --------------------
app.post("/wallet/topup", auth, async (req: any, res) => {
  const { amount } = req.body as { amount?: any };
  console.log("📥 /wallet/topup called with:", { amount });

  if (!amount) {
    console.log("❌ Missing amount");
    return res.status(400).json({ error: "Amount required" });
  }

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    console.log("❌ Invalid amount:", amount);
    return res.status(400).json({ error: "Valid positive amount required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      console.log("❌ User not found:", req.user.userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("👤 Found user:", { email: user.email, balance: user.balance });

    // ✅ CORRECT: 'data:' is now included
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { balance: user.balance + amountNum },  // ✅ Fixed
    });

    console.log("✅ Balance updated in DB:", updated);
    // ADD THIS:
    const confirm = await prisma.user.findUnique({ where: { id: user.id } });
    console.log("🧪 DB confirms new balance:", confirm?.balance);

    // 📨 Notify admin
    await sendTopUpEmail(user.email, amountNum);

    return res.json({
      message: `Successfully added ${amountNum} to your balance`,
      balance: updated.balance,
    });
  } catch (err) {
    console.error("💥 prisma.user.update() failed:", err);
    return res.status(500).json({ error: "Failed to update balance" });
  }
});

// -------------------- Me / Users --------------------
app.get("/me", auth, ensureActive, async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({
    id: user.id,
    email: user.email,
    balance: user.balance,
    frozen: user.frozen,
  });
});

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// -------------------- Start --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
