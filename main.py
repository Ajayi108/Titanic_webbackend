from fastapi import FastAPI, Body, HTTPException
from pydantic import BaseModel, EmailStr
import bcrypt
import uvicorn
from routes.proxy_predict import router as predict_router
from routes.proxy_train   import router as train_router

app = FastAPI(
    title="Titanic Web Backend",
    description="Handles prediction requests and user registration",
    version="0.2.0"
)

app.include_router(predict_router)
app.include_router(train_router)

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
