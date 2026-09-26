import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from backend.config import BASE_DIR, RESULTS_DIR

router = APIRouter()

ALERTS_DB = BASE_DIR / "outputs" / "alerts.sqlite3"
AlertStatus = Literal["active", "acknowledged", "resolved"]


class AlertStatusUpdate(BaseModel):
    status: AlertStatus


def _connect_db() -> sqlite3.Connection:
    connection = sqlite3.connect(ALERTS_DB)
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS alert_status (
            alert_id TEXT PRIMARY KEY,
            status TEXT NOT NULL
                CHECK (status IN ('active', 'acknowledged', 'resolved')),
            updated_at TEXT NOT NULL
        )
        """
    )
    return connection


def _load_alerts() -> list[dict]:
    alerts = []

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

        video_id = result.get("video_id", path.stem.removesuffix("_results"))
        source = result.get("filename", video_id)
        timestamp = datetime.fromtimestamp(
            path.stat().st_mtime,
            tz=timezone.utc,
        ).isoformat()

        for index, detection in enumerate(result.get("detections", [])):
            detection_type = detection.get("className")
            if detection_type not in ("fire", "smoke"):
                continue

            detection_id = detection.get("id", index)
            alerts.append({
                "id": f"{video_id}-{detection_id}",
                "type": detection_type,
                "confidence": float(detection.get("confidence", 0)),
                "timestamp": timestamp,
                "source": source,
                "status": "active",
            })

    if alerts:
        with _connect_db() as connection:
            saved_statuses = dict(
                connection.execute("SELECT alert_id, status FROM alert_status")
            )

        for alert in alerts:
            alert["status"] = saved_statuses.get(alert["id"], "active")

    return alerts


def _find_alert(alert_id: str) -> dict | None:
    return next(
        (alert for alert in _load_alerts() if alert["id"] == alert_id),
        None,
    )


@router.get("/alerts")
def get_alerts(
    type: Literal["fire", "smoke"] | None = Query(default=None),
    status: AlertStatus | None = Query(default=None),
    dateFrom: str | None = Query(default=None),
    dateTo: str | None = Query(default=None),
    searchQuery: str | None = Query(default=None),
):
    alerts = _load_alerts()

    if type:
        alerts = [alert for alert in alerts if alert["type"] == type]
    if status:
        alerts = [alert for alert in alerts if alert["status"] == status]
    if dateFrom:
        alerts = [
            alert for alert in alerts
            if alert["timestamp"][:10] >= dateFrom[:10]
        ]
    if dateTo:
        alerts = [
            alert for alert in alerts
            if alert["timestamp"][:10] <= dateTo[:10]
        ]
    if searchQuery:
        query = searchQuery.casefold()
        alerts = [
            alert for alert in alerts
            if query in alert["source"].casefold()
        ]

    return alerts


@router.get("/alerts/{alert_id}")
def get_alert(alert_id: str):
    alert = _find_alert(alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.patch("/alerts/{alert_id}")
def update_alert_status(alert_id: str, update: AlertStatusUpdate):
    alert = _find_alert(alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    updated_at = datetime.now(timezone.utc).isoformat()
    with _connect_db() as connection:
        connection.execute(
            """
            INSERT INTO alert_status (alert_id, status, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(alert_id) DO UPDATE SET
                status = excluded.status,
                updated_at = excluded.updated_at
            """,
            (alert_id, update.status, updated_at),
        )

    alert["status"] = update.status
    return alert