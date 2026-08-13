import strawberry

from strawberry.types import Info

from app.graphql.inputs.like_input import LikeInput

from app.graphql.types.like_response import LikeResponse

from app.graphql.mappers.like_mapper import to_like_type

from app.services.like_service import LikeService


@strawberry.type
class LikeMutation:

    @strawberry.mutation
    def like_post(
        self,
        info: Info,
        input: LikeInput
    ) -> LikeResponse:

        current_user = info.context["user"]

        if current_user is None:

            return LikeResponse(
                success=False,
                message="Authentication required."
            )

        service = LikeService(
            info.context["db"]
        )

        try:

            like = service.like_post(

                post_id=input.post_id,

                current_user=current_user

            )

            like_count = service.get_like_count(
                input.post_id
            )

            return LikeResponse(

                success=True,

                message="Post liked successfully.",

                like=to_like_type(like),

                like_count=like_count

            )

        except ValueError as e:

            return LikeResponse(

                success=False,

                message=str(e),

                like_count=service.get_like_count(
                    input.post_id
                )

            )

    @strawberry.mutation
    def unlike_post(
        self,
        info: Info,
        input: LikeInput
    ) -> LikeResponse:

        current_user = info.context["user"]

        if current_user is None:

            return LikeResponse(
                success=False,
                message="Authentication required."
            )

        service = LikeService(
            info.context["db"]
        )

        try:

            service.unlike_post(

                post_id=input.post_id,

                current_user=current_user

            )

            like_count = service.get_like_count(
                input.post_id
            )

            return LikeResponse(

                success=True,

                message="Post unliked successfully.",

                like=None,

                like_count=like_count

            )

        except ValueError as e:

            return LikeResponse(

                success=False,

                message=str(e),

                like_count=service.get_like_count(
                    input.post_id
                )

            )
