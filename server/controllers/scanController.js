const axios = require('axios');
const Scan = require('../models/Scan');
const FormData = require('form-data');
const fs = require('fs');

const scanCrop = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const cropType = req.body.crop || 'unknown';
    const imagePath = req.file.path;

    let prediction;

    try {
      // Send image directly to Flask ML service
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath), {
        filename: req.file.originalname || 'crop.jpg',
        contentType: req.file.mimetype || 'image/jpeg'
      });
      formData.append('crop', cropType);

      const mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/predict`,
        formData,
        { headers: formData.getHeaders(), timeout: 30000 }
      );
      prediction = mlResponse.data;
    } catch (mlError) {
      console.warn('ML service unavailable, using demo response:', mlError.message);
      // Demo response when ML service is not running
      prediction = {
        disease: 'Early Blight',
        scientific_name: 'Alternaria solani',
        confidence: 94.2,
        severity: 'High',
        affected_area: '~35% of leaf',
        spread: 'Wind, water splash',
        treatment: 'Spray Mancozeb (2g/L) every 7 days. Remove infected leaves immediately. Avoid overhead watering. Apply copper-based fungicide as a preventive measure. Ensure proper plant spacing for air circulation.',
        healthy: false,
        demo: true
      };
    }

    // Clean up temp file
    try { fs.unlinkSync(imagePath); } catch (_) {}

    // Save to DB silently (won't crash app if DB is down)
    try {
      const scan = new Scan({
        cropType,
        disease: prediction.disease,
        confidence: prediction.confidence,
        severity: prediction.severity,
        treatment: prediction.treatment,
        healthy: prediction.healthy || false
      });
      await scan.save();
    } catch (dbErr) {
      console.warn('DB save skipped:', dbErr.message);
    }

    res.json(prediction);

  } catch (err) {
    console.error('Scan error:', err.message);
    res.status(500).json({ error: 'Scan failed. Please try again.' });
  }
};

module.exports = { scanCrop };
