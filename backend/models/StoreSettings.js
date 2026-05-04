const mongoose = require('mongoose');

// Store settings stored in DB so all admins share the same config
const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
