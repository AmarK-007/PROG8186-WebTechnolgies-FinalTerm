// models/productImage.js
const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
  product_id: Number,
  image_id: String,
  image_url: String
});

module.exports = mongoose.model('ProductImage', ProductImageSchema);