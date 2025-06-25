# web-backend/routes/model_proxy.py

import os
import requests
import psycopg2
from typing import List, Dict, Any
from fastapi import APIRouter, Body, HTTPException, status

router = APIRouter(prefix="/model", tags=["model"])

# Hard‐coded DB connection
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


@router.get(
    "/train",
    status_code=status.HTTP_200_OK,
)
def list_trained_models() -> List[Dict[str, Any]]:
    """
    Returns all trained models so the UI can display them.
    """
    cursor.execute(
        """
        SELECT id, model_name, feature_key, file_name, trained_at
          FROM trained_models
         ORDER BY trained_at DESC
        """
    )
    rows = cursor.fetchall()
    result = []
    for id_, model_name, feature_key, file_name, trained_at in rows:
        result.append({
            "id": id_,
            "model_name": model_name,
            "feature_key": feature_key,
            "file_name": file_name,
            "trained_at": trained_at.isoformat(),
        })
    return result


@router.delete(
    "/train/{record_id}",
    status_code=status.HTTP_200_OK,
)
def delete_by_id(record_id: int) -> Dict[str, Any]:
    """
    Deletes the model both on disk (via model-backend) and its DB record.
    """
    # Look up the record in our DB
    cursor.execute(
        "SELECT model_name, feature_key, file_name FROM trained_models WHERE id = %s",
        (record_id,)
    )
    rec = cursor.fetchone()
    if not rec:
        raise HTTPException(status_code=404, detail="No such trained model")

    model_name, feature_key, file_name = rec

    # Forward deletion to model-backend
    payload = {"model_name": model_name, "feature_key": feature_key}
    try:
        resp = requests.delete(
            f"{MODEL_BACKEND_URL}/train/",
            json=payload,
            timeout=10
        )
        resp.raise_for_status()
    except requests.exceptions.RequestException as exc:
        status_code = getattr(exc.response, "status_code", status.HTTP_502_BAD_GATEWAY)
        detail      = getattr(exc.response, "text", str(exc))
        raise HTTPException(status_code=status_code, detail=detail)

    # Delete the Database row
    cursor.execute(
        "DELETE FROM trained_models WHERE id = %s",
        (record_id,)
    )
    return {
        "message": f"Deleted record {record_id} and file '{file_name}'."
    }
