import json
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter

from backend.config import RESULTS_DIR
INDIA_TZ = timezone(timedelta(hours=5, minutes=30), name="IST")

router = APIRouter()


@router.get("/dashboard")
def get_dashboard():
    summary = {
        "totalDetections": 0,
        "fireCount": 0,
        "smokeCount": 0,
        "averageConfidenceFire": 0.0,
        "averageConfidenceSmoke": 0.0,
    }
    confidence_sums = {"fire": 0.0, "smoke": 0.0}
    alerts = []
    videos_analyzed = 0

    current_hour = datetime.now(INDIA_TZ).replace(
        minute=0,
        second=0,
        microsecond=0,
    )
    first_hour = current_hour - timedelta(hours=23)

    activity = {
        (first_hour + timedelta(hours=offset)).isoformat(): {
            "fire": 0,
            "smoke": 0,
        }
        for offset in range(24)
    }

    result_files = sorted(
        RESULTS_DIR.glob("*_results.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )

    for path in result_files:
        try:
            with path.open("r", encoding="utf-8") as file:
                result = json.load(file)
        except (OSError, json.JSONDecodeError):
            continue

        videos_analyzed += 1
        detections = result.get("detections", [])
        video_id = result.get(
            "video_id",
            path.stem.removesuffix("_results"),
        )

        source = result.get("filename")
        if not source and detections:
            source = detections[0].get("filename")
        if not source:
            source = video_id

        analyzed_at_datetime = datetime.fromtimestamp(
            path.stat().st_mtime,
            tz=INDIA_TZ,
        )
        analyzed_at = analyzed_at_datetime.isoformat()
        hour = analyzed_at_datetime.replace(
            minute=0,
            second=0,
            microsecond=0,
        ).isoformat()

        for index, detection in enumerate(detections):
            kind = detection.get("className")
            if kind not in ("fire", "smoke"):
                continue

            try:
                confidence = float(detection.get("confidence", 0))
            except (TypeError, ValueError):
                confidence = 0.0

            summary["totalDetections"] += 1
            summary[f"{kind}Count"] += 1
            confidence_sums[kind] += confidence

            if hour in activity:
                activity[hour][kind] += 1

            alerts.append({
                "id": f"{video_id}-{detection.get('id', index)}",
                "type": kind,
                "confidence": confidence,
                "timestamp": analyzed_at,
                "source": source,
                "status": "active",
            })

    for kind in ("fire", "smoke"):
        count = summary[f"{kind}Count"]
        if count:
            summary[f"averageConfidence{kind.title()}"] = (
                confidence_sums[kind] / count
            )

    return {
        "summary": summary,
        "videosAnalyzed": videos_analyzed,
        "activity": [
            {
                "label": datetime.fromisoformat(hour).strftime("%H:00"),
                **counts,
            }
            for hour, counts in activity.items()
        ],
        "alerts": alerts[:5],
    }