import express from "express";
import {verifyToken} from "../middleware/auth.js";
import { getMessageCount, getUserChat, getMessageUserSend, sendMessage, deleteMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userId", verifyToken, getUserChat);
router.get("/unread/count", verifyToken, getMessageCount);
router.get("/unread/by-user", verifyToken, getMessageUserSend);
router.post("/", verifyToken, sendMessage);
router.delete("/:userId", verifyToken, deleteMessage);

export default router;