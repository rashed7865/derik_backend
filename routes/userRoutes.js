const express = require('express');
const { AuthenticatorJWT, isAdmin } = require('../middlewares/authenticator');
const { getAllUsers, getUserById, changePassword, resetPasswordLink, updatePassword, SignUp, Login, addUserByAdmin, deleteUser, updateUser, getAllSellers, updateUserByAdmin,forgetPassword,resetPassword } = require('../controllers/userController');

const router = express.Router();

router.get('/get', AuthenticatorJWT, isAdmin, getAllUsers);
router.get('/sellers', AuthenticatorJWT, getAllSellers);
router.get('/get/:id', getUserById);
router.post('/signup', SignUp);
router.post('/admin/add-user', addUserByAdmin);
router.post('/login', Login);
router.put('/update', AuthenticatorJWT, updateUser);
router.put('/admin/update/:id', AuthenticatorJWT, isAdmin, updateUserByAdmin);
router.post('/change/password', AuthenticatorJWT, changePassword);

router.post('/send/forgot-email', resetPasswordLink);
router.post('/update/password', updatePassword);

router.post('/forget-password', forgetPassword);
router.post('/reset-password/:id/:token', resetPassword);

router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteUser);

module.exports = router;