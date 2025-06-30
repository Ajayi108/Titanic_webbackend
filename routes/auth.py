import psycopg2
import bcrypt
import os
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi import APIRouter, Depends, HTTPException, Form


router = APIRouter(prefix="/auth")

@AuthJWT.load_config
def get_config():
    # must return either a Pydantic BaseSettings **or** a list of (key, value) tuples
    return [
        ("authjwt_secret_key", os.getenv("AUTHJWT_SECRET_KEY", "SUPER_SECRET_KEY")),
        ("authjwt_token_location", {"cookies"}),
        ("authjwt_cookie_secure", False),         # set True in prod (HTTPS)
        ("authjwt_cookie_samesite", "lax"),
        ("authjwt_cookie_csrf_protect", False),
        ("authjwt_access_cookie_key", "access_token"),
        ("authjwt_refresh_cookie_key", "refresh_token"),
    ]


# DB connection to docker
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5432")
)
cursor = conn.cursor()

# Password utilities
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# Register a new user
@router.post("/register")
async def register_user(
    email: str = Form(...),
    password: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    is_admin: bool = Form(False)
):
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = %s;", (email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and insert user
    hashed_pw = hash_password(password)
    cursor.execute("""
        INSERT INTO users (email, password, first_name, last_name, is_admin)
        VALUES (%s, %s, %s, %s, %s);
    """, (email, hashed_pw, first_name, last_name, is_admin))
    conn.commit()

    return {"message": "✅ User registered successfully"}

# User login
@router.post("/login")
async def login_user(
    email: str = Form(...),
    password: str = Form(...),
    Authorize: AuthJWT = Depends(),
):
    # Look up user by email
    cursor.execute("SELECT id, password, is_admin, first_name, last_name FROM users WHERE email = %s;", (email,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id, stored_pw, is_admin, first_name, last_name = row

    # Verify password
    if not verify_password(password, stored_pw):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token  = Authorize.create_access_token(
        subject=str(user_id),
        user_claims={"email": email, "is_admin": is_admin}
    )

    #define or assign refresh_token before trying to use it.
    refresh_token = Authorize.create_refresh_token(subject=str(user_id))

    resp = JSONResponse({
        "message": "✅ Login successful",
        "user": {
            "id": user_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "is_admin": is_admin
        }
    })
    Authorize.set_access_cookies(access_token, resp)
    Authorize.set_refresh_cookies(refresh_token, resp)
    return resp


# ─── Refresh Endpoint ────────────────────────────────────
@router.post("/refresh")
def refresh(Authorize: AuthJWT = Depends()):
    Authorize.jwt_refresh_token_required()
    current_user = Authorize.get_jwt_subject()
    new_access   = Authorize.create_access_token(subject=current_user)
    resp = JSONResponse({"message": "✅ Token refreshed"})
    Authorize.set_access_cookies(new_access, resp)
    return resp


# ─── Protected “Me” Endpoint ─────────────────────────────
@router.get("/me")
def get_profile(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    claims  = Authorize.get_raw_jwt()
    return {
        "user_id": user_id,
        "email": claims.get("email"),
        "is_admin": claims.get("is_admin")
    }

