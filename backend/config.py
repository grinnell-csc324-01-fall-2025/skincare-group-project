# Configuration for the skincare API
import os

# Ngrok configuration
NGROK_URL = "https://deathlike-dorethea-tessellated.ngrok-free.dev"
LOCAL_URL = "http://localhost:8000"

# Use ngrok URL if available, otherwise fall back to local
API_BASE_URL = os.getenv("API_BASE_URL", NGROK_URL)

# API endpoints
ENDPOINTS = {
    "train_model": "/api_call/",
    "health": "/",
}

def get_full_url(endpoint_key: str) -> str:
    """Get the full URL for an API endpoint"""
    return f"{API_BASE_URL}{ENDPOINTS.get(endpoint_key, '/')}"
