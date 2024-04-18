const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../Models/Order'); // Order model
const OrderDetail = require('../Models/OrderDetail'); // OrderDetail model
const Counter = require('../Models/Counter'); // Counter model

router.get('/', async (req, res) => {
    try {
        const { order_id, limit, user_id } = req.query;
        let orders;
        if (order_id) {
            orders = await Order.find({ order_id: order_id }).populate('order_details');
        } else if (user_id) {
            orders = await Order.find({ user_id: user_id }).populate('order_details');
        } else if (limit) {
            orders = await Order.find().limit(parseInt(limit)).populate('order_details');
        } else {
            orders = await Order.find().populate('order_details');
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { orderdetails, user_id, ...orderData } = req.body;

        if (!user_id) {
            throw new Error("Missing required field");
        }

        // Get the next order_id
        const counter = await Counter.findOneAndUpdate({ _id: 'order_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true, session });

        let orderDetailIds = [];
        if (orderdetails) {
            let orderDetailPromises = orderdetails.map(async (orderdetail) => {
                const orderDetail = new OrderDetail({ ...orderdetail, order_id: counter.seq });
                // console.log('Order Detail:', orderDetail);
                await orderDetail.save({ session });
                return orderDetail._id;
            });

            orderDetailIds = await Promise.all(orderDetailPromises);
        }
        const order = new Order({ ...orderData, order_id: counter.seq, user_id, order_details: orderDetailIds });
        // console.log('Order :', order);
        const newOrder = await order.save({ session });
        await session.commitTransaction();
        res.status(201).json({ message: "Order created", newOrder });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

router.put('/', getOrder, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { orderdetails, user_id, ...orderData } = req.body;
        const { order_id } = req.query;

        if (!order_id || !user_id) {
            throw new Error("Missing required field");
        }

        Object.assign(res.order, orderData, { order_id, user_id });
        if (orderdetails) {
            let orderDetailPromises = orderdetails.map(async (orderdetail) => {
                const orderDetail = new OrderDetail({ ...orderdetail, order_id: res.order.order_id });
                await orderDetail.save({ session });
                return orderDetail._id;
            });

            res.order.order_details = await Promise.all(orderDetailPromises);
        }

        const updatedOrder = await res.order.save({ session });
        await session.commitTransaction();
        res.json({ message: "Order updated", updatedOrder });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

router.delete('/', getOrder, async (req, res) => {
    if (res.order) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await OrderDetail.deleteMany({ _id: { $in: res.order.order_details } });
            await Order.deleteOne({ order_id: res.order.order_id });
            await Counter.findOneAndUpdate({ _id: 'order_id' }, { $inc: { seq: -1 } });
            await session.commitTransaction();
            res.json({ message: 'Order deleted' });
        } catch (err) {
            await session.abortTransaction();
            res.status(500).json({ message: err.message });
        } finally {
            session.endSession();
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
