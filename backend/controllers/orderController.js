
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// for user
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items!');
    }

    const items = orderItems.map((item) => ({
        ...item,
        product: item._id,
        _id: undefined,
    }))

    const order = new Order({
        orderItems: items,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
});
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json(orders);
});
const getMyOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);

    if (order) {
        return res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Resource not found!');
    }
});
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            updateTime: req.body.update_time,
            email: req.body.payer.email_address,
        };
        const updatedOrder = await order.save();

        return res.status(200).json(updatedOrder);
    }

    res.status(404);
    throw new Error('Resource not found!');
});
// for admin
const getOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id)
        .populate('user', 'name email');

    if (order) {
        return res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Resource not found!');
    }
});
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();

        return res.status(200).json(updatedOrder);
    }

    res.status(404);
    throw new Error('Resource not found!');
});
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'id name');

    res.status(200).json(orders);
});

export default {
    addOrderItems,
    getMyOrders,
    getMyOrderById,
    updateOrderToPaid,
    getOrderById,
    updateOrderToDelivered,
    getOrders,
};
