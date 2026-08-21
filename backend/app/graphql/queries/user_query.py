# GraphQL query to fetch current authenticated user
import strawberry

from strawberry.types import Info

from app.graphql.types.user_type import UserType


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

        return UserType(

            id=user.id,

            username=user.username,

            email=user.email

        )