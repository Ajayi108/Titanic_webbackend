from fastapi import FastAPI, Body, HTTPException
from pydantic import BaseModel, EmailStr
import bcrypt
import requests
import uvicorn

app = FastAPI(
    title="Titanic Web Backend",
    description="Handles prediction requests and user registration",
    version="0.2.0"
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

    return resp.json(), resp.status_code

users = []

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

@app.post("/register")
def register_user(request: RegisterRequest):
    hashed_pw = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt())
    users.append({
        "email": request.email,
        "hashed_password": hashed_pw.decode('utf-8')
    })
    return {"message": f"User {request.email} registered successfully."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
