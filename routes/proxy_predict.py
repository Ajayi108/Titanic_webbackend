import os
import requests
import psycopg2
from typing import List, Dict, Any
from fastapi import APIRouter, Path, Body, HTTPException, status

router = APIRouter(prefix="/model", tags=["model"])

# Hard‐coded DB connection
conn = psycopg2.connect(
    dbname="titanic_shrank_db",
    user="titanic_saver",
    password="TitanicMan",
    host="localhost",
    port="5432"
)
conn.autocommit = True
cursor = conn.cursor()

MODEL_BACKEND_URL = os.getenv("MODEL_BACKEND_URL", "http://localhost:2000")


@router.get(
    "/train",
    status_code=status.HTTP_200_OK,
)
def list_trained_models() -> List[Dict[str, Any]]:
    """
    Returns all trained models including their canonical feature lists.
    """
    cursor.execute("""
        SELECT id, model_name, feature_key, file_name, trained_at
          FROM trained_models
         ORDER BY trained_at DESC
    """)
    rows = cursor.fetchall()
    result: List[Dict[str, Any]] = []
    for id_, model_name, feature_key, file_name, trained_at in rows:
        result.append({
            "id":           id_,
            "model_name":   model_name,
            "feature_key":  feature_key,
            "features":     feature_key.split("-"),       # dynamic field names
            "file_name":    file_name,
            "trained_at":   trained_at.isoformat(),
        })
    return result


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
    # 1) Fetch model_name & feature_key
    cursor.execute(
        "SELECT model_name, feature_key FROM trained_models WHERE id = %s",
        (record_id,)
    )
    rec = cursor.fetchone()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No such trained model")
    model_name, feature_key = rec

    # 2) Validate keys match exactly the expected feature names
    expected = feature_key.split("-")
    provided = list(feature_values.keys())
    if set(provided) != set(expected):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected features {expected}, but got {provided}"
        )

    # 3) Build ordered list matching canonical order
    ordered_values: List[float] = [feature_values[name] for name in expected]

    # 4) Forward to model-backend
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
