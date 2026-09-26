from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import upload
from backend.routes import upload, detection, results
from backend.routes import upload, detection, results, dashboard
from backend.routes import upload, detection, results, dashboard, alerts
from backend.routes import upload, detection, results, dashboard, alerts, history

app = FastAPI(title="PS-2 Smoke & Fire Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(detection.router, prefix="/api", tags=["detection"])
app.include_router(results.router, prefix="/api", tags=["results"])
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])
app.include_router(alerts.router, prefix="/api", tags=["alerts"])
app.include_router(history.router, prefix="/api", tags=["history"])

@app.get("/")
def root():
    return {"status": "running"}