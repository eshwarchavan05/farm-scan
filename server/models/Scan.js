const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  cropType: { type: String, default: 'unknown' },
  disease: { type: String },
  confidence: { type: Number },
  severity: { type: String },
  treatment: { type: String },
  healthy: { type: Boolean, default: false },
  className: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);
