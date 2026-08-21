# Pydantic schema for user registration input
from pydantic import BaseModel, EmailStr


# Input validation schema for user creation
class UserCreate(BaseModel):

    username: str

    email: EmailStr  # Validates email format

    password: str