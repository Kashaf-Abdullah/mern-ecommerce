const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const ctrl = require('../controllers/controllers');

// CART
const cartRouter = express.Router();
cartRouter.use(protect);
cartRouter.get('/', ctrl.getCart);
cartRouter.post('/add', ctrl.addToCart);
cartRouter.put('/items/:itemId', ctrl.updateCartItem);
cartRouter.delete('/items/:productId', ctrl.removeFromCart);
cartRouter.delete('/clear', ctrl.clearCart);

// WISHLIST
const wishlistRouter = express.Router();
wishlistRouter.use(protect);
wishlistRouter.get('/', ctrl.getWishlist);
wishlistRouter.post('/toggle', ctrl.toggleWishlist);

// REVIEWS
const reviewRouter = express.Router();
reviewRouter.get('/product/:productId', ctrl.getProductReviews);
reviewRouter.post('/', protect, ctrl.createReview);
reviewRouter.delete('/:id', protect, ctrl.deleteReview);

// COUPONS
const couponRouter = express.Router();
couponRouter.post('/validate', optionalAuth, ctrl.validateCoupon);
couponRouter.get('/', protect, authorize('admin'), ctrl.getCoupons);
couponRouter.post('/', protect, authorize('admin'), ctrl.createCoupon);
couponRouter.put('/:id', protect, authorize('admin'), ctrl.updateCoupon);
couponRouter.delete('/:id', protect, authorize('admin'), ctrl.deleteCoupon);

// USER PROFILE
const userRouter = express.Router();
userRouter.use(protect);
userRouter.put('/profile', ctrl.updateProfile);
userRouter.post('/addresses', ctrl.addAddress);
userRouter.put('/addresses/:addressId', ctrl.updateAddress);
userRouter.delete('/addresses/:addressId', ctrl.deleteAddress);
userRouter.get('/notifications', ctrl.getMyNotifications);
userRouter.get('/notifications/:id', ctrl.getMyNotification);

// CATEGORIES
const categoryRouter = express.Router();
categoryRouter.get('/', ctrl.getCategories);
categoryRouter.post('/', protect, authorize('admin'), ctrl.createCategory);
categoryRouter.put('/:id', protect, authorize('admin'), ctrl.updateCategory);
categoryRouter.delete('/:id', protect, authorize('admin'), ctrl.deleteCategory);

// ADMIN
const adminRouter = express.Router();
adminRouter.use(protect, authorize('admin'));
adminRouter.get('/dashboard', ctrl.getDashboard);
adminRouter.get('/users', ctrl.getAllUsers);
adminRouter.put('/users/:id/toggle-block', ctrl.toggleUserBlock);
adminRouter.get('/notifications', ctrl.getNotifications);
adminRouter.post('/notifications', ctrl.createNotification);
adminRouter.get('/wishlist-activity', ctrl.getWishlistActivity);

// UPLOAD
const { upload, uploadAvatar, uploadLogo } = require('../config/cloudinary');
const uploadRouter = express.Router();
uploadRouter.post('/product', protect, authorize('admin'), upload.array('images', 10), (req, res) => {
  const files = req.files.map(f => ({ public_id: f.filename, url: f.path }));
  res.json({ success: true, files });
});
uploadRouter.post('/avatar', protect, uploadAvatar.single('avatar'), async (req, res) => {
  const User = require('../models/User');
  const { cloudinary } = require('../config/cloudinary');
  const user = await User.findById(req.user.id);
  if (user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }
  user.avatar = { public_id: req.file.filename, url: req.file.path };
  await user.save();
  res.json({ success: true, avatar: user.avatar });
});
// Turns multer/Cloudinary failures into clear 4xx messages instead of a generic 500
const handleLogoUpload = (req, res, next) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'Image storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET on the server.',
    });
  }
  uploadLogo.single('logo')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Logo is too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ success: false, message: 'Unexpected file field. Send the image as "logo".' });
    }
    const status = err.http_code >= 400 && err.http_code < 500 ? err.http_code : (err.message || '').startsWith('Logo must be') ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message || 'Logo upload failed' });
  });
};

uploadRouter.post('/logo', protect, authorize('admin'), handleLogoUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No logo file uploaded' });
  }
  const logoData = { public_id: req.file.filename, url: req.file.path };
  res.json({ success: true, logo: logoData });
});

// PAYMENT
const paymentCtrl = require('../controllers/paymentController');
const paymentRouter = express.Router();
paymentRouter.post('/stripe/create-intent', protect, paymentCtrl.createStripeIntent);
paymentRouter.post('/stripe/confirm', protect, paymentCtrl.confirmStripePayment);
paymentRouter.post('/stripe/webhook', paymentCtrl.stripeWebhook);
paymentRouter.post('/razorpay/create-order', protect, paymentCtrl.createRazorpayOrder);
paymentRouter.post('/razorpay/verify', protect, paymentCtrl.verifyRazorpayPayment);

module.exports = { cartRouter, wishlistRouter, reviewRouter, couponRouter, userRouter, categoryRouter, adminRouter, uploadRouter, paymentRouter };
