import Order from "../models/Order.js";
import { sendOrderStatusUpdate } from "../socket.js";

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .populate("user", "username phone address")
        .populate("items.product", "name price image")
        .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error: err.message });
    }
}

export const editOrder = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
        ).populate("user", "_id");

        if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        sendOrderStatusUpdate(updated.user._id.toString());

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: err.message });
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id })
        .populate("items.product", "name price")
        .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Không lấy được đơn hàng người dùng", error: err.message });
    }
}

export const deleteOrders = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xoá đơn hàng" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi xoá đơn hàng", error: err.message });
    }
}