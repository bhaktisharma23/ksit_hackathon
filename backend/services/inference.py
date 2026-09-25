from ultralytics import YOLO

from backend.config import MODEL_PATH, CONFIDENCE_THRESHOLD, IOU_THRESHOLD, CLASS_NAMES

_model = None


def get_model():
    global _model
    if _model is None:
        _model = YOLO(str(MODEL_PATH))
    return _model


def run_inference_on_frame(frame_path: str) -> list:
    model = get_model()
    results = model.predict(
        source=frame_path,
        conf=CONFIDENCE_THRESHOLD,
        iou=IOU_THRESHOLD,
        verbose=False,
    )

    detections = []
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()

            detections.append({
                "class_id": cls_id,
                "class_name": CLASS_NAMES[cls_id] if cls_id < len(CLASS_NAMES) else f"class_{cls_id}",
                "confidence": conf,
                "bbox": {
                    "x1": xyxy[0],
                    "y1": xyxy[1],
                    "x2": xyxy[2],
                    "y2": xyxy[3],
                },
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