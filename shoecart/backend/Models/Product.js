// models/product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  description: String,
  price: Number,
  shipping_cost: Number, 
  isDeleted: Number
});

module.exports = mongoose.model('Product', ProductSchema);