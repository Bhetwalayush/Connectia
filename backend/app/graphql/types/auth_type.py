import strawberry

from .user_type import UserType


@strawberry.type
class AuthResponse:

    success: bool

    message: str

    access_token: str | None = None

    user: UserType | None = None