import strawberry

from app.graphql.types.user_type import UserType


@strawberry.type
class UserResponse:

    success: bool

    message: str

    user: UserType | None = None