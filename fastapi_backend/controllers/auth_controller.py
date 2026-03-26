from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi_backend.database.connection import get_db
from fastapi_backend.schemas.user import UserCreate, UserResponse, UserLogin, Token, UserRegister
from fastapi_backend.services import auth_service
from fastapi_backend.utils.auth_utils import create_access_token
import logging
import json

# Initialize router
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Set up logging
logger = logging.getLogger(__name__)

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED, response_model_by_alias=True)
async def register(request: Request, user_data: UserRegister, db: Session = Depends(get_db)):
    """
    User Registration API
    - Validates email and password
    - Hashes password using bcrypt
    - Checks for duplicate email
    - Stores user in PostgreSQL
    - Returns user and access token
    """
    # Log incoming request body for debugging
    try:
        body = await request.json()
        safe_body = {k: v for k, v in body.items() if k != "password"}
        logger.info(f"Incoming registration request body: {json.dumps(safe_body)}")
    except Exception as e:
        logger.error(f"Failed to log request body: {str(e)}")

    logger.info(f"Incoming registration request for email: {user_data.email}")

    # Call service layer for user creation
    new_user = auth_service.create_user(db, user_data)
    
    # Create tokens for immediate login after signup
    access_token = create_access_token(data={"sub": new_user.email})
    refresh_token = create_access_token(data={"sub": new_user.email}) # Using same function for simplicity

    return {
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": new_user
    }

@router.post("/login", response_model=Token, response_model_by_alias=True)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    User Login API
    - Verifies user credentials
    - Generates JWT access and refresh tokens
    """
    logger.info(f"Login attempt for email: {user_data.email}")

    # Call service layer for authentication
    user = auth_service.authenticate_user(db, user_data)
    
    if not user:
        logger.warning(f"Failed login attempt for email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_access_token(data={"sub": user.email})
    logger.info(f"User {user.email} logged in successfully")

    return {
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": user
    }