const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    menuId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Menu' },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
},{timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order
