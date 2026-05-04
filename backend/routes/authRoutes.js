// ==================== authRoutes.js ====================
const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, forgotPassword, resetPassword, verifyEmail, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.put('/update-password', protect, updatePassword);

module.exports = router;
