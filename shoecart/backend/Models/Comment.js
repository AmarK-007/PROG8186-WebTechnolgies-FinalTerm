const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  comment_id: {
    type: Number,
    required: true,
    unique: true
  },
  product_id: Number,
  user_id: Number,
  rating: Number,
  image_url: String,
  comment: String
});

module.exports = mongoose.model('Comment', CommentSchema);