const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

app.use(session({
    secret: 'a3cJ9#sD2$Fg5@1Kl8&7Zn6%Qx4',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Note: secure should be true in production
}));


mongoose.connect('mongodb+srv://amark7:Amar_21288@clusternew.2n7ybay.mongodb.net/shoecart?retryWrites=true&w=majority&appName=Clusternew')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Import Models
const User = require('./Models/User');
const Product = require('./Models/Product');
const Order = require('./Models/Order');
const Comment = require('./Models/Comment');
const Cart = require('./Models/Cart');

// Routes
app.use('/users', require('./Routes/UserRoutes'));
app.use('/products', require('./Routes/ProductRoutes'));
app.use('/orders', require('./Routes/OrderRoutes'));
app.use('/comments', require('./Routes/CommentRoutes'));
app.use('/carts', require('./Routes/CartRoutes'));

app.listen(5000, () => console.log('Server started on port 5000'));