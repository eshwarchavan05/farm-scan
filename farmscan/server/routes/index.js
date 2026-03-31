const express = require('express');
const multer = require('multer');
const { scanCrop } = require('../controllers/scanController');
const { askDoctor } = require('../controllers/doctorController');
const { getCurrentWeather, getForecast } = require('../controllers/weatherController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Scan route
router.post('/scan', upload.single('image'), scanCrop);

// Crop Doctor route
router.post('/doctor', askDoctor);

// Weather routes
router.get('/weather/current', getCurrentWeather);
router.get('/weather/forecast', getForecast);

module.exports = router;
