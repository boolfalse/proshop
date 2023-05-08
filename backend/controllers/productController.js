
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    return res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.status(200).json(product);
    }

    res.status(404);
    throw new Error('Resource not found!');
});

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        user: req.user._id,
        name: req.body.name || 'Sample name',
        category: req.body.category || 'Sample category',
        brand: req.body.brand || 'Sample brand',
        price: req.body.price || 0,
        image: '/images/sample.jpg',
        countInStock: req.body.countInStock || 0,
        description: req.body.description || 'Sample description',
        numReviews: req.body.numReviews || 0,
    });
    const createdProduct = await product.save();

    return res.status(201).json(createdProduct);
});

const editProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.updateOne({
        _id: productId,
        name: req.body.name,
        category: req.body.category,
        brand: req.body.brand,
        price: req.body.price,
    });

    return res.status(201).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    await Product.deleteOne({
        _id: productId
    });

    return res.status(201).json(product);
});

export default {
    getProducts,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct,
};
