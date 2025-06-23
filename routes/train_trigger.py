from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import model_trainer  # Assuming your existing training logic is here

router = APIRouter()

class TrainRequest(BaseModel):
    model_index: int
    features: List[str]

@router.post("/train/")
async def train_model(request: TrainRequest):
    try:
        # Call your existing model training function with the inputs
        result = model_trainer.train_model(
            model_index=request.model_index,
            features=request.features
        )
        return result  # Should be dict with model_name, feature_key, file_name, etc.
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
