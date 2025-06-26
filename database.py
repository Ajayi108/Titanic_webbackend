import psycopg2
import os

# Database connection
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5432")
)
cursor = conn.cursor()

def create_tables():
    """Create all tables if they don't exist"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            is_admin BOOLEAN DEFAULT FALSE
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            model_name TEXT NOT NULL,
            pclass INTEGER,
            sex TEXT,
            age FLOAT,
            fare FLOAT,
            is_alone BOOLEAN,
            embarked TEXT,
            title TEXT,
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trained_models (
            id SERIAL PRIMARY KEY,
            model_name TEXT NOT NULL,
            feature_key TEXT NOT NULL,
            file_name TEXT NOT NULL,
            trained_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    """)
    conn.commit()
    print("✅ Tables created successfully.")

def update_tables():
    """Add new columns to existing tables"""
    try:
        # Add new columns if they don't exist
        cursor.execute("""
            ALTER TABLE trained_models 
            ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
        """)
        cursor.execute("""
            ALTER TABLE trained_models 
            ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT FALSE;
        """)
        conn.commit()
        print("✅ Tables updated successfully.")
    except Exception as e:
        print(f"⚠️ Table update error: {e}")
        conn.rollback()

def add_trained_model(model_name, feature_key, file_name, user_id=None, is_global=False):
    """Add a trained model to the database"""
    try:
        cursor.execute("""
            INSERT INTO trained_models 
            (model_name, feature_key, file_name, user_id, is_global)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, (model_name, feature_key, file_name, user_id, is_global))
        conn.commit()
        model_type = "global" if is_global else f"user {user_id}'s" if user_id else "anonymous"
        print(f"✅ {model_type} model added: {model_name}")
    except Exception as e:
        print(f"⚠️ Error adding model: {e}")
        conn.rollback()

def get_admin_id():
    """Get admin user ID"""
    cursor.execute("SELECT id FROM users WHERE email = 'admin@example.com';")
    result = cursor.fetchone()
    return result[0] if result else None

def add_admin_model(model_name, feature_key, file_name):
    """Add admin-specific model"""
    admin_id = get_admin_id()
    if admin_id:
        add_trained_model(
            model_name=model_name,
            feature_key=feature_key,
            file_name=file_name,
            user_id=admin_id
        )
    else:
        print("⚠️ Admin user not found. Create admin first.")

def init_admin_with_models():
    """Initialize admin user and models"""
    from init_user import create_admin_user
    create_admin_user()
    
    # Add admin-specific models
    add_admin_model(
        model_name="admin_premium_model",
        feature_key="Full-Feature-Set",
        file_name="admin_premium_v1"
    )
    
    add_admin_model(
        model_name="admin_optimized_rf",
        feature_key="Optimized-Features",
        file_name="admin_rf_optimized"
    )

# --- Existing functions remain unchanged ---
def add_name(model_name):
    cursor.execute("INSERT INTO models (model_name) VALUES (%s);", (model_name,))
    conn.commit()
    print(f"Added: {model_name}")

def remove_name(model_name):
    cursor.execute("DELETE FROM models WHERE model_name = %s;", (model_name,))
    conn.commit()
    print(f"Removed: {model_name}")

def add_user(email, password, is_admin=False):
    cursor.execute("SELECT id FROM users WHERE email = %s;", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        print(f"⚠️ User already exists: {email}")
    else:
        cursor.execute("""
            INSERT INTO users (email, password, is_admin)
            VALUES (%s, %s, %s);
        """, (email, password, is_admin))
        conn.commit()
        print(f"✅ User added: {email}")

def add_prediction(user_id, model_name, pclass, sex, age, fare, is_alone, embarked, title, result):
    cursor.execute("""
        INSERT INTO predictions (user_id, model_name, pclass, sex, age, fare, is_alone, embarked, title, result)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (user_id, model_name, pclass, sex, age, fare, is_alone, embarked, title, result))
    conn.commit()
    print(f"✅ Prediction added for user_id {user_id}")

# --- Initialization ---
create_tables()
update_tables()  # This will add new columns if needed

# Add anonymous model (global)
add_trained_model(
    model_name="decision_tree",
    feature_key="Age-Embarked-Fare-IsAlone-Pclass-Sex-Title",
    file_name="decision_tree-Age-Embarked-Fare-IsAlone-Pclass-Sex-Title",
    is_global=True
)

# Initialize admin and models
init_admin_with_models()

# Close connections
cursor.close()
conn.close()