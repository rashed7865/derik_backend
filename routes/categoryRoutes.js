const express = require('express');
const { AuthenticatorJWT, isAdmin } = require('../middlewares/authenticator');
const { getAllCategories, createMainCategory, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.get('/get', getAllCategories);
router.get('/get/:id', getCategoryById);
router.post('/create', AuthenticatorJWT, isAdmin, createMainCategory);
router.put('/update/:id', AuthenticatorJWT, isAdmin, updateCategory);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteCategory);


module.exports = router;