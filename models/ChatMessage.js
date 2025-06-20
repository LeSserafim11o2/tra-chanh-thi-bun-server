import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    from: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    to: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    message: {type: String, required: true},
    isFromAdmin: {type: Boolean, default: false},
    isRead: {type: Boolean, default: false}
}, {timestamps: true});

export default mongoose.model("ChatMessage", chatMessageSchema);