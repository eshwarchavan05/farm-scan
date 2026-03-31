const axios = require('axios');

const BASE = 'https://api.openweathermap.org/data/2.5';

const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const key = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    res.json(response.data);
  } catch (err) {
    console.error('Weather error:', err.message);
    res.status(500).json({ error: 'Could not fetch weather' });
  }
};

const getForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const key = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    res.json(response.data);
  } catch (err) {
    console.error('Forecast error:', err.message);
    res.status(500).json({ error: 'Could not fetch forecast' });
  }
};

module.exports = { getCurrentWeather, getForecast };
