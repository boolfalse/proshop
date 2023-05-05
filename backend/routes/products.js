
import express from "express";
const router = express.Router();
import asyncHandler from "../middleware/async-handler.js";
import Product from "../models/productModel.js";

router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    return res.json(products).status(200);
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product).status(200);
    }
    return res.status(404).json({
        message: 'Product not found!'
    });
}));

export default router;
