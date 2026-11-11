const axios = require('axios');
const Scan = require('../models/Scan');
const FormData = require('form-data');
const fs = require('fs');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const scanCrop = async (req, res) => {
  const imagePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const cropType = req.body.crop || 'unknown';
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath), {
      filename: req.file.originalname || 'crop.jpg',
      contentType: req.file.mimetype || 'image/jpeg',
    });
    formData.append('crop', cropType);

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 90000,
      maxContentLength: 15 * 1024 * 1024,
    });
    const prediction = mlResponse.data;

    try {
      const scan = new Scan({
        cropType,
        disease: prediction.disease,
        confidence: prediction.confidence,
        severity: prediction.severity,
        treatment: prediction.treatment,
        healthy: prediction.healthy || false,
        className: prediction.class_name,
      });
      await scan.save();
    } catch (dbErr) {
      console.warn('DB save skipped:', dbErr.message);
    }

    return res.json(prediction);
  } catch (err) {
    console.error('Scan error:', err.message);
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      return res.status(503).json({
        error: 'Disease recognition service is unavailable. Start the ML service on port 8000 and try again.',
      });
    }
    if (err.response?.data?.error) {
      return res.status(err.response.status || 500).json({ error: err.response.data.error });
    }
    return res.status(500).json({ error: 'Scan failed. Please try again with a clearer leaf photo.' });
  } finally {
    if (imagePath) {
      try { fs.unlinkSync(imagePath); } catch (_) {}
    }
  }
};

const mlHealth = async (_req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 10000 });
    return res.json({ backend: 'ok', ml: mlResponse.data });
  } catch (err) {
    return res.status(503).json({
      backend: 'ok',
      ml: { status: 'down', error: err.message },
    });
  }
};

module.exports = { scanCrop, mlHealth };
