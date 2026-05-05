const express = require('express');
const { protect, authorize } = require('../middleware/auth');
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
couponRouter.post('/validate', protect, ctrl.validateCoupon);
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

// UPLOAD
const { upload, uploadAvatar } = require('../config/cloudinary');
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
uploadRouter.post('/logo', protect, authorize('admin'), upload.single('logo'), async (req, res) => {
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
