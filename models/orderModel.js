const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: Object,
        default: {}
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data: {
        type: Object,
        default: {}
    },
    products: {
        type: Array,
    },
    status: {
        type: String,
        default: "1"
    },
    discount: {
        type: String,
        default: ''
    },
    subTotal: {
        type: String,
        default: ''
    },
    totalPrice: {
        type: String,
        default: ''
    },
    placed: {
        type: String,
        default: ''
    },
    statusUpdateTime: {
        type: String,
        default: "---"
    }
}, { timestamps: true }
);

const orderModel = new mongoose.model('Order', orderSchema);
module.exports = orderModel;
