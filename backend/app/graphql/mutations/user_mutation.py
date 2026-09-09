# GraphQL mutations for the current user's own profile and password
import strawberry

from strawberry.types import Info

from app.graphql.inputs.user_input import (
    UpdateProfileInput,
    ChangePasswordInput,
)

from app.graphql.types.user_response import UserResponse

from app.graphql.queries.user_query import to_user_type

from app.services.user_service import UserService


@strawberry.type
class UserMutation:

    @strawberry.mutation
    def update_profile(
        self,
        info: Info,
        input: UpdateProfileInput
    ) -> UserResponse:

        current_user = info.context["user"]

        if current_user is None:

            return UserResponse(
                success=False,
                message="Authentication required."
            )

        service = UserService(
            info.context["db"]
        )

        try:

            user = service.update_profile(

                current_user=current_user,

                username=input.username,

                bio=input.bio,

            )

            return UserResponse(

                success=True,

                message="Profile updated successfully.",

                user=to_user_type(user)

            )

        except ValueError as e:

            return UserResponse(

                success=False,

                message=str(e)

            )

    @strawberry.mutation
    def change_password(
        self,
        info: Info,
        input: ChangePasswordInput
    ) -> UserResponse:

        current_user = info.context["user"]

        if current_user is None:

            return UserResponse(
                success=False,
                message="Authentication required."
            )

        service = UserService(
            info.context["db"]
        )

        try:

            service.change_password(

                current_user=current_user,

                current_password=input.current_password,

                new_password=input.new_password,

            )

            return UserResponse(

                success=True,

                message="Password changed successfully."

            )

        except ValueError as e:

            return UserResponse(

                success=False,

                message=str(e)

            )