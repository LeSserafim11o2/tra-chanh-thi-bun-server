import express from "express";
import { getProducts, getProductCategory, getProductsDetail, addProducts, editProducts, deleteProducts } from "../controllers/productsController.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/slug/:slug", getProductCategory);
router.get("/:id", getProductsDetail);
router.post("/", addProducts);
router.put("/:id", editProducts);
router.delete("/:id", deleteProducts);

export default router;