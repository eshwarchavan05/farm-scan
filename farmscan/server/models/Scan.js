const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  cropType: { type: String, required: true },
  disease: { type: String },
  confidence: { type: Number },
  severity: { type: String },
  treatment: { type: String },
  healthy: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);
