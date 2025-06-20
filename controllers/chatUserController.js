import ChatMessage from "../models/ChatMessage.js";
import User from "../models/User.js";

export const getUsersChat = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới được xem danh sách người dùng chat" });
        }
        
        const messages = await ChatMessage.find({}).select("from to").lean();
        
        if (messages.length === 0) {
            return res.json([]);
        }

        const allUserIds = new Set();
        messages.forEach(msg => {
            allUserIds.add(msg.from.toString());
            allUserIds.add(msg.to.toString());
        });
        
        allUserIds.delete(req.user.id);
        
        const userIdsArray = Array.from(allUserIds);

        if (userIdsArray.length === 0) {
            return res.json([]);
        }

        const users = await User.find({ 
            _id: { $in: userIdsArray },
            role: { $ne: "admin" }
        }).select("_id username phone avatar").lean();
        
        res.json(users);
        
    } catch (err) {
        res.status(500).json({ 
            message: "Lỗi khi lấy danh sách người dùng", 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}