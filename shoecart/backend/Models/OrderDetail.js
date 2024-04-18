const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
    order_id: Number,
    product_id: Number,
    quantity: Number,
    product_size: String
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);