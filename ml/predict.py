from ultralytics import YOLO
import cv2

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

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, conf=conf, verbose=False)
        annotated = results[0].plot()
        out.write(annotated)

        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            cls_name = model.names[cls_id]
            confidence = float(box.conf[0])
            class_conf_totals[cls_name] = class_conf_totals.get(cls_name, 0) + confidence
            class_conf_counts[cls_name] = class_conf_counts.get(cls_name, 0) + 1

    cap.release()
    out.release()

    print("Average confidence per class:")
    for cls_name in class_conf_totals:
        avg = class_conf_totals[cls_name] / class_conf_counts[cls_name]
        print(f"  {cls_name}: {avg:.3f}")

    print(f"Output video saved to: {output_path}")

if __name__ == "__main__":
    run_inference('/Users/apple/Downloads/videoplayback (4).mp4')