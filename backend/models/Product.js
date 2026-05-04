const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true, maxLength: [200, 'Name cannot exceed 200 chars'] },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: [true, 'Product description is required'] },
  shortDescription: { type: String, maxLength: [500, 'Short description cannot exceed 500 chars'] },
  price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
  discountPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  images: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  }],
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: [true, 'Brand is required'], trim: true },
  stock: { type: Number, required: [true, 'Stock is required'], min: [0, 'Stock cannot be negative'], default: 0 },
  sku: { type: String, unique: true, sparse: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  specifications: [{ key: String, value: String }],
  tags: [String],
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  weight: { type: Number },
  dimensions: {
    length: Number, width: Number, height: Number
  },
  seller: { type: mongoose.Schema.ObjectId, ref: 'User' },
}, { timestamps: true });

// Generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-') + '-' + Date.now();
  }
  if (this.discountPrice && this.price) {
    this.discountPercent = Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  next();
});

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Indexes
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, ratings: -1 });
productSchema.index({ featured: 1, trending: 1 });

module.exports = mongoose.model('Product', productSchema);
