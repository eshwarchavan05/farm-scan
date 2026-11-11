"""Load a pretrained PlantVillage classifier and run inference."""

from __future__ import annotations

import io
import os
from functools import lru_cache

os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS", "1")

import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

from disease_info import get_disease_info

MODEL_ID = os.environ.get("MODEL_ID", "neghani/plantvillage-mobilenetv2")
CACHE_DIR = os.path.join(os.path.dirname(__file__), "model_cache")
CONFIDENCE_THRESHOLD = float(os.environ.get("CONFIDENCE_THRESHOLD", "0.40"))
TOP_K = 3

CROP_PREFIXES = {
    "tomato": "Tomato",
    "potato": "Potato",
    "corn": "Corn_(maize)",
    "maize": "Corn_(maize)",
    "apple": "Apple",
    "grape": "Grape",
    "pepper": "Pepper,_bell",
    "bell pepper": "Pepper,_bell",
    "chilli": "Pepper,_bell",
    "chili": "Pepper,_bell",
    "strawberry": "Strawberry",
    "peach": "Peach",
    "cherry": "Cherry_(including_sour)",
    "orange": "Orange",
    "citrus": "Orange",
    "blueberry": "Blueberry",
    "raspberry": "Raspberry",
    "soybean": "Soybean",
    "soya": "Soybean",
    "squash": "Squash",
    "pumpkin": "Squash",
}

_processor = None
_model = None
_device = None


def model_loaded():
    return _model is not None


def load_model():
    global _processor, _model, _device
    if _model is not None:
        return

    os.makedirs(CACHE_DIR, exist_ok=True)
    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Loading plant-disease model {MODEL_ID} on {_device}...")
    _processor = AutoImageProcessor.from_pretrained(MODEL_ID, cache_dir=CACHE_DIR)
    _model = AutoModelForImageClassification.from_pretrained(MODEL_ID, cache_dir=CACHE_DIR)
    _model.to(_device)
    _model.eval()
    print(f"Model loaded with {len(_model.config.id2label)} classes")


def _open_image(image_bytes: bytes) -> Image.Image:
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    return img


def _label_for_index(idx: int) -> str:
    return _model.config.id2label[idx]


def _crop_prefix(crop: str | None) -> str | None:
    if not crop:
        return None
    key = crop.strip().lower()
    if key in ("unknown", "auto", "any", ""):
        return None
    return CROP_PREFIXES.get(key)


def _indices_for_prefix(prefix: str) -> list[int]:
    matches = []
    for idx, label in _model.config.id2label.items():
        if str(label).startswith(prefix):
            matches.append(int(idx))
    return matches


def predict_from_bytes(image_bytes: bytes, crop: str | None = None) -> dict:
    if _model is None:
        load_model()

    image = _open_image(image_bytes)
    inputs = _processor(images=image, return_tensors="pt")
    inputs = {k: v.to(_device) for k, v in inputs.items()}

    with torch.no_grad():
        logits = _model(**inputs).logits
        probs = torch.softmax(logits, dim=-1)[0].cpu()

    prefix = _crop_prefix(crop)
    crop_indices = _indices_for_prefix(prefix) if prefix else []
    crop_supported = bool(crop_indices)

    global_ranked = sorted(range(probs.shape[0]), key=lambda i: float(probs[i]), reverse=True)
    global_idx = global_ranked[0]
    global_score = float(probs[global_idx])

    crop_mismatch = False
    if crop_supported:
        crop_ranked = sorted(crop_indices, key=lambda i: float(probs[i]), reverse=True)
        crop_idx = crop_ranked[0]
        crop_score = float(probs[crop_idx])
        if crop_score >= CONFIDENCE_THRESHOLD or crop_score >= global_score * 0.35:
            ranked_idx = crop_ranked
            top_idx = crop_idx
            top_score = crop_score
        else:
            ranked_idx = global_ranked
            top_idx = global_idx
            top_score = global_score
            crop_mismatch = True
    else:
        ranked_idx = global_ranked
        top_idx = global_idx
        top_score = global_score

    class_name = _label_for_index(top_idx)

    result = get_disease_info(class_name, top_score)
    result["uncertain"] = top_score < CONFIDENCE_THRESHOLD
    result["crop_requested"] = crop or None
    result["crop_supported"] = True if prefix is None else crop_supported
    result["crop_mismatch"] = crop_mismatch
    result["model"] = MODEL_ID

    if result["uncertain"]:
        result["note"] = (
            "Low confidence - take a closer photo of a single leaf in daylight, "
            "fill the frame, and avoid blur. Confirm with a local agriculture officer."
        )

    if prefix and not crop_supported:
        result["crop_supported"] = False
        result["note"] = (
            f"{crop} is not in this model's training set (PlantVillage has no rice/wheat). "
            "Showing the closest match from supported crops instead."
        )

    if crop_mismatch:
        result["note"] = (
            f"The photo does not look like {crop}. Showing the model's best overall match instead."
        )

    alternatives = []
    for idx in ranked_idx[1:TOP_K]:
        label = _label_for_index(idx)
        score = float(probs[idx])
        info = get_disease_info(label, score)
        alternatives.append(
            {
                "disease": info["disease"],
                "class_name": label,
                "confidence": info["confidence"],
                "healthy": info["healthy"],
            }
        )
    result["alternatives"] = alternatives
    return result


@lru_cache(maxsize=1)
def list_classes() -> list[str]:
    if _model is None:
        load_model()
    return [label for _, label in sorted(_model.config.id2label.items(), key=lambda kv: int(kv[0]))]
