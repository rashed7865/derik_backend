const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:
    {
        type: Array,
        default: []
    }
}, { timestamps: true }
);

const cartModel = new mongoose.model('cart', cartSchema);

module.exports = cartModel;