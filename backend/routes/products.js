
import express from "express";
const router = express.Router();
import productController from "../controllers/productController.js";
import {isAdmin, isAuth} from "../middleware/authMiddleware.js";

router.route('/').get(productController.getProducts);
router.route('/:id').get(productController.getProductById);
router.route('/').post(isAuth, isAdmin, productController.createProduct);
router.route('/:id').put(isAuth, isAdmin, productController.updateProduct);
router.route('/:id').delete(isAuth, isAdmin, productController.deleteProduct);
router.route('/:id/reviews').post(isAuth, productController.createProductReview);

export default router;
