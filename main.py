from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_jwt_auth.exceptions import AuthJWTException

from routes.proxy_predict import router as predict_router
from routes.proxy_train   import router as train_router
from routes.auth import router as auth_router

app = FastAPI(
    title="Titanic Web Backend",
    description="Handles prediction requests and user registration",
    version="0.3.0"
)

# JWT error handler
@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})



# this Allow React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(predict_router)
app.include_router(train_router)
app.include_router(auth_router)  


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
