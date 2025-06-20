import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, minlength: 1, maxlength: 1000, trim: true },
    rating: { type: Number, min: 1, max: 5 },
}, {timestamps: true})

export default mongoose.model("Comment", CommentSchema);