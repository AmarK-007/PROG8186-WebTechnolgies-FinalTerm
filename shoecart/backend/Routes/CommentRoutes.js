const express = require('express');
const router = express.Router();
const Comment = require('../Models/Comment'); // Comment model
const Counter = require('../Models/Counter'); // Counter model

router.get('/', async (req, res) => {
    try {
        const product_id = req.query.product_id;
        const limit = req.query.limit;
        if (!product_id) {
            return res.status(400).json({ message: "Product ID is missing." });
        }
        const comments = await Comment.find({ product_id: product_id }).limit(limit);
        if (comments.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { product_id, user_id, comment } = req.body;

        // Check if all required fields are provided
        if (!product_id || !user_id || !comment || !req.body.rating || !req.body.image_url) {
            return res.status(400).json({ message: 'Unable to create comment. Data is incomplete.' });
        }

        // Get the next comment_id
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'commentId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newComment = new Comment({
            comment_id: counter.seq,
            product_id,
            user_id,
            rating: req.body.rating,
            image_url: req.body.image_url,
            comment
        });

        await newComment.save();
        res.status(200).json({ message: "Comment created.", newComment });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/', async (req, res) => {
    const { user_id, product_id, rating, image_url, comment, comment_id } = req.body;

    // Check if all required fields are provided
    if (!user_id || !product_id || !rating || !comment) {
        return res.status(400).json({ message: 'Missing required field.' });
    }

    try {
        let commentToUpdate;

        if (comment_id) {
            commentToUpdate = await Comment.findOne({ comment_id: comment_id });
        } else {
            commentToUpdate = await Comment.findOne({ user_id, product_id });
        }

        if (!commentToUpdate) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        commentToUpdate.rating = rating;
        commentToUpdate.image_url = image_url;
        commentToUpdate.comment = comment;

        const updatedComment = await commentToUpdate.save();
        res.json({ message: "Comment updated.", updatedComment });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const comment_id = req.query.comment_id;
        const product_id = req.query.product_id;
        const user_id = req.query.user_id;
        let query = {};

        if (comment_id) {
            query.comment_id = comment_id;
        } else if (product_id && user_id) {
            query.product_id = product_id;
            query.user_id = user_id;
        } else {
            return res.status(400).json({ message: 'Comment ID or User ID and Product ID are missing.' });
        }

        const result = await Comment.deleteMany(query);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.json({ message: 'Comments deleted', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getComment(req, res, next) {
    let comment;
    try {
        comment = await Comment.findById(req.params.id);
        if (comment == null) {
            return res.status(404).json({ message: 'Cannot find comment' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.comment = comment;
    next();
}

module.exports = router;