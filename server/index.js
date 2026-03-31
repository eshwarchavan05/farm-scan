const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads folder if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'FarmScan backend running ✅' }));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  } else {
    console.warn('⚠️  Client build not found at:', buildPath);
    console.warn('   Run "cd client && npm run build" to create it.');
  }
}

// Start server immediately — MongoDB is optional
app.listen(PORT, () => {
  console.log(`✅ FarmScan server running on http://localhost:${PORT}`);
});

// Try connecting to MongoDB (won't crash server if it fails)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmscan';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.warn('⚠️  MongoDB not connected (scans won\'t be saved, but app still works):', err.message);
  });
