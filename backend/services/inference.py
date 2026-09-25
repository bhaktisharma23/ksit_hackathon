from ultralytics import YOLO
from backend.config import MODEL_PATH, CONFIDENCE_THRESHOLD, IOU_THRESHOLD, CLASS_NAMES
import cv2
import numpy as np

_model = None


def get_model():
    global _model
    if _model is None:
        _model = YOLO(str(MODEL_PATH))
    return _model


def verify_fire_color(frame, box, min_orange_ratio=0.15):
    x1, y1, x2, y2 = map(int, box)
    roi = frame[y1:y2, x1:x2]
    if roi.size == 0:
        return True

    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    lower1 = np.array([0, 80, 100])
    upper1 = np.array([35, 255, 255])
    mask = cv2.inRange(hsv, lower1, upper1)

    orange_ratio = np.count_nonzero(mask) / (roi.shape[0] * roi.shape[1])
    return orange_ratio >= min_orange_ratio


def run_inference_on_frame(frame_path: str) -> list:
    model = get_model()
    results = model.predict(
        source=frame_path,
        conf=CONFIDENCE_THRESHOLD,
        iou=IOU_THRESHOLD,
        verbose=False,
    )

    frame = cv2.imread(frame_path)

    detections = []
    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()

            class_name = CLASS_NAMES[cls_id] if cls_id < len(CLASS_NAMES) else f"class_{cls_id}"

            if class_name == "fire" and frame is not None:
                is_real_fire = verify_fire_color(frame, xyxy)
                if not is_real_fire:
                    class_name = "smoke"
                    cls_id = CLASS_NAMES.index("smoke")

            detections.append({
                "class_id": cls_id,
                "class_name": class_name,
                "confidence": round(conf, 4),
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