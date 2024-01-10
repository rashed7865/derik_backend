const express = require('express');
const { getProduct, addToCart, updateQuantity, removeProduct, getProducts, emptyCart } = require('../controllers/cartControllers');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/get', AuthenticatorJWT, getProducts);
router.get('/get-product', getProduct);
router.post('/add-to-cart', AuthenticatorJWT, addToCart);
router.put('/update/qty/:id', AuthenticatorJWT, updateQuantity);
router.delete('/delete/:id', AuthenticatorJWT, removeProduct);
router.delete('/empty', AuthenticatorJWT, emptyCart);


module.exports = router;