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
  const products = [];
  const sampleImages = [{ public_id: 'sample', url: 'https://via.placeholder.com/800x800?text=Product' }];

  // Helper function to generate slug
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-') + '-' + Date.now();
  };

  for (let i = 1; i <= 20; i++) {
    const category = categories[i % categories.length];
    const price = Math.floor(Math.random() * 5000) + 500;
    const discountPrice = Math.random() > 0.5 ? Math.floor(price * 0.8) : 0;
    const productName = `Product ${i} - ${category.name}`;
    products.push({
      name: productName,
      slug: generateSlug(productName),
      description: `High quality ${category.name.toLowerCase()} product with excellent features and durability. Perfect for everyday use.`,
      shortDescription: `Great ${category.name.toLowerCase()} product at competitive price`,
      price,
      discountPrice,
      images: sampleImages,
      category: category._id,
      brand: ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas'][i % 5],
      stock: Math.floor(Math.random() * 100) + 10,
      featured: i <= 6,
      trending: i % 3 === 0,
      ratings: Math.round((Math.random() * 2 + 3) * 10) / 10,
      numReviews: Math.floor(Math.random() * 100),
      seller: admin._id,
    });
  }

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
