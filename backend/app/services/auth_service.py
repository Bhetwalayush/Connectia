# Authentication service - Handles user registration and login logic
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.core.security import (
    verify_password,
    create_access_token
)

class AuthService:

    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    # Register new user with username/email validation and password hashing
    def register_user(
        self,
        user_data: UserCreate
    ):
        existing_username = (
            self.user_repository
            .get_user_by_username(
                user_data.username
            )
        )

        if existing_username:
            raise ValueError(
                "Username already exists."
            )

        existing_email = (
            self.user_repository
            .get_user_by_email(
                user_data.email
            )
        )

        if existing_email:
            raise ValueError(
                "Email already registered."
            )

        user_data.password = hash_password(
            user_data.password
        )

        user = (
            self.user_repository
            .create_user(user_data)
        )
    
        return user
    
    # Authenticate user and return JWT token on success
    def login_user(
        self,
        email: str,
        password: str
    ):

        user = self.user_repository.get_user_by_email(
            email
        )

        if not user:

            raise ValueError(
                "Invalid email or password."
            )

        if not verify_password(
            password,
            user.password
        ):

            raise ValueError(
                "Invalid email or password."
            )

        token = create_access_token(
            {
                "sub": str(user.id)
            }
        )

        return {

            "token": token,

            "user": user

        }