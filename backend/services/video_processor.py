import cv2
from pathlib import Path

from backend.config import FRAMES_DIR, SAMPLE_FPS
from backend.utils.video_utils import get_video_metadata, compute_sample_interval


def extract_frames(video_path: Path, video_id: str) -> dict:
    metadata = get_video_metadata(video_path)
    interval = compute_sample_interval(metadata["fps"], SAMPLE_FPS)

    job_frames_dir = FRAMES_DIR / video_id
    job_frames_dir.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(str(video_path))
    frame_records = []
    idx = 0
    saved = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % interval == 0:
            frame_filename = f"frame_{saved:05d}.jpg"
            frame_path = job_frames_dir / frame_filename
            cv2.imwrite(str(frame_path), frame)
            frame_records.append({
                "frame_index": saved,
                "original_frame_idx": idx,
                "timestamp_sec": idx / metadata["fps"],
                "path": str(frame_path),
            })
            saved += 1
        idx += 1

    cap.release()

    return {
        "video_id": video_id,
        "source_metadata": metadata,
        "sample_interval": interval,
        "frames_dir": str(job_frames_dir),
        "frame_records": frame_records,
        "total_sampled": saved,
    }