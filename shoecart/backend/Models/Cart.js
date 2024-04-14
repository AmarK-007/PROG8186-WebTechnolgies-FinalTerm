const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema({
    cart_id: {
        type: Number,
        required: true,
        unique: true
    },
    user_id: Number,
    product_id: Number,
    size: Number,
    quantity: Number
});

module.exports = mongoose.model('Cart', CartSchema);