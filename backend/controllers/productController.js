const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// Build filter query
const buildFilterQuery = (query) => {
  const filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = { $in: query.brand.split(',') };
  if (query.featured) filter.featured = true;
  if (query.trending) filter.trending = true;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.minRating) filter.ratings = { $gte: Number(query.minRating) };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = buildFilterQuery(req.query);

  // Sorting
  let sortBy = {};
  switch (req.query.sort) {
    case 'price_asc': sortBy = { price: 1 }; break;
    case 'price_desc': sortBy = { price: -1 }; break;
    case 'rating': sortBy = { ratings: -1 }; break;
    case 'newest': sortBy = { createdAt: -1 }; break;
    case 'popular': sortBy = { numReviews: -1 }; break;
    default: sortBy = { createdAt: -1 };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    products,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      { slug: req.params.id }
    ],
    isActive: true
  }).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({ success: true, product });
});

// @desc    Create product (Admin)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, seller: req.user.id });
  await product.populate('category', 'name slug');
  res.status(201).json({ success: true, product });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  }).populate('category', 'name slug');

  res.status(200).json({ success: true, product });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete images from cloudinary
  for (const img of product.images) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @desc    Upload product images
// @route   POST /api/products/:id/images
exports.uploadImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }

  const images = req.files.map(file => ({
    public_id: file.filename,
    url: file.path
  }));

  product.images = [...product.images, ...images];
  await product.save();

  res.status(200).json({ success: true, images: product.images });
});

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
exports.deleteImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const image = product.images.find(img => img._id.toString() === req.params.imageId);
  if (!image) { res.status(404); throw new Error('Image not found'); }

  await cloudinary.uploader.destroy(image.public_id);
  product.images = product.images.filter(img => img._id.toString() !== req.params.imageId);
  await product.save();

  res.status(200).json({ success: true, message: 'Image deleted' });
});

// @desc    Search suggestions
// @route   GET /api/products/suggestions
exports.getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } }
    ],
    isActive: true
  }).select('name brand images').limit(8).lean();

  res.json({ success: true, suggestions: products });
});
