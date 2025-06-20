import ChatMessage from "../models/ChatMessage.js";

export const getUserChat = async (req, res) => {
    try {
        const messages = await ChatMessage.find({
        $or: [
            { from: req.params.userId, to: req.user.id },
            { from: req.user.id, to: req.params.userId },
        ],
        })
        .sort({ createdAt: 1 })
        .populate("from", "username avatar")
        .populate("to", "username avatar");

        await ChatMessage.updateMany(
            { from: req.params.userId, to: req.user.id, isRead: false },
            { isRead: true }
        );

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy tin nhắn", error: err.message });
    }
}

export const getMessageCount = async (req, res) => {
    try {
        const unreadCount = await ChatMessage.countDocuments({
            to: req.user.id,
            isRead: false
        });
        res.json({ unreadCount });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy số tin nhắn chưa đọc", error: err.message });
    }
}

export const getMessageUserSend = async (req, res) => {
    try {
        const unreadMessages = await ChatMessage.aggregate([
            { $match: { to: req.user.id, isRead: false } },
            { $group: { _id: "$from", count: { $sum: 1 } } }
        ]);
        
        const unreadByUser = {};
        unreadMessages.forEach(item => {
            unreadByUser[item._id] = item.count;
        });
        
        res.json(unreadByUser);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy tin nhắn chưa đọc theo user", error: err.message });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { to, message, isFromAdmin = false } = req.body;
        const newMsg = await ChatMessage.create({
        from: req.user.id,
        to,
        message,
        isFromAdmin,
        isRead: false
        });
        res.status(201).json(newMsg);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi gửi tin nhắn", error: err.message });
    }
}

export const deleteMessage = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được xoá tin nhắn" });
        }

        await ChatMessage.deleteMany({
            $or: [
                { from: req.params.userId, to: req.user.id },
                { from: req.user.id, to: req.params.userId },
                { from: req.params.userId },
                { to: req.params.userId }
            ]
        });

        res.json({ message: "Đã xoá toàn bộ tin nhắn với user này" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xoá tin nhắn", error: err.message });
    }
}