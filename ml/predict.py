from ultralytics import YOLO
import cv2
import numpy as np

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


def run_inference(video_path, model_path="models/best.pt", output_path="output.mp4", conf=0.25):
    model = YOLO(model_path)

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

    class_conf_totals = {}
    class_conf_counts = {}
    detections_log = []
    frame_idx = 0

    colors = {"fire": (0, 0, 255), "smoke": (200, 200, 200)}

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, conf=conf, verbose=False)
        annotated = frame.copy()

        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            cls_name = model.names[cls_id]
            confidence = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = map(int, xyxy)

            if cls_name == "fire" and not verify_fire_color(frame, xyxy):
                cls_name = "smoke"

            color = colors.get(cls_name, (0, 255, 0))
            label = f"{cls_name} {confidence:.2f}"

            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 4)
            cv2.putText(annotated, label, (x1, max(y1 - 10, 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

            class_conf_totals[cls_name] = class_conf_totals.get(cls_name, 0) + confidence
            class_conf_counts[cls_name] = class_conf_counts.get(cls_name, 0) + 1

            detections_log.append({
                "frame": frame_idx,
                "class": cls_name,
                "confidence": round(confidence, 3),
                "bbox": [round(c, 1) for c in xyxy]
            })

        out.write(annotated)
        frame_idx += 1

    cap.release()
    out.release()

    print("Average confidence per class:")
    for cls_name in class_conf_totals:
        avg = class_conf_totals[cls_name] / class_conf_counts[cls_name]
        print(f"  {cls_name}: {avg:.3f}")

    print(f"Output video saved to: {output_path}")

    import json
    with open("detections.json", "w") as f:
        json.dump(detections_log, f, indent=2)
    print("Detection log saved to detections.json")

    return detections_log


if __name__ == "__main__":
    run_inference('/Users/apple/Downloads/videoplayback (4).mp4')