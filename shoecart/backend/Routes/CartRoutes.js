const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart'); // Cart model
const Counter = require('../Models/Counter'); // Counter model

router.get('/', async (req, res) => {
    try {
        const { user_id, cart_id } = req.query;
        if (!user_id && !cart_id) {
            return res.status(400).json({ message: "User ID or Cart ID is missing." });
        }
        const query = {};
        if (user_id) query.user_id = user_id;
        if (cart_id) query.cart_id = cart_id;
        const carts = await Cart.find(query);
        if (carts.length === 0) {
            return res.status(404).json({ message: "No cart items found for this user." });
        }
        res.json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    // Check if all required fields are provided
    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ message: 'Unable to create cart. Data is incomplete.' });
    }

    // Get the next cart_id
    const counter = await Counter.findByIdAndUpdate(
        { _id: 'cartId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const newCart = new Cart({
        cart_id: counter.seq,
        user_id,
        product_id,
        quantity
    });

    try {
        await newCart.save();
        res.status(201).json({ message: "Cart created.", newCart });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/', async (req, res) => {
    try {
        const { product_id, user_id, quantity, cart_id } = req.body;
        if (!user_id && !cart_id) {
            return res.status(400).json({ message: "User ID or Cart ID is missing." });
        }
        const query = {};
        if (user_id) query.user_id = user_id;
        if (cart_id) query.cart_id = cart_id;
        const updatedCart = await Cart.findOneAndUpdate(query, { product_id, user_id, quantity }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ message: "Cart item not found." });
        }
        res.json({ message: "Cart item updated." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const { user_id, cart_id } = req.query;
        if (!user_id && !cart_id) {
            return res.status(400).json({ message: "User ID or Cart ID is missing." });
        }
        const query = {};
        if (user_id) query.user_id = user_id;
        if (cart_id) query.cart_id = cart_id;
        const deletedCart = await Cart.findOneAndDelete(query);
        if (!deletedCart) {
            return res.status(404).json({ message: "Cart item not found." });
        }
        res.json({ message: "Cart item deleted." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
