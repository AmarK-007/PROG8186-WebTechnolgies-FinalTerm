// models/ProductSize.js
const mongoose = require('mongoose');

const ProductSizeSchema = new mongoose.Schema({
  product_id: Number,
  size_us: Number,
  quantity: Number
});

module.exports = mongoose.model('ProductSize', ProductSizeSchema);