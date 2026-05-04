const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==================== STRIPE ====================

// @desc    Create Stripe payment intent
// @route   POST /api/payment/stripe/create-intent
exports.createStripeIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'inr' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: { userId: req.user.id.toString() },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  });
});

// @desc    Confirm Stripe payment & update order
// @route   POST /api/payment/stripe/confirm
exports.confirmStripePayment = asyncHandler(async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    res.status(400);
    throw new Error('Payment not successful');
  }

  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: paymentIntent.id,
    status: paymentIntent.status,
    updateTime: new Date().toISOString(),
  };
  order.orderStatus = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', description: 'Payment confirmed via Stripe' });
  await order.save();

  res.json({ success: true, order });
});

// ==================== RAZORPAY ====================

// @desc    Create Razorpay order
// @route   POST /api/payment/razorpay/create-order
exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', orderId } = req.body;

  const options = {
    amount: Math.round(amount * 100),
    currency,
    receipt: orderId || `receipt_${Date.now()}`,
    notes: { userId: req.user.id.toString() }
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/razorpay/verify
exports.verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest('hex');

  if (expectedSign !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed - Invalid signature');
  }

  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = { razorpay_payment_id, razorpay_order_id, razorpay_signature };
  order.orderStatus = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', description: 'Payment verified via Razorpay' });
  await order.save();

  res.json({ success: true, message: 'Payment verified successfully', order });
});

// @desc    Stripe Webhook
// @route   POST /api/payment/stripe/webhook
exports.stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    console.log('Payment succeeded:', event.data.object.id);
  }

  res.json({ received: true });
});
