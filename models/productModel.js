const mongoonse = require('mongoose');

const productShema = new mongoonse.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    price: {
        type: String,
        required: [true, "Price is required"],
    },
    seller: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'User',
        // required: [true, "Seller is required"],
    },
    qty: {
        type: String,
        default: "0",
        required: [true, "Qty is required"],
    },
    productPicture: {
        type: Array,
        // required: [true, "Product Picture is required"],
    },
    category: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Category is required"],
    },
    sizes: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const productModel = new mongoonse.model('Product', productShema);
module.exports = productModel;