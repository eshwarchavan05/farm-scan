from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# Disease info database
DISEASE_INFO = {
    "Tomato___Early_blight": {
        "disease": "Early Blight",
        "scientific_name": "Alternaria solani",
        "severity": "High",
        "affected_area": "~35% of leaf",
        "spread": "Wind, water splash",
        "treatment": "Spray Mancozeb (2g/L) every 7 days. Remove infected leaves immediately. Avoid overhead watering. Apply copper-based fungicide as preventive measure. Ensure proper plant spacing for air circulation."
    },
    "Tomato___Late_blight": {
        "disease": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "severity": "High",
        "affected_area": "~50% of plant",
        "spread": "Wind, rain",
        "treatment": "Apply Metalaxyl + Mancozeb immediately. Remove and destroy infected parts. Avoid wetting foliage. Spray every 5-7 days during wet weather. Use resistant varieties next season."
    },
    "Tomato___Leaf_Mold": {
        "disease": "Leaf Mold",
        "scientific_name": "Passalora fulva",
        "severity": "Medium",
        "affected_area": "~20% of leaf",
        "spread": "Airborne spores",
        "treatment": "Improve ventilation and reduce humidity. Apply Chlorothalonil fungicide. Remove heavily infected leaves. Water at base of plants only."
    },
    "Tomato___Septoria_leaf_spot": {
        "disease": "Septoria Leaf Spot",
        "scientific_name": "Septoria lycopersici",
        "severity": "Medium",
        "affected_area": "~25% of leaf",
        "spread": "Water splash, tools",
        "treatment": "Apply Chlorothalonil or Mancozeb. Remove infected lower leaves. Mulch soil to prevent spore splash. Avoid working in wet garden."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "disease": "Spider Mites",
        "scientific_name": "Tetranychus urticae",
        "severity": "Medium",
        "affected_area": "~30% of plant",
        "spread": "Wind, contact",
        "treatment": "Spray Abamectin or Neem oil solution. Increase humidity around plants. Introduce predatory mites as biological control. Repeat spray every 5 days."
    },
    "Tomato___Target_Spot": {
        "disease": "Target Spot",
        "scientific_name": "Corynespora cassiicola",
        "severity": "Medium",
        "affected_area": "~20% of leaf",
        "spread": "Wind, rain splash",
        "treatment": "Apply Azoxystrobin or Chlorothalonil. Remove infected debris. Improve air circulation between plants."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "disease": "Yellow Leaf Curl Virus",
        "scientific_name": "Tomato yellow leaf curl virus",
        "severity": "High",
        "affected_area": "Whole plant",
        "spread": "Whiteflies",
        "treatment": "Control whitefly population with Imidacloprid. Remove and destroy infected plants. Use reflective mulch to repel whiteflies. Plant resistant varieties."
    },
    "Tomato___Tomato_mosaic_virus": {
        "disease": "Mosaic Virus",
        "scientific_name": "Tomato mosaic virus",
        "severity": "High",
        "affected_area": "Whole plant",
        "spread": "Aphids, contact",
        "treatment": "No cure available. Remove infected plants immediately. Control aphid vectors. Disinfect tools. Use virus-free seeds next season."
    },
    "Tomato___healthy": {
        "disease": "Healthy",
        "healthy": True
    },
    "Potato___Early_blight": {
        "disease": "Early Blight",
        "scientific_name": "Alternaria solani",
        "severity": "Medium",
        "affected_area": "~30% of leaf",
        "spread": "Wind, rain",
        "treatment": "Apply Mancozeb 75 WP at 2g/L water. Spray every 10 days. Avoid excessive nitrogen fertilizer. Practice crop rotation."
    },
    "Potato___Late_blight": {
        "disease": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "severity": "High",
        "affected_area": "~60% of plant",
        "spread": "Wind, rain",
        "treatment": "Spray Metalaxyl + Mancozeb immediately. Destroy infected haulms before harvest. Store tubers in cool dry place. Use certified disease-free seed potatoes."
    },
    "Potato___healthy": {
        "disease": "Healthy",
        "healthy": True
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "disease": "Gray Leaf Spot",
        "scientific_name": "Cercospora zeae-maydis",
        "severity": "Medium",
        "affected_area": "~25% of leaf",
        "spread": "Wind, rain",
        "treatment": "Apply Azoxystrobin fungicide. Plant resistant hybrids. Rotate crops with non-host crops. Till crop residue after harvest."
    },
    "Corn_(maize)___Common_rust_": {
        "disease": "Common Rust",
        "scientific_name": "Puccinia sorghi",
        "severity": "Medium",
        "affected_area": "~20% of leaf",
        "spread": "Wind",
        "treatment": "Apply Propiconazole or Mancozeb. Plant rust-resistant varieties. Early planting to avoid peak rust season. Monitor regularly."
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "disease": "Northern Leaf Blight",
        "scientific_name": "Exserohilum turcicum",
        "severity": "High",
        "affected_area": "~40% of leaf",
        "spread": "Wind, rain",
        "treatment": "Apply Azoxystrobin + Propiconazole. Use resistant hybrids. Rotate with soybean or wheat. Remove crop debris."
    },
    "Corn_(maize)___healthy": {
        "disease": "Healthy",
        "healthy": True
    },
    "Rice___Leaf_scald": {
        "disease": "Leaf Scald",
        "scientific_name": "Microdochium oryzae",
        "severity": "Medium",
        "affected_area": "~20% of leaf",
        "spread": "Wind, water",
        "treatment": "Apply Isoprothiolane or Propiconazole. Avoid excess nitrogen. Improve field drainage. Use certified seeds."
    },
    "Rice___Brown_spot": {
        "disease": "Brown Spot",
        "scientific_name": "Bipolaris oryzae",
        "severity": "Medium",
        "affected_area": "~25% of leaf",
        "spread": "Wind, infected seeds",
        "treatment": "Treat seeds with hot water (52°C for 10 min). Apply Mancozeb or Edifenphos. Improve soil potassium and silicon nutrition."
    },
    "Wheat___healthy": {
        "disease": "Healthy",
        "healthy": True
    },
    "Wheat___Leaf_rust": {
        "disease": "Leaf Rust",
        "scientific_name": "Puccinia triticina",
        "severity": "High",
        "affected_area": "~40% of leaf",
        "spread": "Wind",
        "treatment": "Apply Propiconazole or Tebuconazole at first sign. Use rust-resistant varieties. Early sowing to avoid rust season peak."
    }
}

