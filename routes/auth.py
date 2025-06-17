from fastapi import APIRouter, Form, HTTPException
import psycopg2
import bcrypt

router = APIRouter()

# Database connection (hardcoded)
conn = psycopg2.connect(
    dbname="titanic_shrank_db",
    user="titanic_saver",
    password="TitanicMan",
    host="localhost",
    port="5432"
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
    password: str = Form(...)
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

    return {
        "message": "✅ Login successful",
        "user_id": user_id,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "is_admin": is_admin
    }
