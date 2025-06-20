import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getUsersChat } from "../controllers/chatUserController.js";

const router = express.Router();

router.get("/users", verifyToken, getUsersChat);

export default router;