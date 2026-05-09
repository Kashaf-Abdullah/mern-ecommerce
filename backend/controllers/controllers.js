const asyncHandler = require('express-async-handler');
const { Cart, Wishlist, Review, Coupon, Category } = require('../models/index');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// ==================== CART ====================

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name images price discountPrice stock isActive');
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  res.json({ success: true, cart });
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const existingItem = cart.items.find(item => item.product.toString() === productId);
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (newQty > product.stock) { res.status(400); throw new Error('Cannot add more than available stock'); }
    existingItem.quantity = newQty;
    existingItem.price = price;
  } else {
    cart.items.push({ product: productId, quantity, price });
  }

  await cart.save();
  await cart.populate('items.product', 'name images price discountPrice stock');
  res.json({ success: true, cart });
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  const item = cart.items.find(i => i._id.toString() === req.params.itemId);
  if (!item) { res.status(404); throw new Error('Item not found in cart'); }

  if (quantity <= 0) {
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  } else {
    const product = await Product.findById(item.product);
    if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name images price discountPrice stock');
  res.json({ success: true, cart });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate('items.product', 'name images price discountPrice stock');
  res.json({ success: true, cart });
});

exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], couponApplied: null, discountAmount: 0 });
  res.json({ success: true, message: 'Cart cleared' });
});

// ==================== WISHLIST ====================

exports.getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products', 'name images price discountPrice ratings stock isActive');
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  res.json({ success: true, wishlist });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user.id, products: [] });

  const index = wishlist.products.indexOf(productId);
  let action;
  if (index > -1) {
    wishlist.products.splice(index, 1);
    action = 'removed';
  } else {
    wishlist.products.push(productId);
    action = 'added';
  }
  await wishlist.save();
  res.json({ success: true, action, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist` });
});

// ==================== REVIEWS ====================

exports.getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: req.params.productId, isApproved: true })
  ]);

  res.json({ success: true, reviews, total, page, pages: Math.ceil(total / limit) });
});

exports.createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  // Check if already reviewed
  const existing = await Review.findOne({ product: productId, user: req.user.id });
  if (existing) { res.status(400); throw new Error('You have already reviewed this product'); }

  // Check if user has purchased
  const hasPurchased = await Order.findOne({
    user: req.user.id,
    'items.product': productId,
    orderStatus: 'delivered'
  });

  const review = await Review.create({
    product: productId,
    user: req.user.id,
    rating,
    title,
    comment,
    isApproved: true
  });

  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review, verifiedPurchase: !!hasPurchased });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
});

// ==================== COUPONS ====================

exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }

  const validity = coupon.isValid();
  if (!validity.valid) { res.status(400); throw new Error(validity.message); }

  if (orderAmount < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount of Rs.${coupon.minOrderAmount} required`);
  }

  if (coupon.usedBy.includes(req.user.id)) {
    res.status(400);
    throw new Error('You have already used this coupon');
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = Math.min(coupon.discountValue, orderAmount);
  }

  res.json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount } });
});

// ==================== USER PROFILE ====================

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, phone }, { new: true, runValidators: true });
  res.json({ success: true, user });
});

exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) { res.status(404); throw new Error('Address not found'); }
  if (req.body.isDefault) user.addresses.forEach(addr => addr.isDefault = false);
  Object.assign(address, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// ==================== ADMIN ====================

exports.getDashboard = asyncHandler(async (req, res) => {
  const [totalOrders, totalUsers, totalProducts, revenueData] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true }),
    Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ])
  ]);

  // Monthly revenue for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Recent orders
  const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(5);

  // Order status breakdown
  const statusBreakdown = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
    },
    monthlyRevenue,
    recentOrders,
    statusBreakdown
  });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) filter.$or = [
    { name: { $regex: req.query.search, $options: 'i' } },
    { email: { $regex: req.query.search, $options: 'i' } }
  ];

  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);
  res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
});

exports.toggleUserBlock = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Cannot block admin user'); }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully`, user });
});

// ==================== NOTIFICATIONS ===

exports.createNotification = asyncHandler(async (req, res) => {
  const { title, message, link, targetType, users } = req.body;
  if (!title || !message) {
    res.status(400);
    throw new Error('Notification title and message are required');
  }

  if (targetType === 'specific' && (!users || users.length === 0)) {
    res.status(400);
    throw new Error('Please select at least one user for specific notifications');
  }

  const notification = await Notification.create({
    title,
    message,
    link: link || '',
    createdBy: req.user.id,
    targetAll: targetType === 'all',
    users: targetType === 'specific' ? users : [],
  });

  res.status(201).json({ success: true, notification });
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().populate('createdBy', 'name email').populate('users', 'name email').sort('-createdAt');
  res.json({ success: true, notifications });
});

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    $or: [
      { targetAll: true },
      { users: req.user.id }
    ]
  }).sort('-createdAt');

  const formatted = notifications.map(notification => ({
    _id: notification._id,
    title: notification.title,
    message: notification.message,
    link: notification.link,
    isRead: notification.readBy.some(id => id.toString() === req.user.id),
    createdAt: notification.createdAt,
  }));

  res.json({ success: true, notifications: formatted });
});

exports.getMyNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    $or: [
      { targetAll: true },
      { users: req.user.id }
    ]
  }).populate('createdBy', 'name email');

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (!notification.readBy.some(id => id.toString() === req.user.id)) {
    notification.readBy.push(req.user.id);
    await notification.save();
  }

  res.json({ success: true, notification });
});

// ==================== CATEGORIES ====================

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('order name');
  res.json({ success: true, categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.json({ success: true, category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) { res.status(400); throw new Error(`Cannot delete category with ${productCount} products`); }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});

// ==================== COUPONS (ADMIN) ====================

exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
});

exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  res.json({ success: true, coupon });
});

exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted' });
});
