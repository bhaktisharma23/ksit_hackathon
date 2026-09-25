import cv2
from pathlib import Path
from fastapi import HTTPException


def get_video_metadata(video_path: Path) -> dict:
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise HTTPException(status_code=400, detail=f"Could not open video: {video_path.name}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()

    if fps <= 0 or frame_count <= 0:
        raise HTTPException(status_code=400, detail=f"Invalid or corrupt video: {video_path.name}")

    return {
        "fps": fps,
        "frame_count": frame_count,
        "width": width,
        "height": height,
        "duration_sec": frame_count / fps,
    }


def compute_sample_interval(source_fps: float, target_fps: int) -> int:
    return max(1, round(source_fps / target_fps))