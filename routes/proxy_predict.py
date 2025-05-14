from fastapi import APIRouter, Body, HTTPException
from starlette.responses import JSONResponse
import requests

router = APIRouter(tags=["prediction"])

MODEL_BACKEND_URL = "http://localhost:8000/predict"

@router.post("/predict")
async def proxy_predict(
    model:      int   = Body(..., description="Which model to use: 0=decision_tree,…,6=randomForest"),
    Pclass:     int   = Body(..., description="Passenger class (1–3)"),
    Sex:        int   = Body(..., description="Sex (0=female,1=male)"),
    Age:        float = Body(..., description="Age in years"),
    Fare:       float = Body(..., description="Fare paid"),
    Embarked:   int   = Body(..., description="Port of embarkation (encoded)"),
    Title:      int   = Body(..., description="Title (encoded)"),
    IsAlone:    int   = Body(..., description="1 if traveling alone, else 0"),
    Age_Class:  float = Body(..., description="Age × Class feature")
):
    payload = {
        "model":     model,
        "Pclass":    Pclass,
        "Sex":       Sex,
        "Age":       Age,
        "Fare":      Fare,
        "Embarked":  Embarked,
        "Title":     Title,
        "IsAlone":   IsAlone,
        "Age_Class": Age_Class
    }

    try:
        resp = requests.post(MODEL_BACKEND_URL, json=payload, timeout=5)
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=502, detail="Cannot reach model-backend")

    # mirror status code and JSON body
    return JSONResponse(content=resp.json(), status_code=resp.status_code)
