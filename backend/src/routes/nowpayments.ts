import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

const API_KEY = process.env.NOWPAYMENTS_API_KEY!;
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET!;

// ---------------------- Create Crypto Payment ----------------------
router.post("/create-payment", async (req, res) => {
  const { amount, email, currency } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({ error: "Minimum $100" });
  }

  if (!email) {
    return res.status(400).json({ error: "User email required" });
  }

  try {
    const orderId = Date.now().toString();

    // Store pending top-up in DB
    await prisma.topUpRequest.create({
      data: {
        email,
        amount,
        status: "pending",
        orderId,
      },
    });

    // Create NOWPayments invoice
    const response = await axios.post(
      "https://api.nowpayments.io/v1/payment",
      {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: currency || "usdttrc20",
        ipn_callback_url: `${process.env.BASE_URL}/api/nowpayments/webhook`,
        order_id: orderId,
        order_description: `Top-up for ${email}`,
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      },
      {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("NOWPayments response:", response.data);

    return res.json({
      address: response.data.pay_address,
      currency: response.data.pay_currency,
      amountToSend: response.data.pay_amount,
      invoiceUrl: response.data.invoice_url, // ✅ This should be used in frontend as an <a> href
    });
  } catch (error: any) {
    console.error(
      "NOWPayments create error:",
      error?.response?.data || error?.message || error
    );

    return res.status(500).json({
      error: "Failed to create payment",
      details: error?.response?.data || error?.message || "Unknown error",
    });
  }
});

// ---------------------- Webhook: Confirm Payment ----------------------
router.post("/webhook", bodyParser.json(), async (req, res) => {
  try {
    const signature = req.headers["x-nowpayments-sig"] as string;
    const bodyStr = JSON.stringify(req.body);
    const hmac = crypto
      .createHmac("sha512", IPN_SECRET)
      .update(bodyStr)
      .digest("hex");

    if (hmac !== signature) {
      console.error("❌ Invalid NOWPayments signature");
      return res.status(400).send("Invalid signature");
    }

    console.log("📩 NOWPayments Webhook Received:", req.body);

    if (req.body.payment_status === "finished") {
      const email = req.body.order_description
        .replace("Top-up for ", "")
        .trim();
      const amount = parseFloat(req.body.price_amount || "0");
      const orderId = req.body.order_id;

      if (!email || amount <= 0) {
        console.error("⚠️ Invalid webhook data");
        return res.status(400).send("Invalid data");
      }

      const topUp = await prisma.topUpRequest.findUnique({
        where: { orderId },
      });

      if (!topUp || topUp.status === "completed") {
        console.log(`⚠️ Order ${orderId} already processed or not found`);
        return res.status(200).send("OK");
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.error(`⚠️ No user found for email: ${email}`);
        return res.status(404).send("User not found");
      }

      await prisma.user.update({
        where: { email },
        data: { balance: user.balance + amount },
      });

      await prisma.topUpRequest.update({
        where: { orderId },
        data: { status: "completed" },
      });

      console.log(`✅ Credited $${amount} to ${email}`);
    }

    return res.status(200).send("OK");
  } catch (err: any) {
    console.error("Webhook processing error:", err?.message || err);
    return res.status(500).send("Server error");
  }
});

export default router;
