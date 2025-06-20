import express from "express";
import { checkoutPay } from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/", checkoutPay);

export default router;