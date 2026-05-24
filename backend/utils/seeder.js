const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const { Category } = require('../models/index');

const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});

  console.log('🗑  Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@shopnow.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
  });

  // Create test user
  await User.create({
    name: 'Test User',
    email: 'user@shopnow.com',
    password: 'user123',
    role: 'user',
    isEmailVerified: true,
    isActive: true,
  });

  console.log('👤 Users created');

  // Create categories from JSON data
  const categoriesFile = path.join(__dirname, '../data/categories.json');
  const rawCategories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
  const categoriesData = rawCategories.map(cat => {
    const normalized = { ...cat };
    if (cat._id?.$oid) normalized._id = new mongoose.Types.ObjectId(cat._id.$oid);
    return normalized;
  });
  const categories = await Category.insertMany(categoriesData);

  console.log('📁 Categories created from data/categories.json');

  // Create sample products
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat._id;
    return acc;
  }, {});

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .concat('-', Math.floor(Math.random() * 1000000));
  };

  const products = [
    {
      name: 'Classic Men’s Leather Jacket',
      slug: generateSlug('Classic Men’s Leather Jacket'),
      description: 'Premium genuine leather jacket with quilted lining, zipper pockets, and soft collar. Ideal for evening outings and cold weather style.',
      shortDescription: 'Premium men’s leather jacket with quilted lining and durable finish.',
      price: 149.99,
      discountPrice: 119.99,
      discountPercent: 20,
      images: [
        { public_id: 'mens_jacket_1', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80' },
        { public_id: 'mens_jacket_2', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
        { public_id: 'mens_jacket_3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80' }
      ],
      category: categoryMap['men'],
      brand: 'UrbanTailor',
      stock: 42,
      sku: 'MEN-JKT-001',
      specifications: [
        { key: 'Material', value: 'Genuine leather' },
        { key: 'Lining', value: 'Quilted polyester' },
        { key: 'Closure', value: 'Front zipper' }
      ],
      tags: ['jacket', 'leather', 'men', 'outerwear'],
      featured: true,
      trending: true,
      ratings: 4.7,
      numReviews: 34,
      seller: admin._id,
      weight: 1.3,
      dimensions: { length: 28, width: 20, height: 3 }
    },
    {
      name: 'Men’s Performance Running Shoes',
      slug: generateSlug('Men’s Performance Running Shoes'),
      description: 'Lightweight running shoes with breathable mesh, cushioned midsole, and flexible outsole. Designed for daily training and long-distance comfort.',
      shortDescription: 'Lightweight men’s running shoes with breathable mesh and responsive cushioning.',
      price: 89.99,
      discountPrice: 74.99,
      discountPercent: 17,
      images: [
        { public_id: 'mens_shoes_1', url: 'https://images.unsplash.com/photo-1515548210695-8a0yYDM3pi2?w=800&q=80' },
        { public_id: 'mens_shoes_2', url: 'https://images.unsplash.com/photo-1528701800489-20d0e0ca82aa?w=800&q=80' },
        { public_id: 'mens_shoes_3', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' }
      ],
      category: categoryMap['men'],
      brand: 'StrideForce',
      stock: 88,
      sku: 'MEN-SHOE-002',
      specifications: [
        { key: 'Upper', value: 'Breathable knit mesh' },
        { key: 'Sole', value: 'Rubber traction outsole' },
        { key: 'Support', value: 'EVA cushioned midsole' }
      ],
      tags: ['shoes', 'running', 'men', 'sports'],
      featured: false,
      trending: true,
      ratings: 4.5,
      numReviews: 52,
      seller: admin._id,
      weight: 0.9,
      dimensions: { length: 13, width: 8, height: 5 }
    },
    {
      name: 'Women’s Silk Floral Dress',
      slug: generateSlug('Women’s Silk Floral Dress'),
      description: 'Elegant silk dress with delicate floral print, adjustable waist tie, and soft lining. Perfect for brunch, special events, or everyday elegance.',
      shortDescription: 'Elegant women’s silk dress with floral print and adjustable waist.',
      price: 129.99,
      discountPrice: 104.99,
      discountPercent: 19,
      images: [
        { public_id: 'womens_dress_1', url: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d2?w=800&q=80' },
        { public_id: 'womens_dress_2', url: 'https://images.unsplash.com/photo-1520975912441-681fa5a99a3a?w=800&q=80' },
        { public_id: 'womens_dress_3', url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80' }
      ],
      category: categoryMap['women'],
      brand: 'LunaChic',
      stock: 57,
      sku: 'WOM-DRS-003',
      specifications: [
        { key: 'Fabric', value: '100% silk' },
        { key: 'Fit', value: 'Relaxed A-line' },
        { key: 'Sleeve', value: 'Short flutter sleeve' }
      ],
      tags: ['dress', 'women', 'silk', 'floral'],
      featured: true,
      trending: false,
      ratings: 4.8,
      numReviews: 28,
      seller: admin._id,
      weight: 0.4,
      dimensions: { length: 42, width: 15, height: 2 }
    },
    {
      name: 'Women’s Everyday Tote Bag',
      slug: generateSlug('Women’s Everyday Tote Bag'),
      description: 'Spacious everyday tote with faux leather straps, inner pockets, and water-resistant lining. Great for work, travel, and daily essentials.',
      shortDescription: 'Spacious women’s tote bag with inner pockets and water-resistant lining.',
      price: 64.99,
      discountPrice: 49.99,
      discountPercent: 23,
      images: [
        { public_id: 'women_tote_1', url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80' },
        { public_id: 'women_tote_2', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80' },
        { public_id: 'women_tote_3', url: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d2?w=800&q=80' }
      ],
      category: categoryMap['women'],
      brand: 'MetroMuse',
      stock: 65,
      sku: 'WOM-BAG-004',
      specifications: [
        { key: 'Material', value: 'Faux leather' },
        { key: 'Closure', value: 'Top zipper' },
        { key: 'Capacity', value: '15L' }
      ],
      tags: ['bag', 'women', 'tote', 'accessories'],
      featured: false,
      trending: true,
      ratings: 4.6,
      numReviews: 21,
      seller: admin._id,
      weight: 0.6,
      dimensions: { length: 16, width: 6, height: 12 }
    },
    {
      name: 'Kids’ Dino Adventure Hoodie',
      slug: generateSlug('Kids’ Dino Adventure Hoodie'),
      description: 'Soft cotton hoodie with dinosaur print, kangaroo pocket, and hooded design. Comfortable for playtime, school, and outdoor adventures.',
      shortDescription: 'Cozy kids’ hoodie with dinosaur print and soft cotton fabric.',
      price: 34.99,
      discountPrice: 27.99,
      discountPercent: 20,
      images: [
        { public_id: 'kids_hoodie_1', url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80' },
        { public_id: 'kids_hoodie_2', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
        { public_id: 'kids_hoodie_3', url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80' }
      ],
      category: categoryMap['kids'],
      brand: 'PlayNest',
      stock: 72,
      sku: 'KID-HDY-005',
      specifications: [
        { key: 'Fabric', value: '100% cotton' },
        { key: 'Closure', value: 'Pullover' },
        { key: 'Care', value: 'Machine washable' }
      ],
      tags: ['kids', 'hoodie', 'dinosaur', 'clothing'],
      featured: true,
      trending: false,
      ratings: 4.9,
      numReviews: 17,
      seller: admin._id,
      weight: 0.35,
      dimensions: { length: 18, width: 12, height: 1.5 }
    }
  ];

  await Product.insertMany(products);
  console.log('📦 Products created');

  console.log('\n✅ Database seeded successfully!');
  console.log('Admin: admin@shopnow.com / admin123');
  console.log('User:  user@shopnow.com  / user123');

  process.exit(0);
};

seedData().catch(err => {
  console.error('Seeder error:', err);
  process.exit(1);
});
