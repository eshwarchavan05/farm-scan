const axios = require('axios');

const BASE = 'https://api.openweathermap.org/data/2.5';

const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) return res.status(500).json({ error: 'OPENWEATHER_API_KEY is not set in .env' });
    const response = await axios.get(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    res.json(response.data);
  } catch (err) {
    console.error('Weather error:', err.message);
    const status = err.response?.status;
    if (status === 401) return res.status(401).json({ error: 'Invalid OpenWeatherMap API key. Check OPENWEATHER_API_KEY in .env' });
    res.status(500).json({ error: 'Could not fetch weather: ' + (err.response?.data?.message || err.message) });
  }
};

const getForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) return res.status(500).json({ error: 'OPENWEATHER_API_KEY is not set in .env' });
    const response = await axios.get(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    res.json(response.data);
  } catch (err) {
    console.error('Forecast error:', err.message);
    const status = err.response?.status;
    if (status === 401) return res.status(401).json({ error: 'Invalid OpenWeatherMap API key. Check OPENWEATHER_API_KEY in .env' });
    res.status(500).json({ error: 'Could not fetch forecast: ' + (err.response?.data?.message || err.message) });
  }
};

module.exports = { getCurrentWeather, getForecast };
