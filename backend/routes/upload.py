from fastapi import APIRouter, UploadFile, File, HTTPException

from backend.utils.file_utils import (
    validate_video_file,
    generate_video_id,
    save_upload,
)

router = APIRouter()


@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """
    Accepts a video file, validates it, saves it to data/raw/{video_id}.ext,
    and returns the video_id the frontend will use for all subsequent calls.
    """
    ext = validate_video_file(file)
    video_id = generate_video_id()

    try:
        saved_path = save_upload(file, video_id, ext)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save upload: {e}")

    return {
        "video_id": video_id,
        "filename": file.filename,
        "saved_as": saved_path.name,
        "status": "uploaded",
    }