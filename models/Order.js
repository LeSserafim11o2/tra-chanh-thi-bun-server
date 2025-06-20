import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    note: { type: String },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "bank"], default: "cash" },
    status: {
        type: String,
        enum: ["Chờ xác nhận", "Đang giao", "Đã giao", "Đã huỷ"],
        default: "Chờ xác nhận"
    }
}, {timestamps: true});

export default mongoose.model("Order", OrderSchema);