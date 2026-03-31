import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LangContext';
import BASE_URL from '../api';

const WEATHER_ICONS = {
  Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️', Haze: '🌫️',
};

const getFarmingTip = (weather, temp, humidity) => {
  const main = weather?.main;
  if (main === 'Rain' || main === 'Drizzle') return { icon: '⚠️', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', tip: 'Avoid spraying pesticides today. Rain will wash them away. Good time for soil water retention.' };
  if (main === 'Thunderstorm') return { icon: '🌩️', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', tip: 'Do not go to the field today. Secure your crops and equipment. Wait for the storm to pass.' };
  if (main === 'Clear' && temp > 35) return { icon: '🌡️', color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', tip: 'Very hot day. Water your crops early morning or evening to prevent evaporation. Watch for heat stress.' };
  if (main === 'Clear' && humidity < 40) return { icon: '💧', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', tip: 'Low humidity today. Great day to spray fungicides. Ensure adequate irrigation for your crops.' };
  if (main === 'Clear') return { icon: '✅', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', tip: 'Perfect farming day! Ideal conditions for spraying, harvesting, or field work. Make the most of it.' };
  if (humidity > 80) return { icon: '🍄', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', tip: 'High humidity — watch out for fungal diseases like blight and mildew. Consider preventive fungicide spray.' };
  return { icon: '🌿', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', tip: 'Moderate conditions today. Good day for routine field activities and crop monitoring.' };
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

const Weather = () => {
  const { t } = useLang();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather(12.9716, 77.5946);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(12.9716, 77.5946),
      { timeout: 5000, maximumAge: 60000 }
    );
  }, []);

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      const [curr, fore] = await Promise.all([
        axios.get(`${BASE_URL}/api/weather/current?lat=${lat}&lon=${lon}`),
        axios.get(`${BASE_URL}/api/weather/forecast?lat=${lat}&lon=${lon}`),
      ]);
      setWeather(curr.data);
      setForecast(fore.data.list || []);
      setCity(curr.data.name);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Could not fetch weather.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const dailyForecast = forecast.filter((_, i) => i % 8 === 0).slice(0, 5);
  const tip = weather ? getFarmingTip(weather.weather?.[0], weather.main?.temp, weather.main?.humidity) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F0FDF4', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 768px) { .weather-grid { grid-template-columns: 1fr !important; } .forecast-grid { grid-template-columns: repeat(3,1fr) !important; } }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, rgba(5,18,10,0.92) 0%, rgba(12,40,22,0.85) 100%),
          url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop') center/cover`,
        padding: '130px 2rem 70px', textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#4ADE80', letterSpacing: '2px', marginBottom: '14px' }}>FARM WEATHER INTELLIGENCE</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '52px', color: '#fff',
            fontWeight: '700', marginBottom: '14px', letterSpacing: '-0.5px',
          }}>{t('weather.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
            {t('weather.subtitle')}
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '3rem 2rem' }}>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', margin: '0 auto 20px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>🌍</div>
            <p style={{ color: '#4B7A5E', fontSize: '16px', fontWeight: '600' }}>{t('weather.detecting')}</p>
            <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.7;transform:scale(0.95);} }`}</style>
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
            textAlign: 'center', padding: '4rem', background: '#fff',
            borderRadius: '24px', border: '1px solid #FECACA',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p style={{ color: '#DC2626', fontSize: '15px', fontWeight: '500', maxWidth: '400px', margin: '0 auto' }}>{error}</p>
          </motion.div>
        ) : weather && (
          <div>

            {/* Main Weather Card */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{
              background: 'linear-gradient(135deg, #0D2B1A 0%, #1A4D30 60%, #0D3520 100%)',
              borderRadius: '24px', padding: '2.5rem', color: '#fff',
              marginBottom: '1.25rem',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
              boxShadow: '0 8px 40px rgba(13,43,26,0.35)',
              border: '1px solid rgba(74,222,128,0.1)',
            }} className="weather-grid">
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', color: '#4ADE80', marginBottom: '16px', fontWeight: '600',
                }}>
                  <span>📍</span> {city}, India
                </div>
                <div style={{ fontSize: '88px', lineHeight: 1, marginBottom: '8px' }}>
                  {WEATHER_ICONS[weather.weather?.[0]?.main] || '🌤️'}
                </div>
                <div style={{
                  fontSize: '72px', fontWeight: '900', fontFamily: "'Inter', sans-serif",
                  lineHeight: 1, letterSpacing: '-3px',
                }}>
                  {Math.round(weather.main?.temp)}°
                  <span style={{ fontSize: '32px', fontWeight: '500', letterSpacing: 0 }}>C</span>
                </div>
                <div style={{ fontSize: '16px', color: '#86EFAC', marginTop: '8px', textTransform: 'capitalize', fontWeight: '500' }}>
                  {weather.weather?.[0]?.description}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  {t('weather.feel')} {Math.round(weather.main?.feels_like)}°C
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                {[
                  { label: t('weather.humidity'), val: `${weather.main?.humidity}%`, icon: '💧' },
                  { label: t('weather.wind'), val: `${Math.round((weather.wind?.speed || 0) * 3.6)} km/h`, icon: '🌬️' },
                  { label: t('weather.visibility'), val: `${Math.round((weather.visibility || 0) / 1000)} km`, icon: '👁️' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(74,222,128,0.08)',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', background: 'rgba(74,222,128,0.12)',
                      borderRadius: '10px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '0.5px' }}>{item.label.toUpperCase()}</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Farming Tip */}
            {tip && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{
                background: tip.bg, borderRadius: '20px', padding: '1.5rem',
                border: `1.5px solid ${tip.border}`, marginBottom: '1.25rem',
                display: 'flex', gap: '16px', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '48px', height: '48px', background: '#fff',
                  borderRadius: '14px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                  boxShadow: `0 4px 16px ${tip.border}`,
                }}>{tip.icon}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: tip.color, marginBottom: '6px', letterSpacing: '1px' }}>
                    FARMING TIP
                  </div>
                  <p style={{ fontSize: '14px', color: '#1E4D35', lineHeight: '1.7', fontWeight: '500' }}>{tip.tip}</p>
                </div>
              </motion.div>
            )}

            {/* 5-Day Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                background: '#fff', borderRadius: '24px', border: '1px solid #DCFCE7',
                padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{
                fontSize: '14px', fontWeight: '800', color: '#0D2B1A',
                marginBottom: '1.25rem', letterSpacing: '1px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{
                  background: '#DCFCE7', width: '30px', height: '30px', borderRadius: '8px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                }}>📅</span>
                {t('weather.forecast').toUpperCase()}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }} className="forecast-grid">
                {dailyForecast.map((day, i) => {
                  const date = new Date(day.dt * 1000);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(22,163,74,0.12)' }}
                      style={{
                        background: '#F8FFF9', borderRadius: '16px', padding: '1rem 0.75rem',
                        textAlign: 'center', border: '1px solid #DCFCE7', cursor: 'default',
                      }}
                    >
                      <div style={{ fontSize: '12px', color: '#4B7A5E', fontWeight: '700', marginBottom: '8px' }}>
                        {i === 0 ? 'Today' : DAYS[date.getDay()]}
                      </div>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                        {WEATHER_ICONS[day.weather?.[0]?.main] || '🌤️'}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#0D2B1A', letterSpacing: '-0.5px' }}>
                        {Math.round(day.main?.temp)}°
                      </div>
                      <div style={{ fontSize: '10px', color: '#6B9E7E', marginTop: '4px', textTransform: 'capitalize', fontWeight: '500' }}>
                        {day.weather?.[0]?.description}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
