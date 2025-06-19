import os
import requests
import psycopg2
from typing import List
from fastapi import APIRouter, Body, HTTPException, status

router = APIRouter(prefix="/model", tags=["model"])

# Hard‐coded DB connection, autocommit on so we never lock up on error
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


@router.post("/train", response_model=dict, status_code=status.HTTP_201_CREATED)
def proxy_train(
    model_index: int = Body(..., ge=0, example=0, description="Which model to train"),
    features: List[str] = Body(
        ..., 
        example=["Pclass","Sex","Age","Fare","Embarked","Title","IsAlone","Age*Class"],
        description="Feature list"
    ),
):
    # Canonicalize features: dedupe + sort 
    canonical_features = sorted(set(features))
    
    # Forward that canonical list
    payload = {"model_index": model_index, "features": canonical_features}
    try:
        resp = requests.post(
            f"{MODEL_BACKEND_URL}/train/",
            json=payload,
            timeout=10
        )
        resp.raise_for_status()
    except requests.exceptions.RequestException as exc:
        status_code = getattr(exc.response, "status_code", status.HTTP_502_BAD_GATEWAY)
        detail      = getattr(exc.response, "text", str(exc))
        raise HTTPException(status_code=status_code, detail=detail)

    data = resp.json()
    model_name  = data["model_name"]
    feature_key = data["feature_key"]  # assume this matches your canonical_features order
    file_name   = data["file_name"]

    # Check for an existing record
    cursor.execute(
        """
        SELECT 1 FROM trained_models
        WHERE model_name = %s
          AND feature_key = %s
        LIMIT 1
        """,
        (model_name, feature_key)
    )
    if cursor.fetchone():
        #  already trained this exact model+features combo
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This model with the same feature set has already been trained."
        )

    # Insert the new record
    try:
        cursor.execute(
            """
            INSERT INTO trained_models (model_name, feature_key, file_name)
            VALUES (%s, %s, %s)
            """,
            (model_name, feature_key, file_name)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Model trained but failed to save metadata: {e}"
        )

    return data
