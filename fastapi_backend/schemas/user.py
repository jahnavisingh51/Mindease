from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, alias="fullName")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

class UserCreate(UserBase):
    full_name: str = Field(..., alias="fullName")  # Required for registration
    password: str = Field(..., min_length=8)
    role: Optional[str] = "user"

class UserRegister(UserCreate):
    """
    Alias for UserCreate to match user request requirements
    """
    pass

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    model_config = ConfigDict(populate_by_name=True)

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class Token(BaseModel):
    access_token: str = Field(..., alias="accessToken")
    refresh_token: str = Field(..., alias="refreshToken")
    user: UserResponse

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

class TokenData(BaseModel):
    email: Optional[str] = None