# Class names matching PlantVillage dataset order
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
    'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot',
    'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# Load model (will load once on startup)
MODEL = None

def load_model():
    global MODEL
    model_path = os.path.join(os.path.dirname(__file__), 'model', 'plant_disease_model.h5')
    if os.path.exists(model_path):
        MODEL = tf.keras.models.load_model(model_path)
        print('✅ ML model loaded successfully')
    else:
        print('⚠️  Model file not found. Download it first using download_model.py')

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

def get_disease_info(class_name, confidence):
    info = DISEASE_INFO.get(class_name)
    if info:
        result = dict(info)
        result['confidence'] = round(confidence * 100, 1)
        if not result.get('healthy'):
            result['healthy'] = False
        return result
    # Fallback for classes not in our info dict
    parts = class_name.split('___')
    disease_name = parts[1].replace('_', ' ') if len(parts) > 1 else class_name
    is_healthy = 'healthy' in class_name.lower()
    return {
        'disease': 'Healthy' if is_healthy else disease_name,
        'healthy': is_healthy,
        'confidence': round(confidence * 100, 1),
        'severity': 'Low' if is_healthy else 'Medium',
        'affected_area': 'None' if is_healthy else 'Unknown',
        'spread': 'N/A' if is_healthy else 'Unknown',
        'scientific_name': '',
        'treatment': 'Consult your local agriculture officer for treatment advice.' if not is_healthy else ''
    }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': MODEL is not None})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        image_bytes = image_file.read()

        if MODEL is None:
            # Return mock response if model not loaded yet
            return jsonify({
                'disease': 'Early Blight',
                'scientific_name': 'Alternaria solani',
                'confidence': 94.2,
                'severity': 'High',
                'affected_area': '~35% of leaf',
                'spread': 'Wind, water splash',
                'treatment': 'Spray Mancozeb (2g/L) every 7 days. Remove infected leaves. Avoid overhead watering.',
                'healthy': False,
                'note': 'Model not loaded. This is a demo response.'
            })

        img_array = preprocess_image(image_bytes)
        predictions = MODEL.predict(img_array)
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        class_name = CLASS_NAMES[predicted_idx]

        result = get_disease_info(class_name, confidence)
        return jsonify(result)

    except Exception as e:
        print(f'Prediction error: {e}')
        return jsonify({'error': 'Prediction failed. Please try again.'}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=8000, debug=False)
