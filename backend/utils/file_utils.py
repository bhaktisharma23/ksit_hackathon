import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException

from backend.config import UPLOAD_DIR

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv"}
MAX_FILE_SIZE_MB = 500 


def validate_video_file(file: UploadFile) -> str:
    """Check extension is allowed. Returns the extension (lowercase)."""
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}"
        )
    return ext


def generate_video_id() -> str:
    """Unique ID used to namespace everything for this job (upload, frames, output, results)."""
    return uuid.uuid4().hex[:12]


def save_upload(file: UploadFile, video_id: str, ext: str) -> Path:
    """Stream the uploaded file to disk under UPLOAD_DIR/{video_id}{ext}."""
    dest_path = UPLOAD_DIR / f"{video_id}{ext}"

    size = 0
    with open(dest_path, "wb") as buffer:
        while chunk := file.file.read(1024 * 1024):  # 1MB chunks
            size += len(chunk)
            if size > MAX_FILE_SIZE_MB * 1024 * 1024:
                buffer.close()
                dest_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=413,
                    detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit."
                )
            buffer.write(chunk)

    return dest_path


def get_upload_path(video_id: str) -> Path:
    """Find the saved upload file for a given video_id, regardless of extension."""
    matches = list(UPLOAD_DIR.glob(f"{video_id}.*"))
    if not matches:
        raise HTTPException(status_code=404, detail=f"No uploaded video found for id '{video_id}'")
    return matches[0]