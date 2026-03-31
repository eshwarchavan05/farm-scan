import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLang } from '../i18n/LangContext';

const WEATHER_ICONS = {
  Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️', Haze: '🌫️'
};

const getFarmingTip = (weather, temp, humidity) => {
  const main = weather?.main;
  if (main === 'Rain' || main === 'Drizzle') return { icon: '⚠️', color: '#FF6F00', tip: 'Avoid spraying pesticides today. Rain will wash them away. Good time for soil water retention.' };
  if (main === 'Thunderstorm') return { icon: '🌩️', color: '#C62828', tip: 'Do not go to the field today. Secure your crops and equipment. Wait for the storm to pass.' };
  if (main === 'Clear' && temp > 35) return { icon: '🌡️', color: '#E65100', tip: 'Very hot day. Water your crops early morning or evening to prevent evaporation. Watch for heat stress.' };
  if (main === 'Clear' && humidity < 40) return { icon: '💧', color: '#1565C0', tip: 'Low humidity today. Great day to spray fungicides. Ensure adequate irrigation for your crops.' };
  if (main === 'Clear') return { icon: '✅', color: '#2E7D32', tip: 'Perfect farming day! Ideal conditions for spraying, harvesting, or field work. Make the most of it.' };
  if (humidity > 80) return { icon: '🍄', color: '#6A1B9A', tip: 'High humidity — watch out for fungal diseases like blight and mildew. Consider preventive fungicide spray.' };
  return { icon: '🌿', color: '#2E7D4F', tip: 'Moderate conditions today. Good day for routine field activities and crop monitoring.' };
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Weather = () => {
  const { t } = useLang();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(12.9716, 77.5946) // Default: Bangalore
    );
  }, []);

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      const [curr, fore] = await Promise.all([
        axios.get(`/api/weather/current?lat=${lat}&lon=${lon}`),
        axios.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`)
      ]);
      setWeather(curr.data);
      setForecast(fore.data.list || []);
      setCity(curr.data.name);
    } catch {
      setError('Could not fetch weather. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const dailyForecast = forecast.filter((_, i) => i % 8 === 0).slice(0, 5);
  const tip = weather ? getFarmingTip(weather.weather?.[0], weather.main?.temp, weather.main?.humidity) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F4F9F1', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 768px) { .weather-grid { grid-template-columns: 1fr !important; } .forecast-grid { grid-template-columns: repeat(3, 1fr) !important; } }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(rgba(10,40,20,0.78), rgba(10,40,20,0.65)),
          url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop') center/cover`,
        padding: '120px 2rem 60px', textAlign: 'center'
      }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#fff', fontWeight: '700', marginBottom: '12px' }}>
          {t('weather.title')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>{t('weather.subtitle')}</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🌍</div>
            <p style={{ color: '#5A8C6A', fontSize: '16px', fontWeight: '600' }}>{t('weather.detecting')}</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>
            <p style={{ color: '#E53935', fontSize: '16px' }}>{error}</p>
          </div>
        ) : weather && (
          <>
            {/* Main weather card */}
            <div style={{
              background: `linear-gradient(135deg, #1B4D2E, #2E7D4F)`,
              borderRadius: '24px', padding: '2.5rem', color: '#fff',
              marginBottom: '1.5rem', display: 'grid',
              gridTemplateColumns: '1fr 1fr', gap: '2rem'
            }} className="weather-grid">
              <div>
                <div style={{ fontSize: '14px', color: '#A8D5B5', marginBottom: '8px', fontWeight: '600' }}>
                  📍 {city}, India
                </div>
                <div style={{ fontSize: '80px', lineHeight: 1, marginBottom: '8px' }}>
                  {WEATHER_ICONS[weather.weather?.[0]?.main] || '🌤️'}
                </div>
                <div style={{ fontSize: '64px', fontWeight: '700', fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                  {Math.round(weather.main?.temp)}°C
                </div>
                <div style={{ fontSize: '18px', color: '#A8D5B5', marginTop: '8px', textTransform: 'capitalize' }}>
                  {weather.weather?.[0]?.description}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                  {t('weather.feel')} {Math.round(weather.main?.feels_like)}°C
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                {[
                  { label: t('weather.humidity'), val: `${weather.main?.humidity}%`, icon: '💧' },
                  { label: t('weather.wind'), val: `${Math.round(weather.wind?.speed * 3.6)} km/h`, icon: '🌬️' },
                  { label: t('weather.visibility'), val: `${Math.round((weather.visibility || 0) / 1000)} km`, icon: '👁️' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', background: 'rgba(255,255,255,0.12)',
                      borderRadius: '12px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '20px', flexShrink: 0
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#A8D5B5' }}>{item.label}</div>
                      <div style={{ fontSize: '18px', fontWeight: '700' }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming Tip */}
            {tip && (
              <div style={{
                background: '#fff', borderRadius: '16px', padding: '1.5rem',
                border: `2px solid ${tip.color}20`, marginBottom: '1.5rem',
                display: 'flex', gap: '16px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '48px', height: '48px', background: `${tip.color}15`,
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '24px', flexShrink: 0
                }}>{tip.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: tip.color, marginBottom: '6px' }}>
                    {t('weather.tip_title')}
                  </div>
                  <p style={{ fontSize: '15px', color: '#1B4D2E', lineHeight: '1.6', fontWeight: '500' }}>{tip.tip}</p>
                </div>
              </div>
            )}

            {/* 5-day forecast */}
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #C8E6C9', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1B4D2E', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#EAF5EC', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📅</span>
                {t('weather.forecast')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }} className="forecast-grid">
                {dailyForecast.map((day, i) => {
                  const date = new Date(day.dt * 1000);
                  return (
                    <div key={i} style={{
                      background: '#F5FBF5', borderRadius: '14px', padding: '1rem',
                      textAlign: 'center', border: '1px solid #C8E6C9'
                    }}>
                      <div style={{ fontSize: '12px', color: '#5A8C6A', fontWeight: '600', marginBottom: '8px' }}>
                        {i === 0 ? 'Today' : DAYS[date.getDay()]}
                      </div>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                        {WEATHER_ICONS[day.weather?.[0]?.main] || '🌤️'}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#1B4D2E' }}>
                        {Math.round(day.main?.temp)}°
                      </div>
                      <div style={{ fontSize: '10px', color: '#5A8C6A', marginTop: '4px', textTransform: 'capitalize' }}>
                        {day.weather?.[0]?.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
