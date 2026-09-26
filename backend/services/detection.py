import json
import shutil
from pathlib import Path
from datetime import datetime, timezone

from backend.config import RESULTS_DIR, FRAMES_DIR
from backend.services.video_processor import extract_frames
from backend.services.inference import run_inference_on_frames
from backend.services.postprocessing import build_output_video
from backend.services.metrics import compute_metrics


def _dedupe_detections(frame_detections: list) -> list:
    best_by_class = {}

    for det in frame_detections:
        class_name = det["class_name"]
        current_best = best_by_class.get(class_name)
        if current_best is None or det["confidence"] > current_best["confidence"]:
            best_by_class[class_name] = det

    return list(best_by_class.values())


def run_detection_pipeline(video_path: Path, video_id: str) -> dict:
    extraction = extract_frames(video_path, video_id)

    inference_results = run_inference_on_frames(
        extraction["frame_records"]
    )

    for frame_result in inference_results:
        frame_result["detections"] = _dedupe_detections(frame_result["detections"])

    output_video_path = build_output_video(
        video_id=video_id,
        frame_records=extraction["frame_records"],
        inference_results=inference_results,
        source_metadata=extraction["source_metadata"],
        sample_interval=extraction["sample_interval"],
    )

    metrics = compute_metrics(inference_results)

    # Normalize bbox from pixels to 0-1 fractions for the frontend overlay
    width = extraction["source_metadata"]["width"]
    height = extraction["source_metadata"]["height"]

    detections_list = []
    det_id = 0

    for frame_result in inference_results:
        for det in frame_result["detections"]:
            bbox = det["bbox"]

            detections_list.append({
                "id": str(det_id),
                "className": det["class_name"],
                "confidence": det["confidence"],
                "timestamp": frame_result["timestamp_sec"],

                "boundingBox": {
                    "x": bbox["x1"] / width,
                    "y": bbox["y1"] / height,
                    "width": (bbox["x2"] - bbox["x1"]) / width,
                    "height": (bbox["y2"] - bbox["y1"]) / height,
                },

                "filename": video_path.name,
                "analyzed_at": datetime.now(timezone.utc).isoformat(),
            })

            det_id += 1

    results = {
        "video_id": video_id,
        "source_metadata": extraction["source_metadata"],
        "sample_interval": extraction["sample_interval"],
        "total_sampled_frames": extraction["total_sampled"],
        "metrics": metrics,
        "detections": detections_list,
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