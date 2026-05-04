const express = require('express');
const router = express.Router();
const {
  getSettings, getSetting, saveSetting, saveSettings,
  uploadReceipt, uploadReceiptMiddleware
} = require('../controllers/storeSettingsController');
const { protect, authorize } = require('../middleware/auth');

// Public - frontend reads settings to apply theme/text
router.get('/', getSettings);
router.get('/:key', getSetting);

// Admin only - write
router.post('/', protect, authorize('admin'), saveSetting);
router.post('/bulk', protect, authorize('admin'), saveSettings);

// Receipt upload - any authenticated user
router.post('/upload-receipt', protect, uploadReceiptMiddleware, uploadReceipt);

module.exports = router;
