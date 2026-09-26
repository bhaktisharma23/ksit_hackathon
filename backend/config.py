import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


UPLOAD_DIR = BASE_DIR / "data" / "raw"
FRAMES_DIR = BASE_DIR / "data" / "frames"        
OUTPUT_VIDEO_DIR = BASE_DIR / "outputs" / "processed_videos"
RESULTS_DIR = BASE_DIR / "outputs" / "detection_results"
METRICS_DIR = BASE_DIR / "outputs" / "metrics"
MODEL_PATH = BASE_DIR / "ml" / "models" / "best.pt"


for d in [UPLOAD_DIR, FRAMES_DIR, OUTPUT_VIDEO_DIR, RESULTS_DIR, METRICS_DIR]:
    d.mkdir(parents=True, exist_ok=True)


CLASS_NAMES = ["fire", "smoke"]


CONFIDENCE_THRESHOLD = 0.35   
IOU_THRESHOLD = 0.45        


SAMPLE_FPS = 8  


OUTPUT_CODEC = "mp4v"