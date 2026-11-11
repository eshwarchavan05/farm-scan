from flask import Flask, jsonify, request
from flask_cors import CORS

from predictor import list_classes, load_model, model_loaded, predict_from_bytes

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model_loaded(),
            "service": "farmscan-ml",
        }
    )


@app.route("/classes", methods=["GET"])
def classes():
    try:
        return jsonify({"classes": list_classes(), "count": len(list_classes())})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    try:
        image_file = request.files.get("image")
        if image_file is None:
            return jsonify({"error": "No image provided. Upload a leaf photo as form field 'image'."}), 400

        image_bytes = image_file.read()
        if not image_bytes:
            return jsonify({"error": "Uploaded file is empty."}), 400

        crop = request.form.get("crop") or request.args.get("crop")
        result = predict_from_bytes(image_bytes, crop=crop)
        return jsonify(result)
    except Exception as exc:
        print(f"Prediction error: {exc}")
        return jsonify({"error": "Prediction failed. Please try a clearer leaf photo."}), 500


load_model()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(__import__("os").environ.get("PORT", 8000)), debug=False)
