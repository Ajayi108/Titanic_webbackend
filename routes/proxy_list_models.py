import os
import psycopg2
from typing import List, Dict, Any
from fastapi import APIRouter, status

router = APIRouter(prefix="/model", tags=["model"])

#  DB connection to docker
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5432")
)
conn.autocommit = True
cursor = conn.cursor()

@router.get("/Model_list", status_code=status.HTTP_200_OK)
def list_trained_models() -> List[Dict[str, Any]]:
    """
    Returns all trained models including their canonical feature lists.
    """
    cursor.execute("""
        SELECT id, display_name, model_name, feature_key, file_name, is_global, trained_at
        FROM trained_models
        ORDER BY trained_at DESC
    """)
    rows = cursor.fetchall()
    result: List[Dict[str, Any]] = []
    for id_, display_name, model_name, feature_key, file_name, is_global, trained_at in rows:
        result.append({
            "id": id_,
            "display_name": display_name,
            "model_name": model_name,
            "feature_key": feature_key,
            "features": feature_key.split("-"),
            "file_name": file_name,
            "is_global": is_global,
            "trained_at": trained_at.isoformat(),
        })
    return result
