import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { _id, orderItems, shippingAddress } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }


    const order = new Order({
        user: _id,
        orderItems,
        shippingAddress,
        deliveredAt: (Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days later
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const orders = await Order.find({ user: _id });
    res.json(orders);
});

// @desc    Update shipping address for the latest order
// @route   PUT /api/orders/update-address
// @access  Private
const updateShippingAddress = asyncHandler(async (req, res) => {
    const { address, city, postalCode, country } = req.body;

    const latestOrder = await Order.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!latestOrder) {
        res.status(404);
        throw new Error("No orders found for this user");
    }

    latestOrder.shippingAddress = { address, city, postalCode, country };
    const updatedOrder = await latestOrder.save();

    res.json(updatedOrder);
});

const getOrders = asyncHandler(async (req, res) => {
    try {
        console.log("Req params:",req.params);
        const _id = req.params.id;
        const user_id = req.params.user_id;
        console.log(_id, user_id)
        const orders = await Order.find({ _id: _id, user: user_id });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
})
const getOrdersAdmin = asyncHandler(async (req, res) => {
    try {
        console.log("Req params:",req.params);
        const _id = req.params.id;
        const user_id = req.params.user_id;
        console.log(_id, user_id)
        const orders = await Order.find({});
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
})


export { createOrder, getMyOrders, updateShippingAddress, getOrders,getOrdersAdmin };