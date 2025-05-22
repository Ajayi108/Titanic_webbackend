# Database setup for testing __
# CREATE DATABASE titanic_shrank_db;
# CREATE USER titanic_saver WITH PASSWORD 'TitanicMan';
# GRANT ALL PRIVILEGES ON DATABASE titanic_shrank_db TO titanic_saver;

# CREATE TABLE models (
#     id SERIAL PRIMARY KEY,
#     model_name TEXT NOT NULL
# );

# GRANT ALL PRIVILEGES ON TABLE models TO titanic_saver;
# GRANT USAGE, SELECT ON SEQUENCE models_id_seq TO titanic_saver;



import psycopg2

# to Connect to the database server
conn = psycopg2.connect(
    dbname="titanic_shrank_db",
    user="titanic_saver",
    password="TitanicMan",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Function to add and remove model name
def add_name(model_name):
    cursor.execute("INSERT INTO models (model_name) VALUES (%s);", (model_name,))
    conn.commit()
    print(f"Added: {model_name}")

def remove_name(model_name):
    cursor.execute("DELETE FROM models WHERE model_name = %s;", (model_name,))
    conn.commit()
    print(f"Removed: {model_name}")

#To add model name to the table
add_name("Model 1")
#To remove the model name to the table
remove_name("Model 2")


cursor.close()
conn.close()
