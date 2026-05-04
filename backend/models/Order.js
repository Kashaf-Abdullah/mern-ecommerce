const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
});

const orderStatusSchema = new mongoose.Schema({
  status: { type: String, required: true },
  description: String,
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['cod', 'stripe', 'razorpay'],
    required: true
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    emailAddress: String,
    razorpay_payment_id: String,
    razorpay_order_id: String,
    razorpay_signature: String,
  },
  itemsPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  couponApplied: { type: mongoose.Schema.ObjectId, ref: 'Coupon' },
  couponCode: String,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [orderStatusSchema],
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
}, { timestamps: true });

// Generate unique order ID
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
