import { PLANS } from "../config/plan.js";
import razorpay from "../config/razorpay.js";
import payment from "../models/payment.models.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const CreateOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.headers["x-forwarded-for"];
    const selectedPlan = PLANS[plan];
    if (!userId) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      // ye paise mein hona chahiye
      receipt: `receipt-${Date.now()}`,
      currency: "INR",
    });
    await payment.create({
      userId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      status: "pending",
    });
    return res.status(200).json({ order, plan: selectedPlan });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error while creating order ${error}` });
  }
};
export const VerifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (generateSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment Verification Failed" });
    }
    const Payment = await payment.findOne({ orderId: razorpay_order_id });
    if (!Payment) {
      return res.status(404).json({ messages: "Payment not found" });
    }
    Payment.paymentId = razorpay_payment_id;
    Payment.status = "success";
    await Payment.save();
    await axios.post(`${process.env.AUTH_SERVICE_URL}/updateUser`, {
      userId: Payment.userId,
      plan: Payment.plan,
      credits: Payment.credits,
    });
    return res.status(200).json({ message: "Payment Verified Successfully" });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};
