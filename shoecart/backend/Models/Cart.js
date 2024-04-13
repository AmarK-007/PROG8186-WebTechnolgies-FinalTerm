const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  cart_id: {
    type: Number,
    required: true,
    unique: true
  },
  product_id: Number,
  quantity: Number,
  user_id: Number
});

module.exports = mongoose.model('Cart', CartSchema);