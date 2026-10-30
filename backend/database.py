"""
Database models and session management using SQLAlchemy ORM.
Supports SQLite (file-based or in-memory) and PostgreSQL.
"""

import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./veritas_fakenews.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), default="Jane Doe")
    role = Column(String(32), default="user")  # 'user' or 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    text_excerpt = Column(String(500), nullable=False)
    full_text = Column(Text, nullable=False)
    predicted_class = Column(String(32), nullable=False)  # 'Real News' or 'Fake News'
    confidence_score = Column(Float, nullable=False)
    fake_probability = Column(Float, nullable=False)
    real_probability = Column(Float, nullable=False)
    token_count = Column(Integer, default=0)
    sequence_length = Column(Integer, default=0)
    inference_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")
    feedbacks = relationship("Feedback", back_populates="prediction", cascade="all, delete-orphan")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(String(64), primary_key=True, index=True)
    prediction_id = Column(String(64), ForeignKey("predictions.id"), nullable=False)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    rating = Column(String(16), nullable=False)  # 'like' or 'dislike'
    is_correct = Column(Boolean, nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")
    prediction = relationship("Prediction", back_populates="feedbacks")


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
