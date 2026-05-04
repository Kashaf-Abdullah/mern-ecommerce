const mongoose = require('mongoose');

// ==================== CATEGORY ====================
const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: String,
  image: { public_id: String, url: String },
  parent: { type: mongoose.Schema.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

// ==================== REVIEW ====================
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
  title: { type: String, maxLength: 100 },
  comment: { type: String, required: [true, 'Review comment is required'], maxLength: 1000 },
  images: [{ public_id: String, url: String }],
  isApproved: { type: Boolean, default: true },
  helpfulVotes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
}, { timestamps: true });

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (result.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratings: Math.round(result[0].avgRating * 10) / 10,
      numReviews: result[0].count
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, { ratings: 0, numReviews: 0 });
  }
};

reviewSchema.post('save', function () { this.constructor.calcAverageRating(this.product); });
reviewSchema.post('remove', function () { this.constructor.calcAverageRating(this.product); });

const Review = mongoose.model('Review', reviewSchema);

// ==================== CART ====================
const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  couponApplied: { type: mongoose.Schema.ObjectId, ref: 'Coupon' },
  couponCode: String,
  discountAmount: { type: Number, default: 0 },
}, { timestamps: true });

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});
cartSchema.set('toJSON', { virtuals: true });

const Cart = mongoose.model('Cart', cartSchema);

// ==================== WISHLIST ====================
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// ==================== COUPON ====================
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  maxDiscount: { type: Number },
  minOrderAmount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  applicableCategories: [{ type: mongoose.Schema.ObjectId, ref: 'Category' }],
}, { timestamps: true });

couponSchema.methods.isValid = function () {
  const now = new Date();
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (now < this.startDate) return { valid: false, message: 'Coupon is not yet active' };
  if (now > this.expiryDate) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  return { valid: true };
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = { Category, Review, Cart, Wishlist, Coupon };
