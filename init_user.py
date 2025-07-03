from routes.auth import hash_password
from psycopg2 import connect
import os

def create_admin_user():
    admin_email = "admin@ice.com"
    admin_password = "pass"
    hashed_pw = hash_password(admin_password)
    admin_firtsname = "Admin"
    admin_lastname = "Titanic"


    # Create a new database connection
    conn = connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432")
    )
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id FROM users WHERE email = %s;", (admin_email,))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO users (email, password, first_name, last_name, is_admin)
                VALUES (%s, %s, %s, %s, %s);
            """, (admin_email, hashed_pw, admin_firtsname, admin_lastname, True))
            conn.commit()
            print(f"✅ Admin user created: {admin_email}")
        else:
            print(f"⚠️ Admin user already exists: {admin_email}")
    finally:
        cursor.close()
        conn.close()