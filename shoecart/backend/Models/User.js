const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  purchase_history: {
    type: [Number], // purchase_history is an array of order_id
    default: []
  },
  shipping_address: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);