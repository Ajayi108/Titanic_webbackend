#!/bin/sh

echo "starting postgresl"

# waits for the db to accept connection
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  sleep 1
done

echo "database connected"

# initial table setup
echo "initial table setup"
python database.py

# Start fastapi app
echo "starting fastapi server"
exec uvicorn main:app --host 0.0.0.0 --port 5000
