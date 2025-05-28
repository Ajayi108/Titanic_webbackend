from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.proxy_predict import router as predict_router
from routes.proxy_train   import router as train_router

app = FastAPI(
    title="Titanic Web Backend",
    description="Handles prediction requests and user registration",
    version="0.2.0"
)

# this Allow React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(train_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
