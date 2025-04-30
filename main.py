from fastapi import FastAPI, Body, HTTPException
import requests
import uvicorn

app = FastAPI(
    title="Titanic Web Backend",
    description="Accepts front-end POSTs and proxies to model-backend",
    version="0.1.0"
)

MODEL_BACKEND_URL = "http://localhost:8000/predict"

@app.post("/predict")
def proxy_predict(
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
    """
    Now FastAPI knows about these nine fields, will validate them,
    and swagger-ui will render a form at /docs.
    """
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

    # propagate status code & JSON body back to caller
    return resp.json(), resp.status_code

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
