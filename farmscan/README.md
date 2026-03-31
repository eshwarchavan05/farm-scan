# 🌿 FarmScan — AI Crop Disease Detector

A farmer-friendly web application that uses AI to detect crop diseases from photos and provides instant treatment advice.

---

## 📄 Pages
- **Home** — Landing page with features overview
- **Scan** — Upload crop photo → AI detects disease + treatment
- **Crop Doctor** — AI chat for any farming question (powered by Gemini)
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
| Database | MongoDB |
| AI Chat | Google Gemini API |
| Weather | OpenWeatherMap API |
| Images | Cloudinary |

---

## ⚙️ Setup Instructions

### Step 1: Get API Keys (All Free)

| API | Link | Time |
|-----|------|------|
| OpenWeatherMap | https://openweathermap.org/api | 2 min |
| Gemini AI | https://aistudio.google.com/app/apikey | 2 min |
| Cloudinary | https://cloudinary.com | 3 min |
| MongoDB Atlas | https://mongodb.com/atlas | 5 min |

---

### Step 2: Setup Backend (Node.js)

```bash
cd server
cp .env.example .env
# Edit .env and paste your API keys

npm install
npm run dev
```

Server runs on: http://localhost:5000

---

### Step 3: Setup Frontend (React)

```bash
cd client
npm install
npm start
```

Frontend runs on: http://localhost:3000

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

ML service runs on: http://localhost:8000

> **Note:** The app works in demo mode even without the ML model. It returns sample predictions until the model is loaded.

---

### Step 5: Configure .env file

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmscan
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
OPENWEATHER_API_KEY=your_weather_key
ML_SERVICE_URL=http://localhost:8000
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy build/ folder to Vercel
```

### Backend → Render
- Connect your GitHub repo to Render
- Set environment variables in Render dashboard
- Set start command: `node index.js`

### ML Service → Render (separate service)
- Set start command: `gunicorn app:app --bind 0.0.0.0:8000`
- Set environment: Python 3.10

---

## 📁 Project Structure

```
farmscan/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx            # Main app with routing
│       ├── index.js
│       ├── components/
│       │   └── Navbar.jsx
│       ├── pages/
│       │   ├── Home.jsx       # Landing page
│       │   ├── Scan.jsx       # Crop scanner
│       │   ├── CropDoctor.jsx # AI chat
│       │   └── Weather.jsx    # Weather page
│       └── i18n/
│           ├── LangContext.jsx
│           └── translations.js  # EN/HI/KN translations
│
├── server/                    # Node.js Backend
│   ├── index.js               # Express server
│   ├── routes/index.js        # All API routes
│   ├── controllers/
│   │   ├── scanController.js  # Image upload + ML call
│   │   ├── doctorController.js # Gemini AI chat
│   │   └── weatherController.js # OpenWeatherMap
│   ├── models/Scan.js         # MongoDB schema
│   └── .env.example
│
└── ml-service/                # Python Flask ML
    ├── app.py                 # Flask server + prediction
    ├── download_model.py      # Model training script
    └── requirements.txt
```

---

## 🌾 Crop Diseases Supported (38 classes)

Tomato (9), Potato (3), Corn/Maize (4), Apple (4), Grape (4), Pepper (2), Strawberry (2), Peach (2), Rice (2), Wheat (2), and more from the PlantVillage dataset.

---

## 👨‍💻 Built With ❤️ for Indian Farmers
