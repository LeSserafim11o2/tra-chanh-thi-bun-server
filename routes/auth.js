import express from "express";
import "dotenv/config";
import { authLogin, authRegister } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", authRegister);
router.post("/login", authLogin);

export default router;