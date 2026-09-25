from fastapi import APIRouter, BackgroundTasks, HTTPException

from backend.utils.file_utils import get_upload_path
from backend.services.detection import run_detection_pipeline
from backend.config import RESULTS_DIR

router = APIRouter()

_job_status = {}


def _process_job(video_id: str):
    try:
        _job_status[video_id] = "processing"
        video_path = get_upload_path(video_id)
        run_detection_pipeline(video_path, video_id)
        _job_status[video_id] = "completed"
    except Exception as e:
        _job_status[video_id] = f"failed: {e}"


@router.post("/process/{video_id}")
async def process_video(video_id: str, background_tasks: BackgroundTasks):
    get_upload_path(video_id)

    if _job_status.get(video_id) == "processing":
        raise HTTPException(status_code=409, detail="Video is already being processed")

    _job_status[video_id] = "queued"
    background_tasks.add_task(_process_job, video_id)

    return {"video_id": video_id, "status": "queued"}


@router.get("/status/{video_id}")
async def get_status(video_id: str):
    if video_id in _job_status:
        return {"video_id": video_id, "status": _job_status[video_id]}

    results_path = RESULTS_DIR / f"{video_id}_results.json"
    if results_path.exists():
        return {"video_id": video_id, "status": "completed"}

    raise HTTPException(status_code=404, detail=f"No job found for video_id '{video_id}'")