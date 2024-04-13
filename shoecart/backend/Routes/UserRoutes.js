const express = require('express');
const session = require('express-session');
const router = express.Router();
const User = require('../Models/User'); // User model
const Counter = require('../Models/Counter'); // Counter model

const app = express();

app.use(session({
  secret: 'a3cJ9#sD2$Fg5@1Kl8&7Zn6%Qx4',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Note: secure should be true in production
}));


// GET request
router.get('/', async (req, res) => {
  const { id, username, limit } = req.query;
  let query = {};

  if (id) query.user_id = id;
  if (username) query.username = username;

  try {
    const users = await User.find(query).limit(parseInt(limit));
    if (!users.length) return res.status(404).json({ message: 'No user found' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST request
router.post('/', async (req, res) => {
  const { name, email, password, username, purchase_history, shipping_address } = req.body;

  try {
    // Check for required fields
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: 'Missing required field' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'Email or username already exists' });

    // Get the next user_id
    const counter = await Counter.findOneAndUpdate({ _id: 'user_id' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    const user_id = counter.seq;

    const user = new User({ user_id, name, email, password, username, purchase_history, shipping_address });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT request
router.put('/', async (req, res) => {
  const { id, username } = req.query;
  const { name, password, purchase_history, shipping_address } = req.body;

  try {
    // Check for required fields
    if (!name || !password) {
      return res.status(400).json({ message: 'Missing required field' });
    }

    const user = await User.findOne({ $or: [{ user_id: id }, { username }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name;
    user.password = password; // you should hash the password before storing it
    user.purchase_history = purchase_history;
    user.shipping_address = shipping_address;
    await user.save();

    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE request
router.delete('/', async (req, res) => {
  const { id, username } = req.query;

  try {
    const user = await User.findOne({ $or: [{ user_id: id }, { username }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: false, message: 'Please enter username and password.' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user || password !== user.password) {
      return res.status(400).json({ status: false, message: 'Invalid username or password.' });
    }

    req.session.loggedin = true; // Set the session

    res.json({ status: true, message: 'Successfully Login!', user_id: user.id, username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, message: 'Oops! Something went wrong. Please try again later.' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  if (!req.session.loggedin) {
    return res.json({ status: false, message: 'No active session found. Please login first.' });
  }

  req.session.destroy(); // Destroy the session

  res.json({ status: true, message: 'Successfully Logout!' });
});

module.exports = router;
