from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import upload

app = FastAPI(title="PS-2 Smoke & Fire Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])


@app.get("/")
def root():
    return {"status": "running"}