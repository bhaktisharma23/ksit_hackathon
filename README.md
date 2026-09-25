# AI-Powered Smoke and Fire Detection & Visualization

An end-to-end AI video analysis system for detecting smoke and fire from image and video inputs.

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-Educational%2FResearch-lightgrey.svg)](#license)

---

## Overview

This project combines a trained object-detection model, a Python detection pipeline, a FastAPI backend, and a React dashboard into a single, cohesive system for detecting smoke and fire from image and video inputs.

The system is organized into four main layers:

| # | Layer | Responsibility |
|---|-------|-----------------|
| 1 | Model Development | Training, validation, prediction, and model export |
| 2 | Detection Pipeline | Video processing, frame inference, detection, postprocessing, and metrics |
| 3 | Backend API | FastAPI endpoints for uploads, detection, and results retrieval |
| 4 | Dashboard | React interface for video analysis, live monitoring, alerts, history, and model info |

---

## Architecture

```text
                         ┌──────────────────────────┐
                         │      Model Development   │
                         │                           │
                         │ validate.py               │
                         │ train.py                  │
                         │ predict.py                │
                         │ export_best.py            │
                         └────────────┬──────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │    Detection Pipeline     │
                         │                           │
                         │ video_processor.py        │
                         │ detection.py              │
                         │ postprocessing.py         │
                         │ inference.py              │
                         │ metrics.py                │
                         │ file_utils.py             │
                         │ video_utils.py            │
                         └────────────┬──────────────┘
                                      │
                                      ▼
┌──────────────────────┐    ┌──────────────────────────┐
│    React Dashboard    │◄──►│      FastAPI Backend     │
│                        │    │                           │
│ AppRoutes.tsx          │    │ app.py                    │
│ Dashboard.tsx          │    │ upload.py                 │
│ VideoAnalysis.tsx      │    │ detection.py              │
│ AlertLogs.tsx          │    │ results.py                │
│ History.tsx            │    └────────────┬──────────────┘
│ Settings.tsx           │                 │
│ AIModels.tsx           │                 ▼
│ Live Monitoring        │        Detection Results
└────────────────────────┘
```

---

## Main Features

- AI-based smoke/fire detection from video input
- Video upload and processing
- Frame-by-frame inference
- Detection postprocessing
- Detection metrics and result generation
- FastAPI REST backend
- React + TypeScript dashboard
- Video analysis interface
- Live monitoring interface
- Detection result visualization
- Alert logs and history
- AI model information page
- Centralized HTTP client for frontend–backend communication

---

## Project Structure

```text
project/
│
├── backend/
│   ├── app.py                     # FastAPI app initialization
│   ├── upload.py                  # Video upload endpoint
│   ├── detection.py                # Detection endpoint
│   └── results.py                  # Results endpoint
│
├── detection_pipeline/
│   ├── video_processor.py
│   ├── detection.py
│   ├── postprocessing.py
│   ├── inference.py
│   ├── metrics.py
│   ├── file_utils.py
│   └── video_utils.py
│
├── model/
│   ├── train.py
│   ├── validate.py
│   ├── predict.py
│   └── export_best.py
│
└── frontend/
    ├── src/
    │   ├── AppRoutes.tsx
    │   ├── api.ts
    │   ├── realtimeService.ts
    │   ├── useUpload.ts
    │   │
    │   ├── pages/
    │   │   ├── AlertLogs.tsx
    │   │   ├── History.tsx
    │   │   ├── Settings.tsx
    │   │   ├── VideoAnalysis.tsx
    │   │   ├── Dashboard.tsx
    │   │   └── AIModels.tsx
    │   │
    │   └── services/
    │       ├── AlertService.ts
    │       └── VideoService.ts
    │
    └── ...
```

> Exact folder names may differ depending on the repository implementation. The structure above reflects the logical separation shown in the system architecture.

---

## Model Development

Scripts used to prepare and work with the trained detection model.

| Script | Purpose |
|--------|---------|
| `train.py` | Trains the object-detection model using the prepared dataset |
| `validate.py` | Evaluates the trained model against validation data and measures detection performance |
| `predict.py` | Performs inference on images or videos using the trained model |
| `export_best.py` | Exports the selected/best model weights for use by the detection pipeline |

Note: the trained model must be made available to the inference layer before running the complete application.

---

## Detection Pipeline

Converts uploaded video into model predictions and usable results.

**`video_processor.py`** — Video Processing
- Reads video input
- Extracts frames
- Coordinates frame processing
- Produces processed video/results

**`detection.py`** — Detection Service
- Receives frames
- Runs object detection
- Produces detection information

**`inference.py`** — Frame Inference
- Loads the trained model
- Performs inference on individual frames
- Returns predictions and confidence information

**`postprocessing.py`** — Postprocessing
- Filters/cleans predictions
- Processes bounding boxes
- Converts raw model output into application-ready results

**`metrics.py`** — Metrics
- Provides detection-related metrics for evaluating model performance

**Utilities**
- `file_utils.py` — file-related operations
- `video_utils.py` — helper functions for video processing

---

## Backend API

Built with FastAPI to expose the AI pipeline to the frontend.

### Application — `app.py`
Initializes the FastAPI application and mounts the required routes.

### Upload Endpoint — `upload.py`
Handles video/file uploads from the dashboard.

```text
React Dashboard → Upload Video → FastAPI Upload Endpoint → Video Processing
```

### Detection Endpoint — `detection.py`
Starts or performs detection using the uploaded input and the trained model.

```text
Uploaded Video → Detection Endpoint → Frame Extraction → Model Inference → Postprocessing → Detection Results
```

### Results Endpoint — `results.py`
Provides processed detection results to the dashboard.

---

## Frontend Dashboard

Built with React + TypeScript.

| File | Responsibility |
|------|-----------------|
| `AppRoutes.tsx` | Defines navigation between dashboard pages |
| `api.ts` | Centralizes frontend-to-backend HTTP communication |
| `VideoService.ts` | Handles communication related to video processing and analysis |
| `realtimeService.ts` | Handles real-time dashboard updates where required |
| `useUpload.ts` | Manages upload-related state and frontend upload behavior |

Centralizing HTTP calls in `api.ts` keeps API logic separate from UI components and makes the backend URL easier to configure.

### Dashboard Pages

| Page | Description |
|------|--------------|
| Overview | High-level view of the system and detection status |
| Video Analysis | Upload and analyze video input |
| Live Monitoring | Monitoring interface for ongoing detection |
| Detection Results | Displays model predictions and processed results |
| Alert Logs | Shows generated detection alerts |
| History | Access to previous analysis/detection activity |
| AI Models | Displays information about the AI model used |
| Settings | Configurable dashboard/application settings |

---

## End-to-End Data Flow

```text
User
 → React Dashboard
   → FastAPI Backend (HTTP Request)
     → Upload / Detection Endpoint
       → Video Processing
         → Frame Extraction
           → AI Model Inference
             → Postprocessing
               → Detection Results
                 → FastAPI Results Endpoint
                   → React Dashboard
                     → Visualization / Alerts / History
```

---

## Getting Started

### Running the Backend

**1. Create and activate a virtual environment**

```bash
python -m venv venv
```

Windows:
```bash
venv\Scripts\activate
```

Linux / macOS:
```bash
source venv/bin/activate
```

**2. Install dependencies**

```bash
pip install -r requirements.txt
```

**3. Start FastAPI**

```bash
uvicorn app:app --reload
```

The API will normally be available at `http://127.0.0.1:8000`, with interactive documentation at `http://127.0.0.1:8000/docs`.

Note: if `app.py` is inside a backend package, use the appropriate module path, e.g. `uvicorn backend.app:app --reload`.

### Running the Frontend

```bash
npm install
npm run dev
```

The frontend will be available at the URL printed by the development server.

---

## Frontend–Backend Integration

The frontend communicates with FastAPI through the centralized HTTP client.

```text
React → POST /upload → FastAPI → AI Detection Pipeline → FastAPI (results) → React (JSON / processed video)
```

Keep the backend base URL in a single configuration location instead of hardcoding it throughout the frontend, for example:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Note: the exact environment-variable name can be changed to match your project configuration.

### API Communication Example

```text
POST /upload
Content-Type: multipart/form-data
        │
        ▼
FastAPI → Process uploaded video → Detection → Return result ID / result information
```

The frontend then requests the corresponding results through the results endpoint.

---

## Model Output

The detection system can produce information such as:

- Detected class
- Confidence score
- Bounding-box coordinates
- Frame number
- Timestamp
- Detection status
- Processed video/output path

Note: the exact response format depends on the backend implementation.

---

## Configuration Checklist

Before running the application, verify:

- [ ] Model weights are available
- [ ] Dataset paths are correct for training/validation
- [ ] Backend dependencies are installed
- [ ] Frontend dependencies are installed
- [ ] Frontend API URL points to the running FastAPI server
- [ ] Required upload/output directories exist
- [ ] CORS is configured if frontend and backend run on different origins

---

## Development Workflow

```text
1. Train / validate model
2. Verify standalone inference
3. Test detection pipeline
4. Start FastAPI backend
5. Test API endpoints
6. Connect React frontend
7. Test video upload
8. Display detection results
9. Test alerts / history / monitoring
```

---

## Testing

Test each layer independently before testing the complete application.

| Layer | What to Verify |
|-------|-----------------|
| Model | Produces reasonable detections on unseen test videos/images |
| Detection Pipeline | Frames are processed correctly, predictions are generated, bounding boxes are correct, output files are generated |
| Backend | Endpoints work correctly via the FastAPI Swagger UI at `/docs` |
| Frontend | Upload works, API requests reach FastAPI, loading/error states are handled, results display correctly |

### End-to-End Test

```text
Upload video → Backend receives video → Detection pipeline runs →
Model generates predictions → Results are returned → Dashboard visualizes results
```

---

## Important Notes

- Model quality depends heavily on dataset quality and diversity.
- Testing should include videos that were not used during training.
- Similar or duplicate frames should be minimized in the training dataset.
- Confidence thresholds should be tuned using validation/test results rather than arbitrary values.
- Frontend and backend should remain separated through clear API contracts.
- Detection/model code should remain independent from UI code.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Model | YOLO / Object Detection Model |
| Model Development | Python |
| Detection Pipeline | Python |
| Backend | FastAPI |
| API Server | Uvicorn |
| Frontend | React + TypeScript |
| Communication | REST API / HTTP |
| Visualization | React Dashboard |
| Version Control | Git / GitHub |

---

## Future Improvements

- [ ] Improve dataset diversity and annotation quality
- [ ] Add stronger temporal/video-level detection
- [ ] Reduce false positives between smoke and fire
- [ ] Add confidence and threshold controls
- [ ] Add real-time WebSocket-based monitoring
- [ ] Add authentication and role-based access
- [ ] Store historical detection results
- [ ] Add model performance analytics
- [ ] Containerize backend and frontend with Docker
- [ ] Deploy the complete system to the cloud

---

## License

This project is developed for educational, research, and hackathon purposes.
