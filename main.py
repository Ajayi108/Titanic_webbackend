import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

#CONFIGURATION: where is our model service?
#    - In Docker Compose we set MODEL_BACKEND_URL=http://model-backend:8000
#    - Locally (no Docker) it'll default to localhost:8000
MODEL_BACKEND_URL = os.getenv("MODEL_BACKEND_URL", "http://localhost:8000")

# Create FastAPI app instance
app = FastAPI()

# CORS MIDDLEWARE
#    - Allows your frontend (or Postman) to make requests from any origin.
#    - In production you might lock down `allow_origins` to your real domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # in prod, lock this down
    allow_methods=["*"],
    allow_headers=["*"],
)

# Re-declare the same request/response schemas
class PredictRequest(BaseModel):
    """
    Describes the JSON body we expect on POST /predict
    Fields must match exactly, types are enforced.
    """
    model: int
    Pclass: int
    Sex: int
    Age: float
    Fare: float
    Embarked: int
    Title: int
    IsAlone: int
    Age_Class: float

class PredictResponse(BaseModel):
    
    prediction: int
    probability: float

# 3. Proxy /predict to the model service
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    """
    1. Take JSON → Pydantic PredictRequest (validated).
    2. Forward it to the model‐backend service.
    3. If the model‐backend errors or is unreachable, return 502 Bad Gateway.
    4. Otherwise, pass its JSON straight back as PredictResponse."""
    try:
        r = requests.post(
            f"{MODEL_BACKEND_URL}/predict",
            json=req.dict(),
            timeout=5
        )
        r.raise_for_status()
    except Exception as e:
        raise HTTPException(502, detail=f"Model service error: {e}")
    return r.json()