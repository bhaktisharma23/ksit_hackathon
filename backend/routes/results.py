import json
import mimetypes
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from backend.config import OUTPUT_VIDEO_DIR, RESULTS_DIR, UPLOAD_DIR
from backend.utils.file_utils import get_upload_path

router = APIRouter()


def _to_iso_utc(timestamp: float) -> str:
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat().replace("+00:00", "Z")


def _build_history_entry(video_path: Path) -> dict:
    video_id = video_path.stem
    result_path = RESULTS_DIR / f"{video_id}_results.json"
    uploaded_at = _to_iso_utc(video_path.stat().st_mtime)

    entry = {
        "id": video_id,
        "fileName": video_path.name,
        "fileSize": video_path.stat().st_size,
        "format": video_path.suffix.lstrip(".") or "mp4",
        "duration": 0,
        "status": "uploaded",
        "uploadedAt": uploaded_at,
    }

    if result_path.exists():
        with open(result_path, "r") as f:
            results = json.load(f)

        source_metadata = results.get("source_metadata", {})
        entry.update(
            {
                "duration": round(source_metadata.get("duration_sec", 0)),
                "status": results.get("status", "completed"),
            }
        )

    return entry


@router.get("/result/{video_id}")
async def get_result(video_id: str):
    results_path = RESULTS_DIR / f"{video_id}_results.json"

    if not results_path.exists():
        raise HTTPException(status_code=404, detail=f"No results found for video_id '{video_id}'. Has processing completed?")

    with open(results_path, "r") as f:
        results = json.load(f)

    return results


@router.get("/history")
async def get_history():
    videos = sorted(UPLOAD_DIR.glob("*.*"), key=lambda path: path.stat().st_mtime, reverse=True)
    return [_build_history_entry(video_path) for video_path in videos]


@router.get("/history/{video_id}")
async def get_history_item(video_id: str):
    results_path = RESULTS_DIR / f"{video_id}_results.json"
    upload_matches = list(UPLOAD_DIR.glob(f"{video_id}.*"))

    if results_path.exists():
        with open(results_path, "r") as f:
            return json.load(f)

    if upload_matches:
        return _build_history_entry(upload_matches[0])

    raise HTTPException(status_code=404, detail=f"No history found for video_id '{video_id}'")


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


@router.get("/result/{video_id}/source")
async def get_source_video(video_id: str):
    source_path = get_upload_path(video_id)
    media_type = mimetypes.guess_type(source_path.name)[0] or "video/mp4"

    return FileResponse(
        path=source_path,
        media_type=media_type,
        headers={
            "Content-Disposition": f'inline; filename="{source_path.name}"'
        },
    )