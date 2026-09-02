# GraphQL query to fetch current authenticated user
import strawberry

from strawberry.types import Info

from app.graphql.types.user_type import UserType
from app.repositories.user_repository import UserRepository


def to_user_type(user) -> UserType:
    return UserType(
        id=user.id,
        username=user.username,
        email=user.email,
    )


@strawberry.type
class UserQuery:

    # Get current authenticated user from JWT token
    @strawberry.field

    def me(

        self,

        info: Info

    ) -> UserType | None:

        user = info.context["user"]

        if user is None:
            return None

        return to_user_type(user)

    @strawberry.field
    def user(self, info: Info, user_id: int) -> UserType | None:
        user = UserRepository(info.context["db"]).get_user_by_id(user_id)

        return to_user_type(user) if user else None


    # Search users by username, excluding the current user, for search bars
    @strawberry.field
    def search_users(self, info: Info, query: str) -> list[UserType]:

        if not query or not query.strip():
            return []

        current_user = info.context["user"]

        users = UserRepository(info.context["db"]).search_users_by_username(
            query=query.strip(),
            exclude_user_id=current_user.id if current_user else None,
        )

        return [to_user_type(user) for user in users]
