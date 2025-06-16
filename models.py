from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Will store hashed passwords
    is_admin = Column(Boolean, default=False)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    model_name = Column(String)  # e.g. "RandomForest"
    pclass = Column(Integer)     # 1, 2, or 3
    sex = Column(String)         # "male" or "female"
    age = Column(Float)
    fare = Column(Float)
    is_alone = Column(Boolean)
    embarked = Column(String)    # "S", "Q", "C"
    title = Column(String)       # "Mr", "Mrs", etc.
    result = Column(String)      # "Survived" or "Died"
    created_at = Column(DateTime(timezone=True), server_default=func.now())