import cv2
import subprocess
from pathlib import Path

from backend.config import OUTPUT_VIDEO_DIR, OUTPUT_CODEC

CLASS_COLORS = {
    "fire": (0, 69, 255),
    "smoke": (128, 128, 128),
}


def draw_detections_on_frame(frame_path: str, detections: list):
    frame = cv2.imread(frame_path)

    for det in detections:
        bbox = det["bbox"]
        x1, y1, x2, y2 = int(bbox["x1"]), int(bbox["y1"]), int(bbox["x2"]), int(bbox["y2"])
        color = CLASS_COLORS.get(det["class_name"], (0, 255, 0))
        label = f"{det['class_name']} {det['confidence']:.2f}"

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        cv2.rectangle(frame, (x1, y1 - text_h - 8), (x1 + text_w + 4, y1), color, -1)
        cv2.putText(frame, label, (x1 + 2, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    return frame


def build_output_video(
    video_id: str,
    frame_records: list,
    inference_results: list,
    source_metadata: dict,
    sample_interval: int,
) -> Path:
    output_path = OUTPUT_VIDEO_DIR / f"{video_id}_processed.mp4"
    raw_path = OUTPUT_VIDEO_DIR / f"{video_id}_processed_raw.mp4"
    fourcc = cv2.VideoWriter_fourcc(*OUTPUT_CODEC)

    width, height = source_metadata["width"], source_metadata["height"]
    fps = source_metadata["fps"]

    writer = cv2.VideoWriter(str(raw_path), fourcc, fps, (width, height))

    detections_by_frame = {r["frame_index"]: r["detections"] for r in inference_results}

    for record in frame_records:
        idx = record["frame_index"]
        detections = detections_by_frame.get(idx, [])
        frame = draw_detections_on_frame(record["path"], detections)
        for _ in range(max(1, sample_interval)):
            writer.write(frame)

    writer.release()

    try:
        subprocess.run([
            "ffmpeg", "-y", "-i", str(raw_path),
            "-vcodec", "libx264", "-pix_fmt", "yuv420p",
            str(output_path)
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"ffmpeg re-encode failed for {video_id}:", e)
        raise
    finally:
        if raw_path.exists():
            raw_path.unlink()

    return output_path