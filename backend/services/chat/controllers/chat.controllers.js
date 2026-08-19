import Conversation from "../models/conversation.models.js";
import Message from "../models/messages.models.js";
const createconversation = async (req, res) => {
  try {
    const userId = req.headers["x-forwarded-for"];
    console.log("User ID from header:", userId);
    const conversation = await Conversation.create({ userId: userId });
    return res.status(201).json(conversation);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};
const getconversations = async (req, res) => {
  try {
    const userId = req.headers["x-forwarded-for"];
    const conversations = await Conversation.find({ userId: userId }).sort({
      updatedAt: -1,
    });
    return res.status(200).json(conversations);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};
const Updateconversations = async (req, res) => {
  try {
    const { Id, title } = req.body;
    if (!Id) {
      return res.status(400).json({ message: "conversation id is required" });
    }
    const conversation = await Conversation.findByIdAndUpdate(Id, { title });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const savemessages = async (req, res) => {
  try {
    
    const { conversationId, role, content, images,Artifacts } = req.body;
    const message = await Message.create({
      conversationId,
      role,
      content,
      images,
      Artifacts
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getmessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }
    const messages = await Message.find({ conversationId });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export {
  createconversation,
  getconversations,
  Updateconversations,
  savemessages,
  getmessages,
};
