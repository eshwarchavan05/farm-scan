import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LangContext';
import BASE_URL from '../api';

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
    { role: 'assistant', text: t('doctor.welcome'), time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (question) => {
    const q = question || input.trim();
    if (!q || loading) return;
    setMessages(prev => [...prev, { role: 'user', text: q, time: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/doctor`, { question: q, lang }, { timeout: 30000 });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.answer, time: new Date() }]);
    } catch (err) {
      const errMsg = err.response?.data?.error;
      let displayMsg = 'Sorry, something went wrong. Please try again.';
      if (errMsg?.includes('API key') || errMsg?.includes('Invalid')) {
        displayMsg = '⚠️ Groq API key issue. Please check your .env file and make sure GROQ_API_KEY is correct.';
      } else if (errMsg?.includes('quota') || err.response?.status === 429) {
        displayMsg = '⚠️ API quota exceeded. Please wait a while or check your billing.';
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network')) {
        displayMsg = '⚠️ Cannot connect to server. Make sure the backend is running on port 5000.';
      } else if (errMsg) {
        displayMsg = errMsg;
      }
      setMessages(prev => [...prev, { role: 'assistant', text: displayMsg, time: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100vh', background: '#F0FDF4', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #BBF7D0; border-radius: 4px; }
        .chip:hover { background: #F0FDF4 !important; border-color: #16A34A !important; color: #16A34A !important; }
        textarea:focus { outline: none !important; border-color: #16A34A !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.1) !important; }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.5);opacity:0.3;} 40%{transform:scale(1);opacity:1;} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
      `}</style>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, rgba(5,18,10,0.92) 0%, rgba(12,40,22,0.85) 100%),
          url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&auto=format&fit=crop') center/cover`,
        padding: '130px 2rem 70px', textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: '100px', padding: '6px 18px', fontSize: '11px',
            color: '#86EFAC', marginBottom: '18px', fontWeight: '700', letterSpacing: '1px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80', display: 'inline-block' }} />
            POWERED BY GROQ AI
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '52px',
            color: '#fff', fontWeight: '700', marginBottom: '14px', letterSpacing: '-0.5px',
          }}>{t('doctor.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
            {t('doctor.subtitle')}
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <p style={{ fontSize: '12px', color: '#4B7A5E', marginBottom: '10px', fontWeight: '700', letterSpacing: '1px' }}>
            QUICK QUESTIONS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                onClick={() => send(s)}
                disabled={loading}
                className="chip"
                style={{
                  background: '#fff', border: '1.5px solid #DCFCE7', borderRadius: '100px',
                  padding: '7px 16px', fontSize: '12px', color: '#4B7A5E', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                  opacity: loading ? 0.5 : 1, fontFamily: "'Inter', sans-serif",
                }}
              >{s}</motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="chat-scroll"
          style={{
            background: '#fff', borderRadius: '24px', border: '1px solid #DCFCE7',
            height: '480px', overflowY: 'auto', padding: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-end' }}
              >
                {m.role === 'assistant' && (
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
                  }}>🌿</div>
                )}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, #16A34A, #15803D)'
                      : '#F8FFF9',
                    color: m.role === 'user' ? '#fff' : '#1E4D35',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '12px 16px', fontSize: '14px', lineHeight: '1.7',
                    border: m.role === 'user' ? 'none' : '1px solid #DCFCE7',
                    whiteSpace: 'pre-wrap', fontWeight: '400',
                    boxShadow: m.role === 'user' ? '0 4px 16px rgba(22,163,74,0.25)' : 'none',
                  }}>{m.text}</div>
                  <div style={{
                    fontSize: '10px', color: '#A8D5B5', marginTop: '4px', fontWeight: '500',
                    textAlign: m.role === 'user' ? 'right' : 'left',
                  }}>{fmt(m.time)}</div>
                </div>
                {m.role === 'user' && (
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    background: '#F0FDF4', border: '2px solid #BBF7D0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                  }}>👨‍🌾</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}
              >
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                }}>🌿</div>
                <div style={{
                  background: '#F8FFF9', borderRadius: '18px 18px 18px 4px',
                  padding: '14px 20px', border: '1px solid #DCFCE7',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(n => (
                    <div key={n} style={{
                      width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80',
                      animation: `bounce 1.2s ${n * 0.2}s infinite ease-in-out`,
                    }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </motion.div>

        {/* Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: '#fff', borderRadius: '20px', border: '1.5px solid #DCFCE7',
            padding: '14px', marginTop: '12px',
            display: 'flex', gap: '12px', alignItems: 'flex-end',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder={t('doctor.placeholder')}
            rows={2}
            style={{
              flex: 1, border: '1.5px solid #DCFCE7', borderRadius: '12px',
              padding: '10px 14px', fontSize: '14px', color: '#1E4D35',
              resize: 'none', fontFamily: "'Inter', sans-serif",
              lineHeight: '1.6', background: '#FAFFFE', transition: 'all 0.2s ease',
            }}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              background: (!input.trim() || loading)
                ? '#DCFCE7'
                : 'linear-gradient(135deg, #16A34A, #15803D)',
              color: (!input.trim() || loading) ? '#6B9E7E' : '#fff',
              border: 'none', borderRadius: '14px', padding: '12px 22px',
              fontSize: '14px', fontWeight: '700', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif",
              boxShadow: (!input.trim() || loading) ? 'none' : '0 4px 16px rgba(22,163,74,0.35)',
            }}
          >
            {loading ? '⏳' : `📤 ${t('doctor.send')}`}
          </motion.button>
        </motion.div>

        <p style={{ fontSize: '12px', color: '#A8D5B5', textAlign: 'center', marginTop: '10px', fontWeight: '500' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default CropDoctor;
