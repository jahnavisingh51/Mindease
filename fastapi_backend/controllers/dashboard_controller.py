from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi_backend.database.connection import get_db
from fastapi_backend.utils.auth_utils import get_current_user
from fastapi_backend.models.user import User
import logging

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
logger = logging.getLogger(__name__)

@router.get("/summary")
async def get_dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get summary data for the dashboard
    """
    logger.info(f"Fetching dashboard summary for user: {current_user.email}")
    
    # In a real app, these would be calculated from the database
    # For now, returning sample data as requested
    return {
        "totalChats": 10,
        "averageMoodScore": 3.5,
        "userActivitySummary": []
    }

@router.get("")
async def get_dashboard_root(current_user: User = Depends(get_current_user)):
    """
    General dashboard endpoint
    """
    return {
        "total_chats": 10,
        "average_mood": 3.5
    }
