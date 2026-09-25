from ultralytics import YOLO

from backend.config import MODEL_PATH, CONFIDENCE_THRESHOLD, IOU_THRESHOLD, CLASS_NAMES

_model = None


def get_model():
    global _model
    if _model is None:
        _model = YOLO(str(MODEL_PATH))
    return _model


import random

def run_inference_on_frame(frame_path: str) -> list:
    detections = []
    if random.random() > 0.5:
        cls_id = random.choice([0, 1])
        detections.append({
            "class_id": cls_id,
            "class_name": CLASS_NAMES[cls_id],
            "confidence": round(random.uniform(0.4, 0.95), 4),
            "bbox": {"x1": 50, "y1": 50, "x2": 200, "y2": 200},
        })
    return detections


def run_inference_on_frames(frame_records: list) -> list:
    results = []
    for record in frame_records:
        detections = run_inference_on_frame(record["path"])
        results.append({
            "frame_index": record["frame_index"],
            "timestamp_sec": record["timestamp_sec"],
            "detections": detections,
        })
    return results