# 🌿 FarmScan — AI Crop Disease Detector

A farmer-friendly web application that uses AI to detect crop diseases from photos and provides instant treatment advice — in English, Hindi, and Kannada.

---

## 📄 Pages
- **Home** — Landing page with features overview
- **Scan** — Upload crop photo → AI detects disease + treatment
- **Crop Doctor** — AI chat for any farming question (powered by Groq AI)
- **Weather** — Location-based weather + farming tips

## 🌍 Languages Supported
English | Hindi | Kannada

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| ML Model | Python + Flask + TensorFlow |
| Database | MongoDB Atlas |
| AI Chat | Groq AI (llama-3.3-70b-versatile) |
| Weather | OpenWeatherMap API |

---

## ⚙️ Setup Instructions

### Step 1: Get API Keys (All Free)

| API | Link | Time |
|-----|------|------|
| OpenWeatherMap | https://openweathermap.org/api | 2 min |
| Groq AI | https://console.groq.com | 2 min |
| MongoDB Atlas | https://mongodb.com/atlas | 5 min |

---

### Step 2: Setup Backend (Node.js)

```bash
cd server
npm install
node index.js
```

Server runs on: https://farm-scan.onrender.com/

---

### Step 3: Setup Frontend (React)

```bash
cd client
npm install
npm start
```

Frontend runs on: https://farm-scan-sooty.vercel.app

---

### Step 4: Setup ML Service (Python + Flask)

```bash
cd ml-service
pip install -r requirements.txt

# Download PlantVillage dataset from Kaggle:
# https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
# Extract to ml-service/data/plantvillage/

# Train the model (takes ~30-60 min):
python download_model.py train ./data/plantvillage

# Start the Flask server:
python app.py
```

ML service runs on: https://farmscan-ml.onrender.com

> **Note:** The app works in demo mode even without the ML model. It returns sample predictions until the model is loaded.

---

### Step 5: Configure .env file

Create a `.env` file inside the `server/` folder:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/farmscan?appName=Cluster0
GROQ_API_KEY=gsk_your_groq_key_here
OPENWEATHER_API_KEY=your_openweathermap_key_here
ML_SERVICE_URL=https://farmscan-ml.onrender.com
```

---

### Step 6: Kill port if already in use

If you see `EADDRINUSE` error:
```bash
kill -9 $(lsof -t -i:5000)
node index.js
```

---

## 🚀 Deployment

### Frontend → Vercel
1. Push code to GitHub
2. Go to vercel.com → Import repo
3. Set Root Directory: `client`
4. Set Framework: `Create React App`
5. Click Deploy

### Backend → Render
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Set Root Directory: `server`
4. Set Start Command: `node index.js`
5. Add all `.env` variables in Render dashboard

### ML Service → Render (separate service)
1. New Web Service → same repo
2. Set Root Directory: `ml-service`
3. Set Runtime: Python 3
4. Set Start Command: `gunicorn app:app --bind 0.0.0.0:8000`

> **Important:** After deploying backend on Render, replace all `https://farm-scan.onrender.com` in React pages with your Render backend URL before deploying to Vercel.

---

## 📁 Project Structure

```
farmscan/
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx              # Main app with routing
│       ├── index.js
│       ├── components/
│       │   └── Navbar.jsx       # Nav with EN/HI/KN toggle
│       ├── pages/
│       │   ├── Home.jsx         # Landing page
│       │   ├── Scan.jsx         # Crop disease scanner
│       │   ├── CropDoctor.jsx   # Groq AI chat
│       │   └── Weather.jsx      # Weather + farming tips
│       └── i18n/
│           ├── LangContext.jsx  # Language context
│           └── translations.js  # EN/HI/KN translations
│
├── server/                      # Node.js Backend
│   ├── index.js                 # Express server entry point
│   ├── routes/index.js          # All API routes
│   ├── controllers/
│   │   ├── scanController.js    # Image upload + ML call
│   │   ├── doctorController.js  # Groq AI chat
│   │   └── weatherController.js # OpenWeatherMap API
│   ├── models/Scan.js           # MongoDB scan schema
│   └── .env.example             # Environment variables template
│
└── ml-service/                  # Python Flask ML
    ├── app.py                   # Flask prediction server
    ├── download_model.py        # Model training script
    └── requirements.txt         # Python dependencies
```

---

## 🌾 Crop Diseases Supported (38 classes)

Tomato (9), Potato (3), Corn/Maize (4), Apple (4), Grape (4), Pepper (2), Strawberry (2), Peach (2), Rice (2), Wheat (2) — trained on PlantVillage dataset.

---

## 🔑 API Keys Summary

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Groq AI | Crop Doctor AI chat | Unlimited (free) |
| OpenWeatherMap | Weather + farming tips | 1000 calls/day |
| MongoDB Atlas | Store scan history | 512MB free |

---

## 👨‍💻 Built With ❤️ for Indian Farmers# farm-scan
# farm-scan
