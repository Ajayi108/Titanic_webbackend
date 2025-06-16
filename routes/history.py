# routes/history.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Prediction
from dependencies import get_db, get_current_user_id

router = APIRouter(tags=["history"])

@router.get("/history")
def get_user_history(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    predictions = (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id)
        .order_by(Prediction.created_at.desc())
        .limit(10)
        .all()
    )

    return [
        {
            "model": p.model_name,
            "age": p.age,
            "fare": p.fare,
            "result": p.result,
            "created_at": p.created_at
        }
        for p in predictions
    ]
