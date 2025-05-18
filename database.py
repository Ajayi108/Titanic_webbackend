


# CREATE DATABASE titanic_shrank_db;
# CREATE USER titanic_saver WITH PASSWORD 'TitanicMan';
# GRANT ALL PRIVILEGES ON DATABASE titanic_shrank_db TO titanic_saver;

from fastapi import FastAPI, Depends
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://titanic_saver:TitanicMan@localhost:5432/titanic_shrank_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
