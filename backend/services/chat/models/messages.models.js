import mongoose from "mongoose";
const innerSchema2 = new mongoose.Schema({
  name: String,
  content: String,
},{
  _id:false
});

const innerSchema = new mongoose.Schema({
  id: Number,
  type: String,
  title:String,
  files: [innerSchema2]
},{
  _id:false
});
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
    },
    content: String,
    images: [String],
    Artifacts: [innerSchema],
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
