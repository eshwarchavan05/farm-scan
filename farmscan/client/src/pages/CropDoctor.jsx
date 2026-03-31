import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLang } from '../i18n/LangContext';

const SUGGESTIONS = [
  "Why are my tomato leaves turning yellow?",
  "When is the best time to sow wheat?",
  "How do I treat powdery mildew on grapes?",
  "What fertilizer is best for rice crops?",
  "How to protect crops from frost?",
];

const CropDoctor = () => {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t('doctor.welcome'), time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (question) => {
    const q = question || input.trim();
    if (!q) return;
    setMessages(prev => [...prev, { role: 'user', text: q, time: new Date() }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/api/doctor', { question: q, lang });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.answer, time: new Date() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I could not connect right now. Please check your internet and try again.',
        time: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100vh', background: '#F4F9F1', fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .msg-bubble { animation: fadeUp 0.3s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        textarea:focus { outline: none; border-color: #2E7D4F !important; }
        .suggestion:hover { background: #E8F5E9 !important; border-color: #4CAF50 !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(rgba(10,40,20,0.82), rgba(10,40,20,0.72)),
          url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&auto=format&fit=crop') center/cover`,
        padding: '120px 2rem 60px', textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(110,191,138,0.2)',
          border: '1px solid rgba(110,191,138,0.4)', borderRadius: '20px',
          padding: '5px 16px', fontSize: '12px', color: '#A8D5B5',
          marginBottom: '16px', fontWeight: '600'
        }}>👨‍⚕️ AI POWERED</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#fff', fontWeight: '700', marginBottom: '12px' }}>
          {t('doctor.title')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>{t('doctor.subtitle')}</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {/* Suggestion chips */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '13px', color: '#5A8C6A', marginBottom: '10px', fontWeight: '600' }}>💡 Quick questions:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)} className="suggestion" style={{
                background: '#fff', border: '1px solid #C8E6C9', borderRadius: '20px',
                padding: '7px 16px', fontSize: '12px', color: '#2E7D4F',
                fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease'
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{
          background: '#fff', borderRadius: '20px', border: '1px solid #C8E6C9',
          height: '460px', overflowY: 'auto', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '16px',
          scrollbarWidth: 'thin'
        }}>
          {messages.map((m, i) => (
            <div key={i} className="msg-bubble" style={{
              display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '10px', alignItems: 'flex-end'
            }}>
              {m.role === 'assistant' && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2E7D4F, #4CAF50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0
                }}>🌿</div>
              )}
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  background: m.role === 'user' ? 'linear-gradient(135deg, #2E7D4F, #4CAF50)' : '#F5FBF5',
                  color: m.role === 'user' ? '#fff' : '#1B4D2E',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '12px 16px', fontSize: '14px', lineHeight: '1.6',
                  border: m.role === 'user' ? 'none' : '1px solid #C8E6C9'
                }}>{m.text}</div>
                <div style={{ fontSize: '10px', color: '#A5D6A7', marginTop: '4px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                  {fmt(m.time)}
                </div>
              </div>
              {m.role === 'user' && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#EAF5EC', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px', flexShrink: 0
                }}>👨‍🌾</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2E7D4F, #4CAF50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}>🌿</div>
              <div style={{
                background: '#F5FBF5', borderRadius: '18px 18px 18px 4px',
                padding: '12px 20px', border: '1px solid #C8E6C9',
                display: 'flex', gap: '4px', alignItems: 'center'
              }}>
                {[0, 1, 2].map(n => (
                  <div key={n} style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50',
                    animation: `bounce 1.2s ${n * 0.2}s infinite ease-in-out`
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          background: '#fff', borderRadius: '16px', border: '1px solid #C8E6C9',
          padding: '1rem', marginTop: '1rem',
          display: 'flex', gap: '12px', alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={t('doctor.placeholder')}
            rows={2}
            style={{
              flex: 1, border: '1.5px solid #C8E6C9', borderRadius: '10px',
              padding: '10px 14px', fontSize: '14px', color: '#1B4D2E',
              resize: 'none', fontFamily: "'Nunito', sans-serif", lineHeight: '1.5',
              background: '#F5FBF5'
            }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{
            background: (!input.trim() || loading) ? '#A5D6A7' : 'linear-gradient(135deg, #2E7D4F, #4CAF50)',
            color: '#fff', border: 'none', borderRadius: '12px',
            padding: '12px 20px', fontSize: '14px', fontWeight: '700',
            cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap'
          }}>
            {loading ? '⏳' : `📤 ${t('doctor.send')}`}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#A5D6A7', textAlign: 'center', marginTop: '8px' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CropDoctor;
