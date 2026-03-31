import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LangContext';
import BASE_URL from '../api';

const CROPS = ['Tomato', 'Potato', 'Corn', 'Wheat', 'Rice', 'Apple', 'Grape', 'Pepper', 'Strawberry', 'Peach'];
const SEVERITY_COLOR = { High: '#EF4444', Medium: '#F97316', Low: '#22C55E' };
const SEVERITY_BG = { High: '#FEF2F2', Medium: '#FFF7ED', Low: '#F0FDF4' };

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

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
    onDrop, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('crop', crop);
      const res = await axios.post(`${BASE_URL}/api/scan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 40000,
      });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(msg || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); setError(''); };

  return (
    <div style={{ minHeight: '100vh', background: '#F0FDF4', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        .crop-pill { transition: all 0.2s ease; cursor: pointer; }
        .crop-pill:hover { border-color: #16A34A !important; color: #16A34A !important; transform: translateY(-1px); }
        .scan-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 10px 32px rgba(22,163,74,0.45) !important; }
        @media (max-width: 768px) { .scan-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, rgba(5,18,10,0.92) 0%, rgba(12,40,22,0.85) 100%),
          url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&auto=format&fit=crop') center/cover`,
        padding: '130px 2rem 70px', textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#4ADE80', letterSpacing: '2px', marginBottom: '14px' }}>AI DISEASE DETECTION</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '52px', color: '#fff',
            fontWeight: '700', marginBottom: '14px', letterSpacing: '-0.5px',
          }}>{t('scan.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
            {t('scan.subtitle')}
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '3rem 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
          className="scan-grid"
        >
          {/* Left: Upload */}
          <div style={{
            background: '#fff', borderRadius: '24px', padding: '2rem',
            border: '1px solid #DCFCE7', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#0D2B1A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#DCFCE7', width: '32px', height: '32px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>📸</span>
              Upload Crop Image
            </h2>

            {/* Drop Zone */}
            <div {...getRootProps()} style={{
              border: `2px dashed ${isDragActive ? '#16A34A' : '#BBF7D0'}`,
              borderRadius: '16px', padding: '2.5rem 1.5rem', textAlign: 'center',
              background: isDragActive ? '#F0FDF4' : '#FAFFFE',
              cursor: 'pointer', transition: 'all 0.25s ease', marginBottom: '1.5rem',
            }}>
              <input {...getInputProps()} />
              {preview ? (
                <div>
                  <img src={preview} alt="preview" style={{
                    maxHeight: '180px', maxWidth: '100%', borderRadius: '12px',
                    objectFit: 'cover', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }} />
                  <p style={{ fontSize: '12px', color: '#4ADE80', marginTop: '10px', fontWeight: '600' }}>✓ Image ready</p>
                </div>
              ) : (
                <>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '14px',
                    background: '#DCFCE7', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '24px', margin: '0 auto 14px',
                  }}>🌿</div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#0D2B1A', marginBottom: '6px' }}>
                    {isDragActive ? 'Drop it here!' : t('scan.drop_title')}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6B9E7E' }}>{t('scan.drop_sub')}</p>
                </>
              )}
            </div>

            {/* Crop Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#4B7A5E', marginBottom: '10px', letterSpacing: '0.3px' }}>
                SELECT CROP TYPE
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CROPS.map(c => (
                  <button key={c} onClick={() => setCrop(c)} className="crop-pill" style={{
                    padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: '500',
                    border: `1.5px solid ${crop === c ? '#16A34A' : '#DCFCE7'}`,
                    background: crop === c ? '#16A34A' : '#fff',
                    color: crop === c ? '#fff' : '#4B7A5E',
                    fontFamily: "'Inter', sans-serif",
                  }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleScan}
                disabled={!image || loading}
                className="scan-btn"
                style={{
                  flex: 1, background: (!image || loading) ? '#BBF7D0' : 'linear-gradient(135deg, #16A34A, #15803D)',
                  color: (!image || loading) ? '#6B9E7E' : '#fff', border: 'none',
                  borderRadius: '14px', padding: '14px', fontSize: '15px',
                  fontWeight: '700', cursor: (!image || loading) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s ease', fontFamily: "'Inter', sans-serif",
                  boxShadow: (!image || loading) ? 'none' : '0 4px 20px rgba(22,163,74,0.35)',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Analyzing...
                  </span>
                ) : `🔬 ${t('scan.btn')}`}
              </motion.button>
              {preview && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={reset}
                  style={{
                    background: '#FEF2F2', color: '#EF4444', border: '1.5px solid #FECACA',
                    borderRadius: '14px', padding: '14px 18px', fontSize: '14px',
                    fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  }}
                >↺</motion.button>
              )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                marginTop: '12px', padding: '12px 16px', borderRadius: '12px',
                background: '#FEF2F2', border: '1px solid #FECACA',
                fontSize: '13px', color: '#DC2626', fontWeight: '500',
              }}>⚠️ {error}</motion.div>
            )}
          </div>

          {/* Right: Result */}
          <div>
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{
                    background: '#fff', borderRadius: '24px', padding: '3rem 2rem',
                    border: '1px solid #DCFCE7', textAlign: 'center', height: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '20px',
                    background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '36px', margin: '0 auto 20px',
                  }}>🔬</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0D2B1A', marginBottom: '10px' }}>Awaiting Analysis</h3>
                  <p style={{ color: '#6B9E7E', fontSize: '14px', lineHeight: '1.7', maxWidth: '240px' }}>
                    Upload a crop image and click Scan to get instant AI diagnosis
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: '#fff', borderRadius: '24px', padding: '2rem',
                    border: '1px solid #DCFCE7', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    marginBottom: '1.5rem', gap: '12px',
                  }}>
                    <div>
                      <div style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: '100px',
                        background: result.healthy ? '#F0FDF4' : '#FEF2F2',
                        color: result.healthy ? '#16A34A' : '#DC2626',
                        fontSize: '12px', fontWeight: '700', marginBottom: '8px',
                        border: `1px solid ${result.healthy ? '#BBF7D0' : '#FECACA'}`,
                      }}>
                        {result.healthy ? '✓ HEALTHY' : '⚠ DISEASE DETECTED'}
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0D2B1A', lineHeight: '1.2' }}>
                        {result.disease}
                      </h3>
                      {result.scientific_name && (
                        <p style={{ fontSize: '13px', color: '#6B9E7E', fontStyle: 'italic', marginTop: '4px' }}>
                          {result.scientific_name}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        fontSize: '28px', fontWeight: '800', color: '#16A34A',
                        fontFamily: "'Inter', sans-serif", letterSpacing: '-1px',
                      }}>{Math.round(result.confidence)}%</div>
                      <div style={{ fontSize: '10px', color: '#6B9E7E', fontWeight: '600' }}>CONFIDENCE</div>
                    </div>
                  </div>

                  {/* Stats row */}
                  {result.severity && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      {[
                        { label: 'Severity', val: result.severity, bg: SEVERITY_BG[result.severity], color: SEVERITY_COLOR[result.severity] },
                        result.affected_area && { label: 'Affected Area', val: result.affected_area, bg: '#F8FAFC', color: '#475569' },
                        result.spread && { label: 'Spread', val: result.spread, bg: '#F8FAFC', color: '#475569' },
                      ].filter(Boolean).map((item, i) => (
                        <div key={i} style={{
                          padding: '8px 14px', borderRadius: '10px',
                          background: item.bg, flex: 1, minWidth: '80px',
                        }}>
                          <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '600', marginBottom: '2px' }}>{item.label.toUpperCase()}</div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: item.color }}>{item.val}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Treatment */}
                  {result.treatment && (
                    <div style={{
                      padding: '16px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                      border: '1px solid #BBF7D0',
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: '#16A34A', marginBottom: '8px', letterSpacing: '0.5px' }}>
                        💊 TREATMENT PLAN
                      </p>
                      <p style={{ fontSize: '13px', color: '#1E4D35', lineHeight: '1.7' }}>{result.treatment}</p>
                    </div>
                  )}

                  {result.demo && (
                    <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '12px' }}>
                      Demo mode — ML service not connected
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Scan;
