import psycopg2
import os

# to Connect to the database server
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5432")
)
cursor = conn.cursor()


# Function to create users and predictions tables
def create_tables():
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

def add_trained_model(model_name, feature_key, file_name):
    cursor.execute("""
        SELECT id FROM trained_models
        WHERE model_name = %s AND feature_key = %s AND file_name = %s;
    """, (model_name, feature_key, file_name))
    if cursor.fetchone():
        print("⚠️ Trained model already exists. Skipping insert.")
    else:
        cursor.execute("""
            INSERT INTO trained_models (model_name, feature_key, file_name)
            VALUES (%s, %s, %s);
        """, (model_name, feature_key, file_name))
        conn.commit()
        print("✅ First Trained model added.")


# Function to add and remove model name
def add_name(model_name):
    cursor.execute("INSERT INTO models (model_name) VALUES (%s);", (model_name,))
    conn.commit()
    print(f"Added: {model_name}")

def remove_name(model_name):
    cursor.execute("DELETE FROM models WHERE model_name = %s;", (model_name,))
    conn.commit()
    print(f"Removed: {model_name}")

# Function to add user
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

# Function to add prediction
def add_prediction(user_id, model_name, pclass, sex, age, fare, is_alone, embarked, title, result):
    cursor.execute("""
        INSERT INTO predictions (user_id, model_name, pclass, sex, age, fare, is_alone, embarked, title, result)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (user_id, model_name, pclass, sex, age, fare, is_alone, embarked, title, result))
    conn.commit()
    print(f"✅ Prediction added for user_id {user_id}")

# Step 1: Create tables
create_tables()
#this is to store the name and features of the first anomymous user model
add_trained_model(
    model_name="decision_tree",
    feature_key="Age-Embarked-Fare-IsAlone-Pclass-Sex-Title",
    file_name="decision_tree-Age-Embarked-Fare-IsAlone-Pclass-Sex-Title"
)
"""
# Step 2: Add sample model names
add_name("Model 1")
remove_name("Model 2")

# Step 3: Add sample user
add_user("hamza@ai.com", "secret")

# Step 4: Add sample prediction
add_prediction(
    user_id=1,
    model_name="RandomForest",
    pclass=3,
    sex="male",
    age=24.0,
    fare=7.25,
    is_alone=True,
    embarked="Southampton",
    title="Mr",
    result="Did not survive"
)

"""

# Step 5: Close connections
cursor.close()
conn.close()
