const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const Scan = require('../models/Scan');
const FormData = require('form-data');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const scanCrop = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'farmscan',
      transformation: [{ width: 512, height: 512, crop: 'fill' }]
    });
    fs.unlinkSync(req.file.path);

    // Send image to Flask ML service
    const formData = new FormData();
    const imgResponse = await axios.get(uploadResult.secure_url, { responseType: 'arraybuffer' });
    formData.append('image', Buffer.from(imgResponse.data), { filename: 'crop.jpg', contentType: 'image/jpeg' });
    formData.append('crop', req.body.crop || 'unknown');

    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, formData, {
      headers: formData.getHeaders()
    });

    const prediction = mlResponse.data;

    // Save to MongoDB
    const scan = new Scan({
      imageUrl: uploadResult.secure_url,
      cropType: req.body.crop,
      disease: prediction.disease,
      confidence: prediction.confidence,
      severity: prediction.severity,
      treatment: prediction.treatment,
      healthy: prediction.healthy
    });
    await scan.save();

    res.json({
      ...prediction,
      imageUrl: uploadResult.secure_url
    });

  } catch (err) {
    console.error('Scan error:', err.message);

    // Fallback Mock Prediction (if ML service is down)
    if (err.code === 'ECONNREFUSED' || err.message.includes('ML_SERVICE_URL')) {
      const mockResult = {
        disease: "Early Blight (Demo Mode)",
        scientific_name: "Alternaria solani",
        confidence: 92.5,
        severity: "Medium",
        affected_area: "~25% of leaf",
        spread: "Wind, rain splash",
        treatment: "Spray Mancozeb (2g/L) every 7 days. Remove infected leaves. Avoid overhead watering.",
        healthy: false,
        note: "ML Service is not running. This is a demo fallback result.",
        imageUrl: process.env.TEMP_IMAGE_URL || "https://res.cloudinary.com/dmczsqlsj/image/upload/v1/farmscan/sample.jpg"
      };
      return res.json(mockResult);
    }

    res.status(500).json({ error: 'Scan failed. Please try again.' });
  }
};

module.exports = { scanCrop };
