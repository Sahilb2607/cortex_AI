import express from "express";
import { createconversation, getconversations, Updateconversations, savemessages, getmessages } from "../controllers/chat.controllers.js";
const router = express.Router();

router.get("/get-conversations", getconversations);
router.get("/create-conversations", createconversation);
router.post("/conversations", Updateconversations);
router.post("/messages", savemessages);
router.get("/messages/:conversationId", getmessages);

export default router