const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../Models/Product'); // Product model
const ProductImage = require('../Models/ProductImage');
const ProductSize = require('../Models/ProductSize');
const Counter = require('../Models/Counter'); // Counter model

// GET request
router.get('/', async (req, res) => {
    try {
        const { product_id, limit } = req.query;
        let products;

        if (product_id) {
            products = await Product.find({ product_id });
        } else if (limit) {
            products = await Product.find().limit(parseInt(limit));
        } else {
            products = await Product.find();
        }

        // If products were found, fetch the images and sizes for each product
        if (products.length > 0) {
            const productsWithImagesAndSizes = await Promise.all(products.map(async product => {
                const images = await ProductImage.find({ product_id: product.product_id });
                const sizes = await ProductSize.find({ product_id: product.product_id });
                const image_url = images.map(image => image.image_url);
                return { ...product._doc, image_url, sizes };
            }));

            res.json(productsWithImagesAndSizes);
        } else {
            res.json({ message: "No products found" });
        }
    } catch (e) {
        res.status(500).json({ message: `GET request failed: ${e.message}` });
    }
});


// POST request
router.post('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { title, price, description, shipping_cost, is_deleted, sizes } = req.body;
        let { image_url } = req.body;
        // Check for required fields
        if (!title || !price || !description || !shipping_cost || !image_url || !sizes) {
            return res.status(400).json({ message: 'Missing required field' });
        }

        // Get the next product_id
        const counter = await Counter.findOneAndUpdate({ _id: 'product_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const product_id = counter.seq;

        const product = new Product({ product_id, title, price, description, shipping_cost, is_deleted });
        const savedProduct = await product.save();

        // Save images to ProductImage collection
        for (let url of image_url) {
            const productImage = new ProductImage({ product_id, image_url: url });
            await productImage.save();
        }

        // Save sizes to ProductSize collection
        for (let size of sizes) {
            const productSize = new ProductSize({ product_id, ...size });
            await productSize.save();
        }

        await session.commitTransaction();
        res.json({ message: "Product created", product: savedProduct });
    } catch (e) {
        await session.abortTransaction();
        res.status(500).json({ message: `POST request failed: ${e.message}` });
    } finally {
        session.endSession();
    }
});

// PUT request
router.put('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { title, price, description, sizes } = req.body;
        const { product_id } = req.query;
        let { image_url } = req.body;

        // Check for required fields
        if (!title || !price || !description || !image_url || !sizes || !product_id) {
            return res.status(400).json({ message: 'Missing required field' });
        }
        image_url = [image_url];

        const updatedProduct = await Product.findOneAndUpdate({ product_id: product_id }, { title, price, description, is_deleted: 0 }, { new: true });
        if (updatedProduct) {
            // Update images
            await ProductImage.deleteMany({ product_id: product_id });
            for (let url of image_url) {
                const productImage = new ProductImage({ product_id, image_url: url });
                await productImage.save();
            }

            // Update sizes
            await ProductSize.deleteMany({ product_id: product_id });
            for (let size of sizes) {
                const productSize = new ProductSize({ product_id, ...size });
                await productSize.save();
            }
            await session.commitTransaction();
            res.json({ message: "Product updated", product: updatedProduct });
        } else {
            await session.abortTransaction();
            res.status(404).json({ message: "Product not found." });
        }
    } catch (e) {
        await session.abortTransaction();
        res.status(500).json({ message: `PUT request failed: ${e.message}` });
    } finally {
        session.endSession();
    }
});

// DELETE request
router.delete('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { product_id } = req.query;

        if (!product_id) {
            return res.status(400).json({ message: 'Missing required field' });
        }


        const deletedProduct = await Product.findOneAndUpdate({ product_id: product_id }, { is_deleted: 1 }, { new: true });
        if (deletedProduct) {
            // Mark images and sizes as deleted
            await ProductImage.updateMany({ product_id: product_id }, { is_deleted: 1 });
            await ProductSize.updateMany({ product_id: product_id }, { is_deleted: 1 });

            // Decrement product counter
            await Counter.findOneAndUpdate({ _id: 'product_id' }, { $inc: { seq: -1 } });
            await session.commitTransaction();
            res.json({ message: "Product marked as deleted", product: deletedProduct });
        } else {
            await session.abortTransaction();
            res.status(404).json({ message: "Product not found." });
        }
    } catch (e) {
        await session.abortTransaction();
        res.status(500).json({ message: `DELETE request failed: ${e.message}` });
    } finally {
        session.endSession();
    }
});

module.exports = router;