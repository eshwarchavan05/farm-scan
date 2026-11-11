import io
import json
from pathlib import Path

from PIL import Image

try:
    import urllib.request
except ImportError:
    raise

from predictor import predict_from_bytes


def main():
    buf = io.BytesIO()
    Image.new("RGB", (256, 256), (30, 120, 40)).save(buf, format="JPEG")
    payload = buf.getvalue()
    Path("sample.jpg").write_bytes(payload)

    import urllib.request as u

    health = u.urlopen("http://127.0.0.1:8000/health", timeout=10).read().decode()
    print("health", health)

    boundary = "----FarmScan"
    body = (
        f"--{boundary}\r\n"
        'Content-Disposition: form-data; name="crop"\r\n\r\n'
        "Tomato\r\n"
        f"--{boundary}\r\n"
        'Content-Disposition: form-data; name="image"; filename="leaf.jpg"\r\n'
        "Content-Type: image/jpeg\r\n\r\n"
    ).encode() + payload + f"\r\n--{boundary}--\r\n".encode()
    req = u.Request(
        "http://127.0.0.1:8000/predict",
        data=body,
        method="POST",
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with u.urlopen(req, timeout=60) as resp:
        out = json.loads(resp.read().decode())
    print(json.dumps(out, indent=2))
    local = predict_from_bytes(payload, crop="Tomato")
    assert out["class_name"] == local["class_name"]
    print("http test passed")


if __name__ == "__main__":
    main()
