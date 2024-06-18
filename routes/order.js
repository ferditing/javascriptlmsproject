const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

router.post('/', auth, async (req, res) => {
    const { products, total } = req.body;
    try {
        const order = new Order({
            userId: req.user.userId,
            products,
            total
        });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error placing order', error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
