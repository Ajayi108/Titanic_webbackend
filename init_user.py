import psycopg2
import os
from hashlib import sha256

# Hash the password (basic hash for consistency with current setup)
def get_password_hash(password):
    return sha256(password.encode()).hexdigest()

# Connect to the PostgreSQL database using psycopg2
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5432")
)
cursor = conn.cursor()

# Check if admin user exists
cursor.execute("SELECT id FROM users WHERE email = %s;", ("admin@example.com",))
existing_admin = cursor.fetchone()

# If not exists, create admin user
if not existing_admin:
    hashed_pw = get_password_hash("adminpassword")
    cursor.execute("""
        INSERT INTO users (email, password, is_admin)
        VALUES (%s, %s, %s);
    """, ("admin@example.com", hashed_pw, True))
    conn.commit()
    print("✅ Admin user created.")
else:
    print("ℹ️ Admin user already exists.")



# Close connections
cursor.close()
conn.close()