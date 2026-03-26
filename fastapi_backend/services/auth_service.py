from sqlalchemy.orm import Session
from fastapi_backend.models.user import User
from fastapi_backend.schemas.user import UserCreate, UserLogin
from fastapi_backend.utils.auth_utils import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException, status
import logging

# Set up logging
logger = logging.getLogger(__name__)

def create_user(db: Session, user_data: UserCreate):
    # Normalize email to lowercase
    email = user_data.email.lower().strip()
    
    # Check for duplicate email (including deleted users to avoid unique violation)
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        logger.error(f"Registration failed: Email {email} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password using bcrypt
    hashed_password = get_password_hash(user_data.password)

    # Create user object
    db_user = User(
        email=email,
        full_name=user_data.full_name,
        password=hashed_password,
        role=user_data.role
    )

    try:
        # Save to database
        db.add(db_user)
        # Commit to persist changes
        db.commit()
        # Refresh to get the generated id
        db.refresh(db_user)
        logger.info(f"User {db_user.email} registered successfully with ID {db_user.id}")
        return db_user
    except Exception as e:
        # Rollback in case of error
        db.rollback()
        logger.error(f"Database error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred"
        )

def authenticate_user(db: Session, user_data: UserLogin):
    """
    Authenticate user and return user object if successful
    """
    email = user_data.email.lower().strip()
    logger.info(f"Login attempt for email: {email}")

    # Find user by email (don't log in deleted users)
    user = db.query(User).filter(User.email == email, User.is_deleted == False).first()
    
    if not user or not verify_password(user_data.password, user.password):
        logger.warning(f"Failed login attempt for email: {email}")
        return None
    
    logger.info(f"User {user.email} authenticated successfully")
    return user