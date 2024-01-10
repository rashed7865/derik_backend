const express = require('express');
const { isAdmin, AuthenticatorJWT } = require('../middlewares/authenticator');
const { getAllOrdersByUserId, deleteOrder, getAllOrders, placeOrder, setOrderStatus, getAllOrderById, getAllSellerOrders,removeOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/place-order', AuthenticatorJWT, placeOrder);
router.get('/:id', AuthenticatorJWT, getAllOrdersByUserId);
router.get('/get/order/:id', AuthenticatorJWT, getAllOrderById);
router.post('/set/status', AuthenticatorJWT, isAdmin, setOrderStatus);
router.get('/seller/all-orders', AuthenticatorJWT, getAllSellerOrders);
router.get('/admin/all-orders', AuthenticatorJWT, isAdmin, getAllOrders);
router.delete('/order/delete/:id', AuthenticatorJWT, deleteOrder);
router.delete('/order/remove/:id', AuthenticatorJWT, removeOrder);


module.exports = router;