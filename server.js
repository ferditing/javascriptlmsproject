const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middleware for checking JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !await user.comparePassword(password)) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Create order (client endpoint)
app.post('/api/orders', authenticateToken, async (req, res) => {
    const { items, totalAmount } = req.body;
    try {
        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
        });
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// View all orders (admin endpoint)
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'username');
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// View user's orders (client endpoint)
app.get('/api/my-orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
