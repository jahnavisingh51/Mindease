from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi_backend.database.connection import get_db
from fastapi_backend.utils.auth_utils import get_current_user
from fastapi_backend.models.user import User
from datetime import datetime
import logging

router = APIRouter(prefix="/chat", tags=["AI Chat Support"])
logger = logging.getLogger(__name__)

@router.get("")
async def get_chats(current_user: User = Depends(get_current_user)):
    """
    Fetch user chat history
    """
    logger.info(f"Fetching chats for user: {current_user.email}")
    
    # Return sample chats as requested for the dashboard
    # Ensuring consistency with the frontend ChatMessage interface
    return [
        {
            "id": "1",
            "userId": str(current_user.id),
            "role": "user",
            "content": "Feeling a bit stressed today.",
            "sentiment": "stress",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "2",
            "userId": str(current_user.id),
            "role": "assistant",
            "content": "I'm sorry you're feeling that way. Remember to take deep breaths.",
            "sentiment": "neutral",
            "createdAt": datetime.now().isoformat()
        }
    ]

@router.post("")
async def send_message(message_data: dict, current_user: User = Depends(get_current_user)):
    """
    Process chat message and return AI response
    """
    logger.info(f"Message received from user: {current_user.email}")
    
    # Frontend expects { response, sentiment, id, createdAt }
    return {
        "id": "3",
        "userId": str(current_user.id),
        "role": "assistant",
        "response": "I'm here for you. How else can I help?",
        "content": "I'm here for you. How else can I help?",
        "sentiment": "neutral",
        "createdAt": datetime.now().isoformat()
    }
