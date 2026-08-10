import strawberry

from strawberry.types import Info

from app.graphql.types.user_type import UserType


@strawberry.type
class UserQuery:

    @strawberry.field

    def me(

        self,

        info: Info

    ) -> UserType:

        user = info.context["user"]

        if user is None:

            raise Exception(
                "Unauthorized"
            )

        return UserType(

            id=user.id,

            username=user.username,

            email=user.email

        )