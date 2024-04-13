const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
  order_detail_id: {
    type: Number,
    required: true,
    unique: true
  },
  product_id: Number,
  quantity: Number,
  product_size: String
});

const OrderSchema = new mongoose.Schema({
  order_id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: Number,
  total_amount: Number,
  order_date: Date,
  payment_method: String,
  delivery_status: String,
  return_status: String,
  order_details: [OrderDetailSchema]
});

module.exports = mongoose.model('Order', OrderSchema);