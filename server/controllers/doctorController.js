const Groq = require('groq-sdk');

const LANG_NAMES = { en: 'English', hi: 'Hindi', kn: 'Kannada' };

const askDoctor = async (req, res) => {
  try {
    const { question, lang = 'en' } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are FarmScan's AI Crop Doctor — a friendly expert agricultural advisor for Indian farmers.
RULES:
- Answer ONLY in ${LANG_NAMES[lang] || 'English'} language
- Keep answers simple and practical for farmers
- Avoid technical jargon
- Be specific with quantities, timings, product names
- Mention organic alternatives alongside chemical solutions
- Keep response under 200 words
- If question is not about farming, politely redirect`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const answer = completion.choices[0]?.message?.content || 'Sorry, could not get an answer.';
    res.json({ answer });

  } catch (err) {
    console.error('Groq error:', err.message);
    if (err.message?.includes('API key') || err.status === 401) {
      return res.status(401).json({ error: 'Invalid Groq API key. Please check your .env file.' });
    }
    res.status(500).json({ error: 'Could not get answer. Please try again.' });
  }
};

module.exports = { askDoctor };
