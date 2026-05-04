const asyncHandler = require('express-async-handler');
const StoreSettings = require('../models/StoreSettings');
const { cloudinary } = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// GET all settings
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.find({});
  const result = {};
  settings.forEach(s => { result[s.key] = s.value; });
  res.json({ success: true, settings: result });
});

// GET single setting by key
exports.getSetting = asyncHandler(async (req, res) => {
  const setting = await StoreSettings.findOne({ key: req.params.key });
  res.json({ success: true, value: setting ? setting.value : null });
});

// UPSERT setting
exports.saveSetting = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  if (!key) { res.status(400); throw new Error('Key is required'); }

  const setting = await StoreSettings.findOneAndUpdate(
    { key },
    { key, value },
    { new: true, upsert: true }
  );

  res.json({ success: true, setting });
});

// Save multiple settings at once
exports.saveSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body; // { theme: {...}, texts: {...}, payment: {...} }
  if (!settings) { res.status(400); throw new Error('Settings object required'); }

  const ops = Object.entries(settings).map(([key, value]) =>
    StoreSettings.findOneAndUpdate({ key }, { key, value }, { new: true, upsert: true })
  );
  await Promise.all(ops);

  res.json({ success: true, message: 'Settings saved' });
});

// Upload receipt image (local storage, then optionally cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/receipts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `receipt-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const receiptUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  }
});

exports.uploadReceiptMiddleware = receiptUpload.single('receipt');

exports.uploadReceipt = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  let url = `/uploads/receipts/${req.file.filename}`;

  // Try uploading to Cloudinary if configured
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'shopnow/receipts',
        resource_type: 'image',
      });
      url = result.secure_url;
      // Remove local file after cloudinary upload
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.log('Cloudinary upload failed, using local storage:', err.message);
    }
  }

  res.json({ success: true, url, filename: req.file.filename });
});
