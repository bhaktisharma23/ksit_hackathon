import json
import shutil
from pathlib import Path

from backend.config import RESULTS_DIR, FRAMES_DIR
from backend.services.video_processor import extract_frames
from backend.services.inference import run_inference_on_frames
from backend.services.postprocessing import build_output_video
from backend.services.metrics import compute_metrics


def run_detection_pipeline(video_path: Path, video_id: str) -> dict:
    extraction = extract_frames(video_path, video_id)

    inference_results = run_inference_on_frames(extraction["frame_records"])

    output_video_path = build_output_video(
        video_id=video_id,
        frame_records=extraction["frame_records"],
        inference_results=inference_results,
        source_metadata=extraction["source_metadata"],
    )

    metrics = compute_metrics(inference_results)

    results = {
        "video_id": video_id,
        "source_metadata": extraction["source_metadata"],
        "sample_interval": extraction["sample_interval"],
        "total_sampled_frames": extraction["total_sampled"],
        "metrics": metrics,
        "output_video": str(output_video_path.name),
        "status": "completed",
    }

    results_path = RESULTS_DIR / f"{video_id}_results.json"
    with open(results_path, "w") as f:
        json.dump(results, f, indent=2)

    job_frames_dir = FRAMES_DIR / video_id
    if job_frames_dir.exists():
        shutil.rmtree(job_frames_dir)

    return results