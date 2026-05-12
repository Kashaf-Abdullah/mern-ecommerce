// Test utilities and helpers
const mongoose = require('mongoose');

// Mock data generators
const generateMockProduct = () => ({
  name: `Product ${Math.random()}`,
  description: 'Test product description',
  price: Math.floor(Math.random() * 10000),
  stock: Math.floor(Math.random() * 100),
  category: 'Test Category',
  rating: Math.floor(Math.random() * 5),
  reviews: []
});

const generateMockUser = () => ({
  name: `User ${Math.random()}`,
  email: `user${Math.random()}@example.com`,
  password: 'TestPassword123!',
  phone: '1234567890',
  role: 'customer'
});

const generateMockOrder = () => ({
  items: [
    {
      productId: new mongoose.Types.ObjectId(),
      quantity: Math.floor(Math.random() * 5) + 1,
      price: Math.floor(Math.random() * 10000)
    }
  ],
  totalAmount: Math.floor(Math.random() * 50000),
  status: 'pending',
  paymentMethod: 'credit_card'
});

const generateMockReview = () => ({
  rating: Math.floor(Math.random() * 5) + 1,
  title: `Review ${Math.random()}`,
  comment: 'This is a test review comment',
  isPurchaseVerified: true
});

const generateMockCoupon = () => ({
  code: `COUPON${Math.floor(Math.random() * 10000)}`,
  discountType: 'percentage',
  discountValue: Math.floor(Math.random() * 50),
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  maxUses: 100
});

// Validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Test data
const testData = {
  validEmails: [
    'user@example.com',
    'test.user@example.co.uk',
    'user+tag@example.com'
  ],
  invalidEmails: [
    'user@',
    'user@.com',
    'user@example',
    'user example@test.com'
  ],
  validPasswords: [
    'StrongPass123!',
    'MyPassword@2024',
    'Test123!Pass'
  ],
  invalidPasswords: [
    '123',
    'password',
    'Password123',
    'Pass@2024'
  ],
  validPhones: [
    '1234567890',
    '9876543210'
  ],
  invalidPhones: [
    '123',
    '123456789',
    '12345678901'
  ]
};

// Assertion helpers
const assertValidResponse = (response) => {
  expect(response).toBeTruthy();
  expect(response.success).toBeDefined();
};

const assertValidUser = (user) => {
  expect(user._id).toBeTruthy();
  expect(user.email).toBeTruthy();
  expect(user.name).toBeTruthy();
};

const assertValidProduct = (product) => {
  expect(product._id).toBeTruthy();
  expect(product.name).toBeTruthy();
  expect(product.price).toBeGreaterThan(0);
};

const assertValidOrder = (order) => {
  expect(order._id).toBeTruthy();
  expect(order.items).toBeTruthy();
  expect(order.totalAmount).toBeGreaterThan(0);
};

// Database helpers
const clearDatabase = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const collection of collections) {
    await mongoose.connection.db.collection(collection.name).deleteMany({});
  }
};

// Module exports
module.exports = {
  // Generators
  generateMockProduct,
  generateMockUser,
  generateMockOrder,
  generateMockReview,
  generateMockCoupon,

  // Validators
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidPassword,

  // Test data
  testData,

  // Assertions
  assertValidResponse,
  assertValidUser,
  assertValidProduct,
  assertValidOrder,

  // Database
  clearDatabase
};
