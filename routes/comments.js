import express from "express";
import Comment from "../models/Comment.js";
import {verifyToken} from "../middleware/auth.js";
import { getProductComment, editProductComment, deleteProductComment, sendProductComment } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:productId", getProductComment);
router.post("/", verifyToken, sendProductComment);
router.put("/:id", verifyToken, editProductComment);
router.delete("/:id", verifyToken, deleteProductComment);

export default router;