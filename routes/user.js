import express from "express";
import { updateUserInfomation, getUserInfomation } from "../controllers/usersController.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

router.put("/update", verifyToken, updateUserInfomation);
router.get("/me", verifyToken, getUserInfomation);

export default router;