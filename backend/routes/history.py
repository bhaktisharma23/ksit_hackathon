import json
from datetime import datetime, timezone

from fastapi import APIRouter

from backend.config import RESULTS_DIR, UPLOAD_DIR

router = APIRouter()


@router.get("/history")
def get_history():
    videos = []

    result_files = sorted(
        RESULTS_DIR.glob("*_results.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )

    for result_path in result_files:
        try:
            with result_path.open("r", encoding="utf-8") as file:
                result = json.load(file)
        except (OSError, json.JSONDecodeError):
            continue

        video_id = result.get(
            "video_id",
            result_path.stem.removesuffix("_results"),
        )

        uploads = list(UPLOAD_DIR.glob(f"{video_id}.*"))
        upload_path = uploads[0] if uploads else None

        source_metadata = result.get("source_metadata", {})
        duration = source_metadata.get("duration_sec", 0)

        timestamp = datetime.fromtimestamp(
            result_path.stat().st_mtime,
            tz=timezone.utc,
        ).isoformat()

        videos.append({
            "id": video_id,
            "fileName": result.get(
                "filename",
                upload_path.name if upload_path else video_id,
            ),
            "fileSize": upload_path.stat().st_size if upload_path else 0,
            "format": (
                upload_path.suffix.lstrip(".")
                if upload_path
                else "",
            ),
            "duration": duration,
            "status": result.get("status", "completed"),
            "uploadedAt": result.get("uploaded_at", timestamp),
        })

    return videos