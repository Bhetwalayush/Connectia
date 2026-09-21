# User service - profile updates and password changes
from sqlalchemy.orm import Session

from app.core.security import verify_password, hash_password
from app.repositories.user_repository import UserRepository


class UserService:

    def __init__(self, db: Session):

        self.user_repository = UserRepository(db)

    def update_profile(
        self,
        current_user,
        username: str | None,
        bio: str | None,
        profile_picture_url: str | None = None,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        if username is not None:

            trimmed = username.strip()

            if not trimmed:

                raise ValueError(
                    "Username cannot be empty."
                )

            if trimmed != current_user.username:

                existing = self.user_repository.get_user_by_username(
                    trimmed
                )

                if existing:

                    raise ValueError(
                        "That username is already taken."
                    )

            current_user.username = trimmed

        if bio is not None:

            current_user.bio = bio.strip()

        if profile_picture_url is not None:

            current_user.profile_picture_url = profile_picture_url

        return self.user_repository.update_user(
            current_user
        )

    def change_password(
        self,
        current_user,
        current_password: str,
        new_password: str,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        if not verify_password(
            current_password,
            current_user.password
        ):

            raise ValueError(
                "Current password is incorrect."
            )

        if len(new_password) < 8:

            raise ValueError(
                "New password must be at least 8 characters."
            )

        current_user.password = hash_password(
            new_password
        )

        return self.user_repository.update_user(
            current_user
        )