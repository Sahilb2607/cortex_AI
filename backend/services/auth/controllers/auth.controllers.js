import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import crypto from "crypto";
import User from "../models/user.models.js";
import redis from "../../../shared/redis/redis.js";

const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        avatar: decodedToken.picture,
      });
    }
    const SessionId = await crypto.randomUUID();
    res.cookie("session", SessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    await redis.set(`user-${user._id}`, SessionId, "EX", 7 * 24 * 60 * 60);
    await redis.set(
      `session:${SessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Error while Login ${error}` });
  }
};

const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
const UpdateAfterPayment = async (req, res) => {
  try {
    const { userId, plan, credits } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();
    // const sessionId = req.cookies?.session;
    // here it wont work as we are not getting sessionId
    const sessionId = await redis.get(`user-${user._id}`);
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error while updating after payment ${error}` });
  }
};
const reductCredit = async (req,res) => {
  try {
    const { userId, agent } = req.body;
    const COST = {
      chat: 1,
      search: 5,
      coding: 10,
      pdf: 10,
      ppt: 10,
      vision: 10,
    };
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }
    const reduct = COST[agent] || 1;
    if (user.credits < reduct) {
      return res.status(400).json({ message: "Credit insufficient" });
    }
    user.credits -= reduct;
    await user.save();
    const sessionId = await redis.get(`user-${user._id}`);
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );
    return res.status(200).json({ sucess: true, credits: user.credits });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Error while reducting credit ${error}` });
  }
};
export { login, logout, UpdateAfterPayment, reductCredit };
