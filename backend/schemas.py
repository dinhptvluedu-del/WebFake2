"""
Pydantic Schemas for API Request and Response validation.
"""

from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = "Jane Doe"
    role: str = "user"  # 'user' or 'admin'


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


# Prediction Schemas
class PredictRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The news article text to analyze")
    threshold: Optional[float] = Field(0.50, ge=0.0, le=1.0, description="Decision boundary threshold")


class TokenAttributionSchema(BaseModel):
    token: str
    weight: float
    type: str


class PredictResponse(BaseModel):
    id: str
    predicted_class: str
    confidence_score: float
    fake_probability: float
    real_probability: float
    token_count: int
    sequence_length: int
    tokens_attribution: List[TokenAttributionSchema]
    inference_time_ms: int
    analyzed_at: datetime
    model_metadata: Dict[str, Any]


# History Schemas
class AnalysisHistoryItem(BaseModel):
    id: str
    user_id: Optional[str] = None
    text_excerpt: str
    full_text: Optional[str] = None
    predicted_class: str
    confidence_score: float
    fake_probability: float
    real_probability: float
    created_at: datetime


class HistoryResponse(BaseModel):
    items: List[AnalysisHistoryItem]
    total: int
    page: int
    limit: int


# Feedback Schemas
class FeedbackCreate(BaseModel):
    analysis_id: str
    is_correct: bool
    rating: str = Field(..., description="'like' or 'dislike'")
    comments: Optional[str] = None


class FeedbackResponse(FeedbackCreate):
    id: str
    user_id: Optional[str] = None
    created_at: datetime


# Admin & System Schemas
class SystemStats(BaseModel):
    total_analyzed: int
    real_news_count: int
    fake_news_count: int
    real_percentage: float
    fake_percentage: float
    total_users: int
    total_feedback: int
    accuracy_satisfaction_rate: float
    average_latency_ms: float
    model_version: str
