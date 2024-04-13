// models/product.js
const mongoose = require('mongoose');

const ProductSizeSchema = new mongoose.Schema({
  size_us: Number,
  quantity: Number
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  description: String,
  price: Number,
  isDeleted: Number,
  shippingCost: mongoose.Schema.Types.Decimal128,
  sizes: [ProductSizeSchema]
});

module.exports = mongoose.model('Product', ProductSchema);
