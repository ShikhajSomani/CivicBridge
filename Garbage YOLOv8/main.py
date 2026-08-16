from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
from PIL import Image
import shutil
import uuid
import os

# Initialize FastAPI app
app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained YOLOv8 model
model = YOLO("best.pt")

# Create folders
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Home route
@app.get("/")
def home():
    return {
        "message": "Garbage Detection API is Running"
    }

# Prediction route
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())

        # Save uploaded image
        image_path = os.path.join(
            UPLOAD_DIR,
            f"{file_id}.jpg"
        )

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run YOLO prediction
        results = model.predict(
            source=image_path,
            conf=0.25
        )

        detections = []

        # Extract detections
        for result in results:

            boxes = result.boxes

            for box in boxes:

                class_id = int(box.cls[0])

                confidence = float(box.conf[0])

                class_name = model.names[class_id]

                detections.append({
                    "class": class_name,
                    "confidence": round(confidence * 100, 2)
                })

        # Return JSON response
        return JSONResponse(
            content={
                "detections": detections
            }
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "error": str(e)
            }
        )