import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../i18n/LangContext';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const Section = ({ children, style }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} style={style}>
      {children}
    </motion.div>
  );
};

const Card3D = ({ children, style }) => {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    el.style.boxShadow = `${-x}px ${y}px 40px rgba(0,0,0,0.18)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
  };
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', ...style }}>
      {children}
    </div>
  );
};

const Home = () => {
  const { t } = useLang();

  const steps = [
    { icon: '📸', title: t('home.step1_title'), desc: t('home.step1_desc'), num: '01', color: '#DCFCE7' },
    { icon: '🤖', title: t('home.step2_title'), desc: t('home.step2_desc'), num: '02', color: '#DBEAFE' },
    { icon: '✅', title: t('home.step3_title'), desc: t('home.step3_desc'), num: '03', color: '#FEF9C3' },
  ];

  const features = [
    { icon: '🔬', title: t('home.feat1_title'), desc: t('home.feat1_desc'), gradient: 'linear-gradient(135deg, #16A34A22, #4ADE8011)' },
    { icon: '👨‍⚕️', title: t('home.feat2_title'), desc: t('home.feat2_desc'), gradient: 'linear-gradient(135deg, #2563EB22, #60A5FA11)' },
    { icon: '🌦️', title: t('home.feat3_title'), desc: t('home.feat3_desc'), gradient: 'linear-gradient(135deg, #D9770622, #FB923C11)' },
    { icon: '🌾', title: t('home.feat4_title'), desc: t('home.feat4_desc'), gradient: 'linear-gradient(135deg, #65A30D22, #A3E63511)' },
  ];

  const stats = [
    { val: '50K+', label: t('home.stats_scans'), icon: '📊' },
    { val: '38', label: t('home.stats_diseases'), icon: '🦠' },
    { val: '12K+', label: t('home.stats_farmers'), icon: '👨‍🌾' },
    { val: '94%', label: t('home.stats_accuracy'), icon: '🎯' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F0FDF4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary {
          background: linear-gradient(135deg, #16A34A, #15803D);
          color: #fff; border: none; padding: 15px 36px;
          border-radius: 14px; font-size: 15px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.3px; font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 20px rgba(22,163,74,0.4);
          transition: all 0.25s ease; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(22,163,74,0.5); filter: brightness(1.06); }
        .btn-ghost {
          background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
          color: #fff; border: 1.5px solid rgba(255,255,255,0.3);
          padding: 15px 36px; border-radius: 14px;
          font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.25s ease; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); border-color: rgba(255,255,255,0.5); }
        @media (max-width: 768px) {
          .hero-btns { flex-direction: column !important; align-items: center !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-title { font-size: 42px !important; }
          .hero-section { padding: 130px 1.5rem 5rem !important; }
        }
      `}</style>

      {/* ─── HERO ─── */}
      <div className="hero-section" style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, rgba(5,20,10,0.88) 0%, rgba(10,40,22,0.78) 60%, rgba(5,20,10,0.92) 100%),
          url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop') center/cover no-repeat`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '140px 2rem 6rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(74,222,128,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
          background: 'linear-gradient(transparent, #F0FDF4)',
        }} />

        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(74,222,128,0.12)',
              border: '1px solid rgba(74,222,128,0.3)', borderRadius: '100px',
              padding: '7px 20px', fontSize: '12px', color: '#86EFAC',
              marginBottom: '28px', fontWeight: '600', letterSpacing: '1px',
            }}
          >
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
            AI-POWERED CROP HEALTH PLATFORM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hero-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '72px', fontWeight: '900', lineHeight: '1.08',
              color: '#fff', marginBottom: '20px', letterSpacing: '-1px',
            }}
          >
            {t('home.hero_title')}<br />
            <span style={{
              background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t('home.hero_subtitle')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '18px', color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.8', marginBottom: '44px', maxWidth: '560px', margin: '0 auto 44px',
              fontWeight: '400',
            }}
          >{t('home.hero_desc')}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
            className="hero-btns"
          >
            <Link to="/scan" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">📸 {t('home.cta_scan')}</button>
            </Link>
            <Link to="/doctor" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost">🤖 {t('home.cta_doctor')}</button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div style={{ background: '#0D2B1A', padding: '4rem 2rem' }}>
        <Section style={{
          maxWidth: '960px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', textAlign: 'center'
        }} className="stats-grid">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} style={{
              padding: '1.5rem', borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(74,222,128,0.1)',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{
                fontSize: '38px', fontWeight: '800', color: '#4ADE80',
                fontFamily: "'Inter', sans-serif", letterSpacing: '-1px', lineHeight: 1,
              }}>{s.val}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontWeight: '500' }}>{s.label}</div>
            </motion.div>
          ))}
        </Section>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <div style={{ background: '#F0FDF4', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <Section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <motion.div variants={fadeUp}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#16A34A', letterSpacing: '2px', marginBottom: '12px' }}>SIMPLE PROCESS</p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '42px', color: '#0D2B1A', fontWeight: '700', letterSpacing: '-0.5px',
              }}>{t('home.how_title')}</h2>
              <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg,#16A34A,#4ADE80)', margin: '16px auto 0', borderRadius: '4px' }} />
            </motion.div>
          </Section>

          <Section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }} className="steps-grid">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card3D style={{
                  background: '#fff', borderRadius: '20px', padding: '2.5rem 2rem',
                  textAlign: 'center', border: '1px solid #DCFCE7',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    position: 'absolute', top: '16px', right: '20px',
                    fontSize: '60px', fontWeight: '900',
                    color: 'rgba(22,163,74,0.06)',
                    fontFamily: "'Inter', sans-serif", lineHeight: 1,
                  }}>{s.num}</div>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: s.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px',
                  }}>{s.icon}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0D2B1A', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: '#4B7A5E', lineHeight: '1.7', fontWeight: '400' }}>{s.desc}</p>
                </Card3D>
              </motion.div>
            ))}
          </Section>
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <div style={{
        padding: '6rem 2rem',
        background: `linear-gradient(160deg, rgba(10,30,18,0.95) 0%, rgba(15,50,28,0.92) 100%),
          url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&auto=format&fit=crop') center/cover`,
      }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <Section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <motion.div variants={fadeUp}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#4ADE80', letterSpacing: '2px', marginBottom: '12px' }}>WHAT WE OFFER</p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '42px', color: '#fff', fontWeight: '700', letterSpacing: '-0.5px',
              }}>{t('home.features_title')}</h2>
              <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg,#16A34A,#4ADE80)', margin: '16px auto 0', borderRadius: '4px' }} />
            </motion.div>
          </Section>

          <Section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }} className="feat-grid">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card3D style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(74,222,128,0.12)',
                  borderRadius: '20px', padding: '2rem 1.5rem', textAlign: 'center',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '14px',
                    background: f.gradient, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>{f.icon}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>{f.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7' }}>{f.desc}</p>
                </Card3D>
              </motion.div>
            ))}
          </Section>
        </div>
      </div>

      {/* ─── CTA BANNER ─── */}
      <div style={{ background: '#F0FDF4', padding: '6rem 2rem' }}>
        <Section style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div variants={fadeUp}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(22,163,74,0.15)',
            }}>🌾</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '38px', color: '#0D2B1A', marginBottom: '16px', fontWeight: '700', letterSpacing: '-0.5px',
            }}>
              Ready to protect your crops?
            </h2>
            <p style={{ color: '#4B7A5E', fontSize: '16px', marginBottom: '36px', lineHeight: '1.8', fontWeight: '400' }}>
              Join thousands of farmers already using FarmScan to detect diseases early and save their harvest.
            </p>
            <Link to="/scan" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 48px' }}>
                📸 {t('home.cta_scan')}
              </button>
            </Link>
          </motion.div>
        </Section>
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{ background: '#0D2B1A', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>🌿</div>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px', fontFamily: "'Inter', sans-serif" }}>FarmScan</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
            © 2024 FarmScan · Built for Indian farmers with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
