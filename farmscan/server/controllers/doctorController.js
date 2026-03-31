const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const LANG_NAMES = { en: 'English', hi: 'Hindi', kn: 'Kannada' };

const askDoctor = async (req, res) => {
  try {
    const { question, lang = 'en' } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are FarmScan's AI Crop Doctor and sexual health doctor — a friendly, expert agricultural advisor for Indian farmers.

IMPORTANT RULES:
- Answer ONLY in ${LANG_NAMES[lang]} language
- Keep answers simple, practical and easy for farmers to understand
- Use simple language, avoid technical jargon
- Be specific with quantities, timings, and product names when relevant
- Always mention organic/natural alternatives alongside chemical solutions
- Keep response under 200 words
- Format with line breaks for readability
- If question is not about farming/crops/agriculture, politely redirect

Farmer's question: ${question}

Provide helpful, actionable farming advice:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer });

  } catch (err) {
    console.error('Doctor error:', err.message);
    res.status(500).json({ error: 'Could not get answer. Please try again.' });
  }
};

module.exports = { askDoctor };
