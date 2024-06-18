const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: String,
        productName: String,
        quantity: Number,
        price: Number,
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
