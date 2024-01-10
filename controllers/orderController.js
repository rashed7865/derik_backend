const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Template = require('../email-template');
const sendEmail = require('../nodemailer');
const config = require('../config/keys');

exports.getAllOrders = async (req, res) => {
    const orders = await Order.find().populate("seller");
    console.log("orders");
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.getAllSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user._id }).populate("seller");
        if (orders) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ errorMessage: 'No orders Found' });
        }
    } catch (error) {
        res.status(404).json({ errorMessage: 'Error in finding orders' });
    }

}


exports.getAllOrdersByUserId = async (req, res) => {
    const orders = await Order.find({ userId: req.params.id });
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.getAllOrderById = async (req, res) => {
    const orders = await Order.findOne({ _id: req.params.id });
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.placeOrderCOD = async (req, res) => {
    await req.body.cartProducts.forEach(async (item) => {
        const order = new Order({
            userId: req.user._id,
            product: {
                name: item.title,
                image: item.image,
                productId: item.productId,
                price: item.price,
                qty: item.qty
            },
            user: {
                name: req.body.name,
                email: req.body.email
            },
            placed: req.body.placed,

        });
        await order.save(async (err, result) => {
            if (err) { console.log('Payment Failed') }
            if (result) {
                const findProduct = await Product.findOne({ _id: item.productId });
                if (findProduct) {
                    findProduct.qty = findProduct.qty - item.qty;
                    findProduct.save((error, data) => {
                        if (error) {
                            console.log(error)
                        } else {
                            sendEmail(req.body.email, "Your order is placed!", Template({ orderId: result._id, name: req.body.name }))
                            User.findOne({ _id: req.user._id }).then(user => {
                                if (!user) { res.status(404).json({ errorMessage: 'Email does not exist' }); }
                                if (user) {
                                    user.points = parseInt(req.body.totalPrice) + parseInt(user.points) * 2;
                                    user.save();
                                }
                            });
                        }
                    })
                }
            } else {
                console.log('error');
            }
        })
    })
    res.status(200).json({ successMessage: 'Successfully Purchased Items!' });
}

exports.placeOrder = async (req, res) => {
    // Group cart products by seller
    const productsBySeller = {};
    req.body.cartProducts.forEach((product) => {
        const seller = product.seller?._id;
        if (!productsBySeller[seller]) {
            productsBySeller[seller] = [];
        }
        productsBySeller[seller].push(product);
    });

    const orders = [];

    // Create separate orders for each seller
    for (const seller in productsBySeller) {
        const products = productsBySeller[seller];
        const order = new Order({
            userId: req.user._id,
            products: productsBySeller[seller],
            user: {
                name: req.body.name,
                email: req.body.email
            },
            data: req.body.paymentData,
            seller: seller, // Set the seller for this order
            subTotal: req.body.subTotal, // Adjust subtotal calculation if needed
            totalPrice: req.body.totalPrice, // Adjust total price calculation if needed
            placed: req.body.placed,
        });
        for (const product of products) {
            const productData = await Product.findById(product.productId);
            if (productData) {
                productData.qty -= product.qty;
                await productData.save();
            }
        }
        try {
            const result = await order.save();
            orders.push(result);
            const user = await User.findOne({ _id: seller });
            let link = `${config.FRONTEND_LINK}/orders`
            sendEmail(user.email, "You have got an order", Template({ orderId: result._id, name: req.body.name, link }));
            sendEmail(req.body.email, "Your order is placed!", Template({ orderId: result._id, name: req.body.name, link }));
        } catch (err) {
            console.error('Error placing order:', err);
        }
    }

    if (orders.length > 0) {
        res.status(200).json({ successMessage: 'Successfully Purchased Items!' });
    } else {
        res.status(500).json({ errorMessage: 'Failed to place orders.' });
    }
}




exports.paymentController = async (req, res) => {
    const { token } = req.body;
    stripe.charges.create({
        description: 'Buying Dêrik-online-shop Product',
        source: token.id,
        currency: 'USD',
        amount: parseInt(10 * 100),
        receipt_email: token.email
    })
        .then(result => {
            User.findOne({ _id: req.user._id }).exec((error, user) => {
                if (error) {
                    res.status.json({ errorMessage: 'User not found' });
                }
                if (user) {
                    user.save();
                    res.status(200).json({ successMessage: 'Paid Successfully!', result });
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({ errorMessage: 'Payment failed. Try again!', err });
        });
}

exports.setOrderStatus = async (req, res) => {
    let getStatus = req.body.status == '2' ?
        `Confirmed`
        :
        req.body.status == '3' ?
            `Prepared`
            :
            req.body.status == '4' ?
                `Out for delivery`
                :
                req.body.status == '5' ?
                    `Complete`
                    :
                    null;
    const order = await Order.findOne({ _id: req.body.orderId });
    if (order) {
        order.status = req.body.status
        order.statusUpdateTime = req.body.updateTime
        order.save(async (error, result) => {
            if (error) res.status(400).json({ errorMessage: 'Status update failed!' });
            if (result) {
                await sendEmail(result.user.email, "You've got order updates!", Template({ orderId: result._id, name: result.user.name, orderStatus: getStatus }))
                res.status(200).json({ successMessage: 'Order status updated successfully!' });
            }
        })
    } else {
        res.status(404).json({ errorMessage: 'No order found!' });
    }
}

exports.deleteOrder = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id }).exec();
    if (order) {
        order.status = "0";
        order.save(async (err, result) => {
            if (result) {
                await sendEmail(result.user.email, "Your is cancelled", Template({ orderId: result._id, name: result.user.name, orderStatus: "Cancelled" }))
                res.status(200).json({ successMessage: 'Order Cancelled Successfully' });
            } else {
                console.log('Failed order cancellation');
            }
        })
    } else {
        res.status(404).json({ errorMessage: 'No order found!' });
    }
}



exports.removeOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id }).exec();
        
        if (order) {
            const result = await Order.deleteOne({ _id: req.params.id }).exec();

            if (result.deletedCount > 0) {
                res.status(200).json({ successMessage: 'Order removed Successfully' });
            } else {
                console.log('Failed to remove order');
                res.status(500).json({ errorMessage: 'Failed to remove order' });
            }
        } else {
            res.status(404).json({ errorMessage: 'No order found!' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
};