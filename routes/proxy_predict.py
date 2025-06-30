import os
import requests
import psycopg2
from typing import List, Dict, Any
from fastapi import APIRouter, Path, Body, HTTPException, status

router = APIRouter(prefix="/model", tags=["model"])

# DB connection to docker
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5432")
)
conn.autocommit = True
cursor = conn.cursor()

MODEL_BACKEND_URL = os.getenv("MODEL_BACKEND_URL", "http://localhost:2000")

@router.post(
    "/predict/{record_id}",
    status_code=status.HTTP_200_OK,
)
def proxy_predict(
    record_id: int = Path(..., description="ID of the trained model record"),
    feature_values: Dict[str, float] = Body(
        ...,
        example={"Age": 29.0, "Pclass": 2, "Fare": 2, "Sex": 1.0 , "Embarked": 2 , "Title": 1, "IsAlone": 1, "Age*Class": 3},
        description="Map of feature name to its value"
    )
) -> Dict[str, Any]:
    """
    Looks up the model_name & feature_key by record_id,
    validates and orders the feature values, then
    forwards them to model-backend /predict/.
    """
    fallback_models = {
        1: "random_forest-Age-Age#Class-Embarked-Fare-IsAlone-Pclass-Sex-Title",
        2: "svc-Age-Age#Class-Embarked-Fare-IsAlone-Pclass-Sex-Title",
    }

    model_name = None
    feature_key = None

    # Try getting model by ID       
    cursor.execute(
        "SELECT model_name, feature_key FROM trained_models WHERE id = %s",
        (record_id,)
    )
    rec = cursor.fetchone()

        # If not found and fallback is defined, try finding by file_name
    if not rec and record_id in fallback_models:
        cursor.execute(
            "SELECT model_name, feature_key FROM trained_models WHERE file_name = %s",
            (fallback_models[record_id],)
        )
        rec = cursor.fetchone()

    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found by ID or file name fallback.")
    model_name, feature_key = rec

    # Validate keys match exactly the expected feature names
    expected = feature_key.replace("#", "*").split("-")
    provided = list(feature_values.keys())
    if set(provided) != set(expected):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected features {expected}, but got {provided}"
        )

    #Build ordered list matching canonical order
    ordered_values: List[float] = [feature_values[name] for name in expected]

    # Forward to model-backend
    payload = {
        "model_name":  model_name,
        "feature_key": feature_key,
        "features":    feature_values
    }
    try:
        resp = requests.post(
            f"{MODEL_BACKEND_URL}/predict/",
            json=payload,
            timeout=10
        )
        resp.raise_for_status()
    except requests.exceptions.RequestException as exc:
        status_code = getattr(exc.response, "status_code", status.HTTP_502_BAD_GATEWAY)
        detail      = getattr(exc.response, "text", str(exc))
        raise HTTPException(status_code=status_code, detail=detail)

    return resp.json()
