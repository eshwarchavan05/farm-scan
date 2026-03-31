import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useLang } from '../i18n/LangContext';

const CROPS = ['Tomato', 'Potato', 'Corn', 'Wheat', 'Rice', 'Apple', 'Grape', 'Pepper', 'Strawberry', 'Peach'];

const SEVERITY_COLOR = { High: '#E53935', Medium: '#FB8C00', Low: '#43A047' };

const Scan = () => {
  const { t } = useLang();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState('Tomato');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((files) => {
    const file = files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1
  });

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('crop', crop);
      const res = await axios.post('/api/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError('Failed to scan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F9F1', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .scan-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        @media (max-width: 768px) { .scan-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(rgba(10,40,20,0.80), rgba(10,40,20,0.70)),
          url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&auto=format&fit=crop') center/cover`,
        padding: '120px 2rem 60px', textAlign: 'center'
      }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#fff', fontWeight: '700', marginBottom: '12px' }}>
          {t('scan.title')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>{t('scan.subtitle')}</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="scan-grid">

          {/* Upload Side */}
          <div>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #C8E6C9', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1B4D2E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#EAF5EC', width: '32px', height: '32px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📷</span>
                Upload Photo
              </h2>

              {!preview ? (
                <div {...getRootProps()} style={{
                  border: `2px dashed ${isDragActive ? '#2E7D4F' : '#A5D6A7'}`,
                  borderRadius: '16px', background: isDragActive ? '#E8F5E9' : '#F5FBF5',
                  padding: '3rem 1rem', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input {...getInputProps()} />
                  <div style={{ fontSize: '52px', marginBottom: '12px' }}>🌿</div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#1B4D2E', marginBottom: '6px' }}>{t('scan.upload_title')}</p>
                  <p style={{ fontSize: '13px', color: '#5A8C6A', marginBottom: '16px' }}>{t('scan.upload_sub')}</p>
                  <button style={{
                    background: '#2E7D4F', color: '#fff', border: 'none',
                    padding: '10px 24px', borderRadius: '25px', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer'
                  }}>{t('scan.upload_btn')}</button>
                  <p style={{ fontSize: '11px', color: '#A5D6A7', marginTop: '12px' }}>JPG, PNG, WEBP · Max 10MB</p>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="crop" style={{
                    width: '100%', height: '220px', objectFit: 'cover',
                    borderRadius: '12px', border: '2px solid #C8E6C9'
                  }} />
                  <button onClick={reset} style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                    borderRadius: '50%', width: '30px', height: '30px',
                    cursor: 'pointer', fontSize: '14px'
                  }}>✕</button>
                </div>
              )}
            </div>

            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #C8E6C9', padding: '1.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1B4D2E', display: 'block', marginBottom: '8px' }}>
                {t('scan.crop_label')}
              </label>
              <select value={crop} onChange={e => setCrop(e.target.value)} style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: '1.5px solid #C8E6C9', fontSize: '14px', color: '#1B4D2E',
                background: '#F5FBF5', marginBottom: '16px', outline: 'none', cursor: 'pointer'
              }}>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>

              <button onClick={handleScan} disabled={!image || loading} className="scan-btn" style={{
                width: '100%', background: (!image || loading) ? '#A5D6A7' : 'linear-gradient(135deg, #2E7D4F, #4CAF50)',
                color: '#fff', border: 'none', padding: '14px',
                borderRadius: '50px', fontSize: '15px', fontWeight: '700',
                cursor: (!image || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease'
              }}>
                {loading ? `⏳ ${t('scan.scanning')}` : `🔍 ${t('scan.scan_btn')}`}
              </button>

              {error && <p style={{ color: '#E53935', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
            </div>
          </div>

          {/* Result Side */}
          <div>
            {!result ? (
              <div style={{
                background: '#fff', borderRadius: '20px', border: '1px solid #C8E6C9',
                padding: '3rem 2rem', textAlign: 'center', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.4 }}>🔬</div>
                <p style={{ fontSize: '15px', color: '#A5D6A7', fontWeight: '500' }}>
                  Upload a crop photo and click scan to see results here
                </p>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #C8E6C9', padding: '2rem' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1B4D2E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#EAF5EC', width: '32px', height: '32px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔬</span>
                  {t('scan.result_title')}
                </h2>

                {result.healthy ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '64px', marginBottom: '12px' }}>✅</div>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#2E7D4F' }}>{t('scan.healthy')}</p>
                  </div>
                ) : (
                  <>
                    <div style={{
                      background: '#FFF3F3', borderRadius: '12px', padding: '1rem',
                      border: '1px solid #FFCDD2', marginBottom: '1.5rem'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#C62828', marginBottom: '4px' }}>
                        {result.disease}
                      </div>
                      <div style={{ fontSize: '13px', color: '#E57373' }}>
                        {result.scientific_name} · {crop}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                      {[
                        { label: t('scan.confidence'), val: `${result.confidence}%` },
                        { label: t('scan.severity'), val: result.severity, color: SEVERITY_COLOR[result.severity] },
                        { label: t('scan.affected'), val: result.affected_area },
                        { label: 'Spreads via', val: result.spread },
                      ].map((item, i) => (
                        <div key={i} style={{ background: '#F5FBF5', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#5A8C6A', marginBottom: '4px' }}>{item.label}</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: item.color || '#1B4D2E' }}>{item.val}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      background: '#FFFDE7', borderRadius: '12px', padding: '1rem',
                      border: '1px solid #FFF176', marginBottom: '1.5rem'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#F57F17', marginBottom: '6px' }}>💊 {t('scan.treatment')}</div>
                      <p style={{ fontSize: '13px', color: '#5D4037', lineHeight: '1.7' }}>{result.treatment}</p>
                    </div>

                    <button onClick={reset} style={{
                      width: '100%', background: 'transparent', border: '1.5px solid #2E7D4F',
                      color: '#2E7D4F', padding: '12px', borderRadius: '50px',
                      fontSize: '14px', fontWeight: '700', cursor: 'pointer'
                    }}>🔄 {t('scan.scan_again')}</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
