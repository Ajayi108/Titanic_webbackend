from fastapi import APIRouter, Body, HTTPException
from starlette.responses import JSONResponse
import requests
import os

router = APIRouter(tags=["training"])

# point to model-backend's train endpoint
MODEL_BACKEND_TRAIN_URL = os.getenv("MODEL_BACKEND_TRAIN_URL", "http://localhost:2000/train")

# MODEL_BACKEND_TRAIN_URL = "http://localhost:2000/train"
MODEL_BACKEND_TRAIN_URL = "http://model-backend:2000/train"

@router.post("/train")
async def proxy_train(
    index: int = Body(
        ...,
        title="Model index",
        description="Which model to train (0–8).",
        embed=True,
        ge=0,  # min 0
        le=8   # max 8
    )
):
    
    #Proxy the training request to the model-backend.

    payload = {"index": index}

    try:
        resp = requests.post(MODEL_BACKEND_TRAIN_URL, json=payload, timeout=10)
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=502, detail="Cannot reach model-backend for training")

    # forward status code & JSON body
    return JSONResponse(content=resp.json(), status_code=resp.status_code)
