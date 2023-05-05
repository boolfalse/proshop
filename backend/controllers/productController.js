
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    return res.json(products).status(200);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product).status(200);
    }

    res.status(404);
    throw new Error('Resource not found!');
});

export { getProducts, getProductById };
