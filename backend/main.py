import os
from pathlib import Path
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from train_oil_level_cnn import trainer
from starlette.requests import Request
from typing import List
import uvicorn
from PIL import Image

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
    print("made an API call from brontend")
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

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



