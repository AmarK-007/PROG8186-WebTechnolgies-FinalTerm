const express = require('express');
const router = express.Router();
const Product = require('../Models/Product'); // Product model
const ProductImage = require('../Models/ProductImage');
const Counter = require('../Models/Counter'); // Counter model

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

        // If products were found, fetch the images for each product
        if (products.length > 0) {
            const productsWithImages = await Promise.all(products.map(async product => {
                const images = await ProductImage.find({ product_id: product.product_id });
                const image_url = images.map(image => image.image_url);
                return { ...product._doc, image_url };
            }));

            res.json(productsWithImages);
        } else {
            res.json({ message: "No products found" });
        }
    } catch (e) {
        res.status(500).json({ message: `GET request failed: ${e.message}` });
    }
});


// POST request
router.post('/', async (req, res) => {
    const { title, price, description, sizes } = req.body;
    let { image_url } = req.body;
    // Check for required fields
    if (!title || !price || !description || !image_url || !sizes) {
        return res.status(400).json({ message: 'Missing required field' });
    }
    image_url = [image_url];
    try {
        // Get the next product_id
        const counter = await Counter.findOneAndUpdate({ _id: 'product_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const product_id = counter.seq;

        const product = new Product({ product_id, title, price, description, image_url, sizes, is_deleted: 0 });
        const savedProduct = await product.save();
        res.json({ message: "Product created", product: savedProduct });
    } catch (e) {
        res.status(500).json({ message: `POST request failed: ${e.message}` });
    }
});

// PUT request
router.put('/', async (req, res) => {
    const { title, price, description, sizes } = req.body;
    const { product_id } = req.query;
    let { image_url } = req.body;

    // Check for required fields
    if (!title || !price || !description || !image_url || !sizes || !product_id) {
        return res.status(400).json({ message: 'Missing required field' });
    }
    image_url = [image_url];
    try {
        const updatedProduct = await Product.findOneAndUpdate({ product_id: product_id }, { title, price, description, image_url, sizes, is_deleted: 0 }, { new: true });
        if (updatedProduct) {
            res.json({ message: "Product updated", product: updatedProduct });
        } else {
            res.status(404).json({ message: "Product not found." });
        }
    } catch (e) {
        res.status(500).json({ message: `PUT request failed: ${e.message}` });
    }
});

router.delete('/', async (req, res) => {
    const { product_id } = req.query;

    if (!product_id) {
        return res.status(400).json({ message: 'Missing required field' });
    }

    try {
        const deletedProduct = await Product.findOneAndUpdate({ product_id: product_id }, { is_deleted: 1 }, { new: true });
        if (deletedProduct) {
            res.json({ message: "Product marked as deleted", product: deletedProduct });
        } else {
            res.status(404).json({ message: "Product not found." });
        }
    } catch (e) {
        res.status(500).json({ message: `DELETE request failed: ${e.message}` });
    }
});

module.exports = router;