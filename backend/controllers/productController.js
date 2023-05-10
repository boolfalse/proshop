
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    const { keyword } = req.query;
    const filter = keyword ? {
        name: {
            $regex: keyword,
            $options: 'i', // case insensitive
        },
    } : {};

    const itemsCount = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    return res.status(200).json({
        items: products,
        page,
        itemsCount,
        pagesCount: Math.ceil(itemsCount / pageSize),
    });
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

const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        category,
        brand,
        price,
        image,
        countInStock,
        description,
        // numReviews,
    } = req.body;

    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = name;
        product.category = category;
        product.brand = brand;
        product.price = price;
        product.image = image;
        product.countInStock = countInStock;
        product.description = description;
        // product.numReviews = 0;

        const updatedProduct = await product.save();
        return res.status(200).json(updatedProduct);
    }

    res.status(404);
    throw new Error('Resource not found!');
});

const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        await Product.deleteOne({ _id: productId })
        return res.status(200).json({ message: 'Product deleted.' });
    }

    res.status(404);
    throw new Error('Resource not found!');
});

const createProductReview = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Resource not found!');
    }

    const {rating, comment} = req.body;
    const alreadyReviewed = product.reviews.find(
        review => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed!');
    }

    product.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    });
    product.numReviews = product.reviews.length;

    const allReviews = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = allReviews / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added!' });
});

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
        .sort({ rating: -1 })
        .limit(3);

    res.status(200).json(products);
});

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
};
