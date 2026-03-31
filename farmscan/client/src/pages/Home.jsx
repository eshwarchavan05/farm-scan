import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const Home = () => {
  const { t } = useLang();
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'all 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  const steps = [
    { icon: '📸', title: t('home.step1_title'), desc: t('home.step1_desc'), num: '01' },
    { icon: '🤖', title: t('home.step2_title'), desc: t('home.step2_desc'), num: '02' },
    { icon: '✅', title: t('home.step3_title'), desc: t('home.step3_desc'), num: '03' },
  ];

  const features = [
    { icon: '🔬', title: t('home.feat1_title'), desc: t('home.feat1_desc'), color: '#E8F5E9' },
    { icon: '👨‍⚕️', title: t('home.feat2_title'), desc: t('home.feat2_desc'), color: '#E3F2FD' },
    { icon: '🌦️', title: t('home.feat3_title'), desc: t('home.feat3_desc'), color: '#FFF3E0' },
    { icon: '🌾', title: t('home.feat4_title'), desc: t('home.feat4_desc'), color: '#F1F8E9' },
  ];

  const stats = [
    { val: '50K+', label: t('home.stats_scans') },
    { val: '38', label: t('home.stats_diseases') },
    { val: '12K+', label: t('home.stats_farmers') },
    { val: '94%', label: t('home.stats_accuracy') },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Nunito:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-btn { transition: all 0.25s ease; }
        .hero-btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .step-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
        .feat-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
        @media (max-width: 768px) {
          .hero-btns { flex-direction: column !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-title { font-size: 42px !important; }
        }
      `}</style>

      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(10,40,20,0.72), rgba(10,40,20,0.60)),
          url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop') center/cover no-repeat`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 2rem 4rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(transparent, #F4F9F1)'
        }} />
        <div ref={heroRef} style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(110,191,138,0.2)',
            border: '1px solid rgba(110,191,138,0.5)', borderRadius: '20px',
            padding: '6px 18px', fontSize: '13px', color: '#A8D5B5',
            marginBottom: '24px', fontWeight: '600', letterSpacing: '0.5px'
          }}>🌿 AI-POWERED CROP HEALTH PLATFORM</div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '68px', fontWeight: '900', lineHeight: '1.1',
            color: '#fff', marginBottom: '16px'
          }} className="hero-title">
            {t('home.hero_title')}<br />
            <span style={{ color: '#6DBF8A' }}>{t('home.hero_subtitle')}</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.7', marginBottom: '40px', maxWidth: '580px', margin: '0 auto 40px'
          }}>{t('home.hero_desc')}</p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} className="hero-btns">
            <Link to="/scan" style={{ textDecoration: 'none' }}>
              <button className="hero-btn" style={{
                background: 'linear-gradient(135deg, #2E7D4F, #4CAF50)',
                color: '#fff', border: 'none', padding: '16px 36px',
                borderRadius: '50px', fontSize: '16px', fontWeight: '700',
                cursor: 'pointer', letterSpacing: '0.3px'
              }}>📸 {t('home.cta_scan')}</button>
            </Link>
            <Link to="/doctor" style={{ textDecoration: 'none' }}>
              <button className="hero-btn" style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)',
                padding: '16px 36px', borderRadius: '50px',
                fontSize: '16px', fontWeight: '700', cursor: 'pointer'
              }}>🤖 {t('home.cta_doctor')}</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: '#1B4D2E', padding: '3rem 2rem' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center'
        }} className="stats-grid">
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#6DBF8A', fontFamily: "'Playfair Display', serif" }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#F4F9F1', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#1B4D2E', fontWeight: '700' }}>{t('home.how_title')}</h2>
            <div style={{ width: '60px', height: '4px', background: '#4CAF50', margin: '12px auto 0', borderRadius: '2px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card" style={{
                background: '#fff', borderRadius: '20px', padding: '2.5rem 2rem',
                textAlign: 'center', border: '1px solid #C8E6C9', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '16px', right: '20px',
                  fontSize: '52px', fontWeight: '900', color: 'rgba(46,125,79,0.07)',
                  fontFamily: "'Playfair Display', serif", lineHeight: 1
                }}>{s.num}</div>
                <div style={{ fontSize: '44px', marginBottom: '16px' }}>{s.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1B4D2E', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#5A8C6A', lineHeight: '1.6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{
        padding: '5rem 2rem',
        background: `linear-gradient(rgba(27,77,46,0.92), rgba(27,77,46,0.88)),
          url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&auto=format&fit=crop') center/cover`
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#fff', fontWeight: '700' }}>{t('home.features_title')}</h2>
            <div style={{ width: '60px', height: '4px', background: '#6DBF8A', margin: '12px auto 0', borderRadius: '2px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }} className="feat-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-card" style={{
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(110,191,138,0.2)', borderRadius: '16px',
                padding: '2rem 1.5rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: '#F4F9F1', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌾</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#1B4D2E', marginBottom: '16px', fontWeight: '700' }}>
            Ready to protect your crops?
          </h2>
          <p style={{ color: '#5A8C6A', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7' }}>
            Join thousands of farmers already using FarmScan to detect diseases early and save their harvest.
          </p>
          <Link to="/scan" style={{ textDecoration: 'none' }}>
            <button className="hero-btn" style={{
              background: 'linear-gradient(135deg, #2E7D4F, #4CAF50)',
              color: '#fff', border: 'none', padding: '16px 48px',
              borderRadius: '50px', fontSize: '16px', fontWeight: '700', cursor: 'pointer'
            }}>📸 {t('home.cta_scan')}</button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1B4D2E', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌿 FarmScan</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>© 2024 FarmScan. Built for Indian farmers with ❤️</p>
      </div>
    </div>
  );
};

export default Home;
