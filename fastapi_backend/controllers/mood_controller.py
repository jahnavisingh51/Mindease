from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi_backend.database.connection import get_db
from fastapi_backend.utils.auth_utils import get_current_user
from fastapi_backend.models.user import User
from datetime import datetime, timedelta
import logging

router = APIRouter(prefix="/mood", tags=["Mood Tracking"])
logger = logging.getLogger(__name__)

@router.get("")
async def get_moods(current_user: User = Depends(get_current_user)):
    """
    Fetch user mood history
    """
    logger.info(f"Fetching moods for user: {current_user.email}")
    # Returning sample data
    return []

@router.post("")
async def log_mood(mood_data: dict, current_user: User = Depends(get_current_user)):
    """
    Log daily mood
    """
    logger.info(f"Logging mood for user: {current_user.email}")
    return {"status": "success", "message": "Mood logged successfully"}

@router.get("/stats")
async def get_mood_stats(current_user: User = Depends(get_current_user)):
    """
    Fetch mood analytics and trends
    """
    logger.info(f"Fetching mood stats for user: {current_user.email}")
    
    # Returning sample data for the chart
    today = datetime.now()
    trend = []
    for i in range(6, -1, -1):
        date = (today - timedelta(days=i)).strftime("%b %d")
        trend.append({"date": date, "mood": 3 + (i % 3)}) # Mock scores between 3 and 5
        
    return {
        "average": 3.8,
        "trend": trend
    }
