import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/scan', label: t('nav.scan') },
    { path: '/doctor', label: t('nav.doctor') },
    { path: '/weather', label: t('nav.weather') },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(17, 59, 35, 0.97)' : 'rgba(17, 59, 35, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid rgba(110,191,138,0.2)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
      height: '68px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '38px', height: '38px', background: 'linear-gradient(135deg, #4CAF50, #2E7D4F)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px'
        }}>🌿</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.3px' }}>FarmScan</div>
          <div style={{ fontSize: '10px', color: '#6DBF8A', marginTop: '-2px' }}>{t('nav.tagline')}</div>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-desktop">
        {navLinks.map(link => (
          <Link key={link.path} to={link.path} style={{
            textDecoration: 'none', fontSize: '14px', fontWeight: '500',
            color: location.pathname === link.path ? '#6DBF8A' : 'rgba(255,255,255,0.8)',
            borderBottom: location.pathname === link.path ? '2px solid #6DBF8A' : '2px solid transparent',
            paddingBottom: '4px', transition: 'all 0.2s ease'
          }}>{link.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '3px', gap: '2px',
          border: '1px solid rgba(110,191,138,0.3)'
        }}>
          {['en', 'hi', 'kn'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? '#2E7D4F' : 'transparent',
              border: 'none', borderRadius: '16px', padding: '5px 12px',
              fontSize: '11px', fontWeight: '600', cursor: 'pointer',
              color: lang === l ? '#fff' : '#A8D5B5',
              transition: 'all 0.2s ease', textTransform: 'uppercase'
            }}>{l}</button>
          ))}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          color: '#fff', fontSize: '22px', cursor: 'pointer'
        }} className="hamburger">☰</button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
