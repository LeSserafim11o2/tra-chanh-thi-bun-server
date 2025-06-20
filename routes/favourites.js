import express from 'express';
import { verifyToken } from "../middleware/auth.js";
import { getFavouritesProducts, editFavouritesProducts, removeFavouritesProducts } from '../controllers/favouritesController.js';
const router = express.Router();

router.get('/', verifyToken, getFavouritesProducts);
router.post('/:productId', verifyToken, editFavouritesProducts);
router.delete('/:productId', verifyToken, removeFavouritesProducts);

export default router;