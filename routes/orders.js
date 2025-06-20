import express from "express";
import { getOrders, editOrder, getUserOrders, deleteOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.put("/:id", editOrder);
router.get("/user/:id", getUserOrders);
router.delete("/:id", deleteOrders);

export default router;