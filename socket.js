import { Server } from "socket.io";
import ChatMessage from "./models/ChatMessage.js";
import "dotenv/config";

let io;
const connectedUsers = new Map();
const userRoles = new Map();

export const initSocketServer = (server, allowedOrigins) => {
    io = new Server(server, {
        cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            } else {
            callback(new Error("Not allowed by CORS (socket.io)"));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("register", ({ userId, role }) => {
            const userIdStr = userId.toString();
            connectedUsers.set(userIdStr, socket.id);
            userRoles.set(userIdStr, role);
            socket.data.userId = userIdStr;
            socket.data.role = role;

        });

        socket.on("send-message", async ({ from, to, message, isFromAdmin }) => {
            try {
                const savedMessage = await ChatMessage.create({ 
                    from, to, message, isFromAdmin: isFromAdmin || false
                });
                
                const populatedMessage = await ChatMessage.findById(savedMessage._id)
                    .populate("from", "username avatar")
                    .populate("to", "username avatar");

                const targetSocketId = connectedUsers.get(to.toString());
                if (targetSocketId) {
                    io.to(targetSocketId).emit("receive-message", populatedMessage);
                    
                    if (isFromAdmin) {
                        io.to(targetSocketId).emit("new-message-from-admin");
                    } else {
                        notifyAdmins("new-message-from-user", { userId: from });
                    }
                }

                const senderSocketId = connectedUsers.get(from.toString());
                if (senderSocketId) {
                    io.to(senderSocketId).emit("receive-message", populatedMessage);
                }

            } catch (err) {
                socket.emit("message-error", { error: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            const disconnectedUser = socket.data.userId;
            if (disconnectedUser) {
                connectedUsers.delete(disconnectedUser);
                userRoles.delete(disconnectedUser);
            }
        });
    });
};

const notifyAdmins = (event, data = {}) => {
    for (const [userId, socketId] of connectedUsers.entries()) {
        if (userRoles.get(userId) === "admin") {
            io.to(socketId).emit(event, data);
        }
    }
};

export const sendNewOrderNotification = () => {
    if (!io) return;
    notifyAdmins("new-order");
};

export const sendOrderStatusUpdate = (userId) => {
    const socketId = connectedUsers.get(userId.toString());
    if (socketId) {
        io.to(socketId).emit("order-status-update");
    }
};

export const getIoInstance = () => io;