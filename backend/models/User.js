const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter your name'], trim: true, maxLength: [50, 'Name cannot exceed 50 chars'] },
  email: { type: String, required: [true, 'Please enter email'], unique: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
  password: { type: String, required: [true, 'Please enter password'], minLength: [6, 'Password must be at least 6 chars'], select: false },
  avatar: {
    public_id: { type: String, default: '' },
    url: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/jazz.jpg' }
  },
  role: { type: String, enum: ['user', 'admin', 'subadmin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: String,
  emailVerifyExpire: Date,
  addresses: [addressSchema],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  googleId: String,
  lastLogin: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
};

// Generate email verify token
userSchema.methods.getEmailVerifyToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.emailVerifyToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

module.exports = mongoose.model('User', userSchema);
