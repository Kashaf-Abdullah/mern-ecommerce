const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { Cart, Coupon } = require('../models/index');
const sendEmail = require('../utils/sendEmail');

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Check stock availability
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      res.status(400);
      throw new Error(`Product ${item.product?.name || 'unknown'} is no longer available`);
    }
    if (item.product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.product.name}`);
    }
  }

  const itemsPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
  let discountAmount = 0;
  let couponApplied = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validity = coupon.isValid();
      if (validity.valid && itemsPrice >= coupon.minOrderAmount) {
        couponApplied = coupon._id;
        if (coupon.discountType === 'percentage') {
          discountAmount = (itemsPrice * coupon.discountValue) / 100;
          if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        } else {
          discountAmount = Math.min(coupon.discountValue, itemsPrice);
        }
        coupon.usedCount += 1;
        coupon.usedBy.push(req.user.id);
        await coupon.save();
      }
    }
  }

  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0]?.url || '',
    price: item.price,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    couponApplied,
    couponCode: couponCode || undefined,
    isPaid: paymentMethod === 'cod' ? false : false,
    statusHistory: [{ status: 'pending', description: 'Order placed successfully' }]
  });

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], couponApplied: null, discountAmount: 0 });

  // Notify admins about new order
  try {
    const admins = await User.find({ role: { $in: ['admin', 'subadmin'] } });
    const adminIds = admins.map(a => a._id);
    
    if (adminIds.length > 0) {
      await Notification.create({
        title: 'New Order Received',
        message: `New order #${order.orderId} received from ${req.user.name}. Total: ₹${order.totalPrice}`,
        link: `/admin/orders/${order._id}`,
        createdBy: req.user.id,
        targetAll: false,
        users: adminIds,
      });
    }
  } catch (err) {
    console.log('Order notification error:', err.message);
  }

  // Send confirmation email
  try {
    await sendEmail({
      email: req.user.email,
      subject: `Order Confirmed #${order.orderId}`,
      template: 'orderConfirmation',
      data: { name: req.user.name, order }
    });
  } catch (err) {
    console.log('Order email error:', err.message);
  }

  const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
  res.status(201).json({ success: true, order: populatedOrder });
});

// @desc    Get my orders
// @route   GET /api/orders/my
exports.getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user.id }).sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments({ user: req.user.id })
  ]);

  res.status(200).json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) { res.status(404); throw new Error('Order not found'); }

  // Only admin or the order owner can view
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.status(200).json({ success: true, order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  if (order.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    res.status(400);
    throw new Error('Order cannot be cancelled at this stage');
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  order.statusHistory.push({ status: 'cancelled', description: order.cancelReason });

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  await order.save();
  res.status(200).json({ success: true, order });
});

// ==================== ADMIN ====================

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter)
  ]);

  res.status(200).json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, description, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) { res.status(404); throw new Error('Order not found'); }

  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  if (!validTransitions[order.orderStatus]?.includes(status)) {
    res.status(400);
    throw new Error(`Cannot transition from ${order.orderStatus} to ${status}`);
  }

  order.orderStatus = status;
  if (status === 'delivered') { order.deliveredAt = new Date(); }
  if (trackingNumber) order.trackingNumber = trackingNumber;

  order.statusHistory.push({
    status,
    description: description || `Order ${status}`,
    updatedBy: req.user.id
  });

  await order.save();

  // Notify user via notification
  try {
    const user = await User.findById(order.user);
    await Notification.create({
      title: 'Order Status Updated',
      message: `Your order #${order.orderId} status changed to "${status.charAt(0).toUpperCase() + status.slice(1)}". ${description || ''}`,
      link: `/orders/${order._id}`,
      createdBy: req.user.id,
      targetAll: false,
      users: [order.user],
    });
  } catch (err) {
    console.log('Notification error:', err.message);
  }

  // Notify user via email
  try {
    const user = await User.findById(order.user);
    await sendEmail({
      email: user.email,
      subject: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} - #${order.orderId}`,
      template: 'orderStatus',
      data: { name: user.name, order, status }
    });
  } catch (err) {
    console.log('Status email error:', err.message);
  }

  res.status(200).json({ success: true, order });
});
