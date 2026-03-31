import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LangContext';

const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: '🏠' },
    { path: '/scan', label: t('nav.scan'), icon: '🔬' },
    { path: '/doctor', label: t('nav.doctor'), icon: '👨‍⚕️' },
    { path: '/weather', label: t('nav.weather'), icon: '🌤️' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        .nav-link { position: relative; }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
          height: 2px; background: #4ADE80; border-radius: 2px;
          transform: scaleX(0); transition: transform 0.25s ease;
        }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-link.active::after { transform: scaleX(1); }
      `}</style>

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: scrolled ? 'rgba(10, 28, 18, 0.96)' : 'rgba(10, 28, 18, 0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(74, 222, 128, 0.12)' : 'none',
          transition: 'all 0.4s ease',
          padding: '0 2rem',
          height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px',
              boxShadow: '0 4px 14px rgba(74,222,128,0.3)',
            }}
          >🌿</motion.div>
          <div>
            <div style={{
              fontSize: '19px', fontWeight: '800', color: '#fff',
              fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px'
            }}>FarmScan</div>
            <div style={{ fontSize: '10px', color: '#4ADE80', marginTop: '-1px', fontWeight: '500' }}>
              {t('nav.tagline')}
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="nav-desktop-links">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -1 }}
                  style={{
                    padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                    color: isActive ? '#4ADE80' : 'rgba(255,255,255,0.75)',
                    background: isActive ? 'rgba(74,222,128,0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent',
                    transition: 'all 0.2s ease', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {link.label}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Switcher */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.06)',
            borderRadius: '12px', padding: '4px', gap: '2px',
            border: '1px solid rgba(74,222,128,0.15)',
          }}>
            {['en', 'hi', 'kn'].map(l => (
              <motion.button
                key={l}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? 'linear-gradient(135deg, #16A34A, #15803D)' : 'transparent',
                  border: 'none', borderRadius: '8px', padding: '5px 12px',
                  fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                  color: lang === l ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s ease', textTransform: 'uppercase',
                  letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif",
                  boxShadow: lang === l ? '0 2px 8px rgba(22,163,74,0.4)' : 'none',
                }}
              >{l}</motion.button>
            ))}
          </div>

          {/* Hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
              color: '#fff', fontSize: '18px', cursor: 'pointer',
              width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center',
            }}
            className="hamburger-btn"
          >
            {menuOpen ? '✕' : '☰'}
          </motion.button>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .nav-desktop-links { display: none !important; }
            .hamburger-btn { display: flex !important; }
          }
        `}</style>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 999,
              background: 'rgba(10,28,18,0.98)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(74,222,128,0.12)',
              padding: '1rem 1.5rem 1.5rem',
            }}
          >
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to={link.path} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px', borderRadius: '12px', marginBottom: '6px',
                      background: isActive ? 'rgba(74,222,128,0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent',
                      color: isActive ? '#4ADE80' : 'rgba(255,255,255,0.8)',
                      fontSize: '15px', fontWeight: '500', fontFamily: "'Inter', sans-serif",
                    }}>
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
