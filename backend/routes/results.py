import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from backend.config import RESULTS_DIR, OUTPUT_VIDEO_DIR

router = APIRouter()


@router.get("/result/{video_id}")
async def get_result(video_id: str):
    results_path = RESULTS_DIR / f"{video_id}_results.json"

    if not results_path.exists():
        raise HTTPException(status_code=404, detail=f"No results found for video_id '{video_id}'. Has processing completed?")

    with open(results_path, "r") as f:
        results = json.load(f)

    return results


@router.get("/result/{video_id}/video")
async def get_result_video(video_id: str):
    video_path = OUTPUT_VIDEO_DIR / f"{video_id}_processed.mp4"

    if not video_path.exists():
        raise HTTPException(status_code=404, detail=f"Processed video not found for video_id '{video_id}'")

    return FileResponse(path=video_path, media_type="video/mp4", filename=video_path.name)

@router.get("/result/{video_id}/detections")
async def get_detections(video_id: str):
    results_path = RESULTS_DIR / f"{video_id}_results.json"

    if not results_path.exists():
        raise HTTPException(status_code=404, detail=f"No results found for video_id '{video_id}'")

    with open(results_path, "r") as f:
        results = json.load(f)

    return results.get("detections", [])