from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# 1. Allow your frontend (or Postman) to call in
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # in prod, lock this down
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Re-declare the same request/response schemas
class PredictRequest(BaseModel):
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
    try:
        # model-backend is the Docker service name; 8000 is its port
        r = requests.post(
            "http://model-backend:8000/predict",
            json=req.dict(),
            timeout=5
        )
        r.raise_for_status()
    except Exception as e:
        raise HTTPException(502, detail=f"Model service error: {e}")
    return r.json()