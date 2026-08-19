# CivicBridge

CivicBridge is a civic-tech web application for identifying visible garbage in uploaded images. It pairs a React/Vite user interface with a FastAPI service that runs a trained YOLOv8 model (`best.pt`) and returns structured detections for display in the browser.

> **Scope:** The React application owns presentation, client-side validation, authentication UI, and HTTP communication. The FastAPI application owns image ingestion and YOLOv8 inference. The model and backend are not duplicated in the frontend.

## Contents

- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Garbage detection request flow](#garbage-detection-request-flow)
- [API contract](#api-contract)
- [Installation and local development](#installation-and-local-development)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Available commands](#available-commands)
- [Verification checklist](#verification-checklist)
- [Troubleshooting](#troubleshooting)
- [Security and production notes](#security-and-production-notes)

## Architecture

```text
┌──────────────────────────── Browser ────────────────────────────┐
│  React 19 + Vite                                                 │
│                                                                   │
│  Home / Login / Signup / Garbage Detection                       │
│  Navbar + Footer + reusable upload/results components            │
│  Client-side image validation + preview                          │
│  src/services/api.js                                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ POST multipart/form-data
                                │ field: file
                                ▼
┌────────────────────────── FastAPI ──────────────────────────────┐
│  GET /                                                           │
│  POST /predict                                                    │
│  CORS middleware                                                   │
│  Saves the uploaded image in Garbage YOLOv8/uploads/             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌──────────────────────── YOLOv8 model ───────────────────────────┐
│  ultralytics.YOLO("best.pt")                                    │
│  confidence threshold: 0.25                                      │
│  Extracts class name and confidence from model boxes             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌──────────────────────── JSON response ──────────────────────────┐
│ { "detections": [{ "class": "plastic bag", "confidence": 94.71 }] } │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌──────────────────────── React results UI ───────────────────────┐
│ Numbered result cards · confidence percentage · progress bar     │
│ no-detection, loading, and friendly error states                 │
└─────────────────────────────────────────────────────────────────┘
```

### Responsibility boundaries

| Layer | Responsibility |
| --- | --- |
| React frontend | Routing, UI, preview, image validation, local demo authentication, request state, and result rendering. |
| `src/services/api.js` | Centralized request function, `FormData` creation, HTTP request, response parsing, and errors. |
| FastAPI backend | Accepts the uploaded file, stores it, invokes the trained YOLO model, and returns JSON. |
| YOLOv8 `best.pt` | Performs object inference and produces bounding-box classes/confidences. |
| Browser localStorage | Stores demo users and the active demo session only. |

## Repository structure

```text
Major Project/
├── README.md                         # This project guide
├── frontend/                         # React + Vite application
│   ├── .env                          # Local frontend configuration
│   ├── package.json                  # Frontend scripts and dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── index.html                    # Vite HTML entry point
│   ├── public/                       # Public static files
│   └── src/
│       ├── main.jsx                  # React mount point
│       ├── App.jsx                   # Router, session state, protected route
│       ├── App.css                   # Application styles and responsiveness
│       ├── index.css                 # Global CSS baseline
│       ├── assets/                   # Image/vector assets
│       ├── components/
│       │   ├── Navbar.jsx            # Desktop/mobile navigation and auth controls
│       │   ├── Footer.jsx            # Site footer
│       │   ├── ImageUploader.jsx     # Picker, drag/drop, keyboard support, validation
│       │   ├── ImagePreview.jsx      # Selected-image preview and remove action
│       │   ├── DetectionResults.jsx  # Empty/loading/error/success result states
│       │   ├── FeatureCard.jsx       # Reusable home-page card
│       │   └── Header.jsx            # Legacy/simple header component
│       ├── pages/
│       │   ├── Home.jsx              # Public landing page
│       │   ├── Login.jsx             # Sign-in page
│       │   ├── Signup.jsx            # Sign-up page
│       │   ├── GarbageDetection.jsx  # Protected detection workflow
│       │   └── HomePage.jsx          # Earlier/simple home page component
│       └── services/
│           ├── api.js                # FastAPI communication
│           ├── auth.js               # localStorage demo authentication
│           └── README.md             # Services-folder note
└── Garbage YOLOv8/                   # Existing FastAPI + YOLOv8 backend
    ├── main.py                       # FastAPI routes and inference logic
    ├── requirements.txt              # Python dependencies
    ├── best.pt                       # Trained YOLOv8 weights
    ├── uploads/                      # Runtime uploaded-image storage
    ├── venv/                         # Local Python virtual environment (if created)
    └── Garbage_Detection_YOLOv8.ipynb # Training/experimentation notebook
```

`node_modules/`, `frontend/dist/`, Python `__pycache__/`, and generated upload files are runtime/build artifacts and should not be committed.

## Frontend

### Technology

- React `19.2.8`
- React DOM `19.2.8`
- React Router DOM `7.18.2`
- Vite `8.2.1`
- JavaScript, JSX, and CSS
- Oxlint for static linting

### Routes

| URL | Access | Purpose |
| --- | --- | --- |
| `/` | Public | CivicBridge landing page. |
| `/login` | Public | Demo sign-in. |
| `/signup` | Public | Demo account creation. |
| `/garbage-detection` | Protected | Image upload, YOLO detection request, and results. |
| Any unknown route | Public redirect | Redirects to `/`. |

`App.jsx` uses `ProtectedRoute` to redirect unauthenticated visitors from `/garbage-detection` to `/login`.

### Garbage detection UI components

| Component | Role |
| --- | --- |
| `ImageUploader.jsx` | Validates a file, supports click, drag/drop, Enter, and Space, and passes a valid browser `File` object upward. |
| `ImagePreview.jsx` | Uses `URL.createObjectURL()` to show the selected local image without uploading it first. The URL is revoked when the image changes/unmounts. |
| `GarbageDetection.jsx` | Owns image, request-status, and detections state. It prevents duplicate submissions and clears stale responses after reset. |
| `DetectionResults.jsx` | Shows initial, image-ready, detecting, no-detection, error, and successful-results states. Each result is rendered individually, including duplicate classes. |
| `api.js` | Contains the single `detectGarbage(file)` function used by the page. |

### Image validation

The browser validates files before `detectGarbage()` is called:

- A file must be selected.
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`.
- JPG and JPEG share the MIME type `image/jpeg`.
- Maximum file size: **10 MB**.
- Unsupported or over-limit images show an accessible, user-friendly error and clear the active selection.

The `accept` attribute helps file-pickers filter choices, while MIME-type checking is the actual client-side validation. The FastAPI backend should still be treated as the final security boundary in a production deployment.

### Detection states

| Status | UI behavior |
| --- | --- |
| `initial` | Upload area is ready; Detect button is disabled. |
| `image-selected` | Image preview is visible and Detect is enabled. |
| `detecting` | Upload/reset/detect actions are locked; a spinner and live status message are shown. |
| `success` | One result card per returned detection, with detection number, class, confidence, and progress bar. |
| `no-detections` | Shows “No garbage detected” and asks the user to try another image. |
| `error` | Shows a friendly error without exposing raw technical details. |

### Accessibility and responsive design

- Semantic buttons and native file input.
- Focus-visible outlines for keyboard navigation.
- Upload area operates with mouse/touch, drag/drop, Enter, and Space.
- ARIA live regions announce result changes.
- Result progress bars include ARIA values and labels.
- Mobile navigation and single-column layouts are provided through CSS breakpoints.
- `prefers-reduced-motion` is respected.

## Backend

The backend lives in `Garbage YOLOv8/` and is intentionally separate from the React app.

### Technology

- Python
- FastAPI
- Uvicorn
- Ultralytics YOLOv8
- PyTorch (indirectly used by Ultralytics)
- Pillow
- OpenCV headless
- `python-multipart` for multipart file uploads

### Backend startup behavior

When `main.py` is imported:

1. A FastAPI application is created.
2. Permissive CORS middleware is registered.
3. `YOLO("best.pt")` loads the trained model weights.
4. The `uploads/` directory is created when missing.
5. Routes are registered.

### Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Health-style message: `{"message":"Garbage Detection API is Running"}`. |
| `POST` | `/predict` | Receives an image under multipart field `file`, performs inference, and returns detections. |

### Inference behavior

`POST /predict`:

1. Receives `file: UploadFile`.
2. Generates a UUID.
3. Saves the file as `uploads/<uuid>.jpg`.
4. Runs `model.predict(source=image_path, conf=0.25)`.
5. Iterates returned boxes.
6. Converts each class ID through `model.names`.
7. Converts each confidence to a percentage with two decimal places.
8. Returns a JSON object containing `detections`.

The frontend does not receive bounding boxes or annotated images because the current backend response only returns class/confidence pairs.

## Garbage detection request flow

```text
1. User signs in or signs up in the frontend.
2. User opens /garbage-detection.
3. User chooses or drops a valid image.
4. ImageUploader checks MIME type and size.
5. GarbageDetection creates a local browser preview.
6. User selects Detect Garbage.
7. detectGarbage(selectedFile) creates FormData.
8. FormData appends the image under the exact key: "file".
9. fetch() sends POST <API base URL>/predict.
10. FastAPI writes the upload and runs best.pt.
11. FastAPI returns { detections: [...] }.
12. React selects success or no-detections state.
13. DetectionResults renders the live response, with no generated result data.
```

## API contract

### Request

```http
POST /predict
Content-Type: multipart/form-data; boundary=...
```

| Form field | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | File | Yes | The selected image file. |

The frontend deliberately **does not set `Content-Type` manually** for `FormData`; the browser supplies the multipart boundary.

### Successful response

```json
{
  "detections": [
    {
      "class": "plastic bag",
      "confidence": 94.71
    },
    {
      "class": "plastic bag",
      "confidence": 75.25
    }
  ]
}
```

The UI renders both `plastic bag` entries as separate detections. It does not group or discard duplicate classes.

### No detection response

```json
{
  "detections": []
}
```

The UI displays: **“No garbage detected”** and offers the user an upload-another-image action.

### Error response

The backend catches inference errors and currently returns a `500` JSON response shaped like:

```json
{
  "error": "<backend error text>"
}
```

The browser keeps its error message generic for users rather than displaying raw backend details.

## Installation and local development

### Prerequisites

- Node.js and npm
- Python compatible with the backend’s packages
- A trained `Garbage YOLOv8/best.pt` model file
- Sufficient memory/CPU for YOLOv8 model loading and inference

### 1. Start the FastAPI backend

Open a terminal in the backend directory:

```powershell
cd "C:\Users\Shikhaj Somani\OneDrive\Desktop\Major Project\Garbage YOLOv8"
```

If the virtual environment does not already exist, create and populate one:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Start FastAPI:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Backend URL: `http://127.0.0.1:8000`

Optional health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
```

### 2. Start the React frontend

Open a second terminal:

```powershell
cd "C:\Users\Shikhaj Somani\OneDrive\Desktop\Major Project\frontend"
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

### 3. Use the application

1. Open `http://localhost:5173`.
2. Create a demo account or sign in.
3. Open **Garbage Detection**.
4. Select a valid JPG/JPEG, PNG, or WEBP image smaller than 10 MB.
5. Select **Detect garbage**.
6. View the returned result cards or the no-detection message.
7. Use **Upload another image** to start again without reloading the page.

## Configuration

### Frontend environment file

`frontend/.env` currently contains:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Vite only exposes variables prefixed with `VITE_` to browser code. Restart Vite after changing this file.

### Current API base-URL implementation note

The current `frontend/src/services/api.js` defines:

```js
const apiUrl = 'http://127.0.0.1:8000'
```

Therefore, the present API service uses that constant directly; the `.env` variable is available but is **not currently read by `api.js`**. To make the environment file authoritative in a future frontend-only change, use:

```js
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
```

Do not include secrets in `VITE_*` variables: they are bundled into browser-delivered code.

## Authentication

Authentication is a **frontend-only demo implementation** in `frontend/src/services/auth.js`.

- Users are saved in `localStorage` under `civicbridge.users`.
- The active session is saved under `civicbridge.session`.
- `signUp()` creates a user and session.
- `signIn()` checks saved local users.
- `signOut()` removes the session.
- A small artificial delay makes the UI behave like an asynchronous request.

This is not production authentication. Passwords are stored in browser localStorage by this demo implementation and must be replaced with a secure backend identity system before deployment.

## Available commands

Run these from `frontend/`:

| Command | Description |
| --- | --- |
| `npm install` | Installs frontend packages. |
| `npm run dev` | Starts Vite development server. |
| `npm run build` | Creates a production build in `frontend/dist/`. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Runs Oxlint. |

## Verification checklist

```powershell
cd frontend
npm run build
npm run lint
```

Manual end-to-end checks after both servers are running:

- Valid garbage image: preview, POST request, and result cards appear.
- Multiple objects: every returned detection appears separately.
- No detections: no-garbage state appears.
- Unsupported file: upload validation shows an error and does not start a request.
- File over 10 MB: size error appears and does not start a request.
- Backend unavailable: friendly error appears after detection attempt.
- Reset: selected image and previous results clear without a page reload.

## Troubleshooting

### Frontend cannot reach the backend

- Confirm FastAPI is running at `http://127.0.0.1:8000`.
- Open `http://127.0.0.1:8000/` and confirm the health message.
- Confirm the API base URL in `src/services/api.js` matches the backend URL.
- Check the browser developer console and Network tab.
- Restart Vite after changing `.env`.

### Backend appears to hang at startup

YOLO/Ultralytics and PyTorch may require noticeable startup time while importing libraries and loading model weights. Verify the active virtual environment has all packages from `requirements.txt`, then start Uvicorn from `Garbage YOLOv8/` so `best.pt` resolves correctly.

### “Please upload a JPG, PNG, or WEBP image” appears

The browser-provided MIME type was not `image/jpeg`, `image/png`, or `image/webp`. Convert the file to a supported format and try again.

### “Image size is too large” appears

Choose an image at or below 10 MB.

### Detection results are empty

An empty `detections` array is a successful model response indicating no objects satisfied the backend’s configured confidence threshold (`0.25`).

## Security and production notes

Before deploying CivicBridge, consider the following changes:

- Replace the localStorage demo authentication with server-side authentication and hashed passwords.
- Restrict FastAPI CORS origins instead of using `allow_origins=["*"]` with credentials.
- Validate uploaded image contents and size again on the server.
- Add upload cleanup, storage limits, and malware scanning as appropriate.
- Store configuration via deployment environment variables; never expose secrets through `VITE_*` values.
- Add request authentication, rate limiting, logging, monitoring, and error tracking.
- Use HTTPS in deployed environments.
- Consider returning detection bounding boxes and an annotated image URL if visual localization is required.
- Add automated frontend and backend tests to CI.

## License

No license has been specified for this repository yet. Add one before publishing or distributing the project.