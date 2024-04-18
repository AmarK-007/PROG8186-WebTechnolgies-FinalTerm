const mongoose = require('mongoose');

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
  order_details:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetail' }]
});

module.exports = mongoose.model('Order', OrderSchema);