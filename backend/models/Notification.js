const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Notification title is required'], trim: true },
  message: { type: String, required: [true, 'Notification message is required'], trim: true },
  link: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  targetAll: { type: Boolean, default: true },
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  readBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
