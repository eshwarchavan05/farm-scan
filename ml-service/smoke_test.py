"""Load the model and run a prediction against a generated RGB image."""

import io

from PIL import Image

from predictor import list_classes, load_model, predict_from_bytes


if __name__ == "__main__":
    load_model()
    classes = list_classes()
    if len(classes) != 38:
        raise SystemExit(f"Expected 38 classes, got {len(classes)}")
    buf = io.BytesIO()
    Image.new("RGB", (224, 224), (34, 139, 34)).save(buf, format="JPEG")
    result = predict_from_bytes(buf.getvalue(), crop="Tomato")
    print(result)
    required = {"disease", "confidence", "class_name", "healthy", "treatment"}
    missing = required - set(result)
    if missing:
        raise SystemExit(f"Missing fields: {missing}")
    print("Smoke test passed")
