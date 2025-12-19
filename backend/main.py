import os
from pathlib import Path
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.requests import Request
from typing import List
from PIL import Image
import io
from typing import Optional
from fastapi import UploadFile, File, Form
import asyncio
import torch
import torchvision.transforms as T
from torchvision import models
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# model loading - run once at import
# adjust path/model architecture to match trained model
DEVICE = torch.device("cpu")
try:
    # example
    logger.info("Loading cancer detection model...")
    model = models.resnet18(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, 2)  # adjust classes
    model.load_state_dict(torch.load("models/cancer_resnet18.pth", map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    logger.info("Model loaded successfully")
except Exception as e:
    # if model loading fails, endpoints log error
    model = None
    logger.warning(f"Model failed to load: {e}")

# transforms must match training
TRANSFORM = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225])
])

def preprocess_pil(img_pil):
    return TRANSFORM(img_pil).unsqueeze(0)

async def run_inference(image_bytes: bytes):
    if model is None:
        raise RuntimeError("Model not loaded")
    # do CPU-bound work on separate thread
    def sync_infer():
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_tensor = preprocess_pil(img).to(DEVICE)
        with torch.no_grad():
            out = model(input_tensor)
            probs = torch.softmax(out, dim = 1).cpu().numpy()[0]
        return probs.tolist()
   
    probs = await asyncio.to_thread(sync_infer)
    return probs
# end model loading

app = FastAPI()

app.add_middleware(
     CORSMiddleware,  # Fixed: Need to specify CORSMiddleware
     allow_origins=["*"],  # loosen during testing; restrict later
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
 )
 
@app.get("/")
async def root():
     # Fixed: GET requests don't typically have JSON body
     logger.info("Health check endpoint called")
     return {"message": "Skincare API is running!", "status": "healthy"}
 
@app.post("/api_call/")
async def api_call(request: Request):  # Fixed typo: requst -> request
     try:
         data = await request.json()
         request_data = data["request"]
         
         print(f"Received request: {request_data}")
         
         # You can add your model training logic here
         return {"message": "Model trained successfully.", "data": request_data}
     
     except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# endpoints matching frontend idToTest mappings
@app.post("/api/cancer_result")
async def cancer_result(image: UploadFile = File(...), test: Optional[str] = Form(None)):
    """
    Accepts a multipart/form-data upload ('image' field) and optional 'test' form field.
    Returns JSON with key 'cancerResult' (float). Replace placeholder logic with your model call.
    """
    logger.info(f"Cancer analysis request received - Image: {image.filename}, Test: {test}")
    try:
        contents = await image.read()
        # Basic validation: try to open the image
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        width, height = img.size
        logger.info(f"Processing image - Size: {width}x{height}")

        # Placeholder scoring: normalized size-based pseudo-score (replace with model)
        score = float(((width + height) % 100) / 100.0)
        logger.info(f"Cancer analysis completed - Result: {score}")
        return {"cancerResult": score}
    except Exception as e:
        logger.error(f"Cancer analysis failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"invalid image or processing error: {e}")

@app.post("/api/skin_analysis")
async def skin_analysis(image: UploadFile = File(...), test: Optional[str] = Form(None)):
    """
    Accepts multipart/form-data upload and returns a simple skinAnalysis result.
    Returns JSON with key 'skinAnalysis' (string or dict). Replace with your real model.
    """
    logger.info(f"Skin type analysis request received - Image: {image.filename}")
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("L")  # grayscale
        pixels = list(img.getdata())
        mean = sum(pixels) / len(pixels)
        logger.info(f"Image brightness calculated - Mean: {mean}")

        # simple heuristic: brighter => 'oily', darker => 'dry' (placeholder)
        label = "oily" if mean > 127 else "dry"
        confidence = round(abs(mean - 127) / 127, 3)  # placeholder confidence
        logger.info(f"Skin type analysis completed - Label: {label}, Confidence: {confidence}")
        return {"skinAnalysis": {"label": label, "confidence": confidence}}
    except Exception as e:
        logger.error(f"Skin type analysis failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"invalid image or processing error: {e}")
    
@app.post("/api/acne_analysis")
async def acne_analysis(image: UploadFile = File(...), test: Optional[str] = Form(None)):
    logger.info(f"Acne analysis request received - Image: {image.filename}")
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        width, height = img.size
        logger.info(f"Processing acne image - Size: {width}x{height}")

        # Placeholder result
        label = "moderate"
        confidence = 0.5

        logger.info(f"Acne analysis completed - Label: {label}, Confidence: {confidence}")
        return {"acneAnalysis": {"label": label, "confidence": confidence}}
    except Exception as e:
        logger.error(f"Acne analysis failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# Run the server
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Skincare API server on port 5000...")
    # for local development you can use 0.0.0.0 or keep 10.0.2.2 if needed for emulator
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True)