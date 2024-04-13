const express = require('express');
const router = express.Router();
const Order = require('../Models/Order'); // Order model
const Counter = require('../Models/Counter'); // Counter model

router.get('/', async (req, res) => {
    try {
        const { order_id, limit } = req.query;
        let orders;
        if (order_id) {
            orders = await Order.find({ order_id: order_id });
        } else if (limit) {
            orders = await Order.find().limit(parseInt(limit));
        } else {
            orders = await Order.find();
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { orderdetails, order_id, user_id, ...orderData } = req.body;

    if (!order_id || !user_id) {
        return res.status(400).json({ message: "Missing required field" });
    }

    // Get the next order_id
    const counter = await Counter.findOneAndUpdate({ _id: 'order_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });

    const order = new Order({ ...orderData, order_id, user_id });
    if (orderdetails) {
        order.orderdetails = [];
        for (let i = 0; i < orderdetails.length; i++) {
            order.orderdetails.push(orderdetails[i]);
        }
    }

    try {
        const newOrder = await order.save();
        res.status(201).json({ message: "Order created", newOrder });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/', getOrder, async (req, res) => {
    const { orderdetails, user_id, ...orderData } = req.body;
    const { order_id } = req.query;

    if (!order_id || !user_id) {
        return res.status(400).json({ message: "Missing required field" });
    }

    Object.assign(res.order, orderData, { order_id, user_id });
    if (orderdetails) {
        res.order.orderdetails = [];
        for (let i = 0; i < orderdetails.length; i++) {
            res.order.orderdetails.push(orderdetails[i]);
        }
    }

    try {
        const updatedOrder = await res.order.save();
        res.json({ message: "Order updated", updatedOrder });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/', getOrder, async (req, res) => {
    if (res.order) {
        try {
            await Order.deleteOne({ order_id: res.order.order_id });
            res.json({ message: 'Order deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

async function getOrder(req, res, next) {
    let order;
    try {
        const { order_id } = req.query;
        if (!order_id) {
            return res.status(400).json({ message: "Missing required field" });
        }
        order = await Order.findOne({ order_id: order_id });
        if (order == null) {
            return res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.order = order;
    next();
}

module.exports = router;