const mongoose = require('mongoose');

const ProductSizeSchema = new mongoose.Schema({
  size_us: Number,
  quantity: Number
});

const ProductImageSchema = new mongoose.Schema([String]);

const ProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  description: String,
  price: Number,
  image_url: [ProductImageSchema],
  sizes: [ProductSizeSchema]
});

module.exports = mongoose.model('Product', ProductSchema);