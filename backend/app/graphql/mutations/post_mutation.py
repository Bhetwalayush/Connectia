# GraphQL mutations for posts (create, update, delete)
import strawberry

from strawberry.types import Info

from app.graphql.inputs.post_input import CreatePostInput
from app.graphql.types.post_response import PostResponse
from app.graphql.types.post_type import PostType
from app.graphql.inputs.post_input import UpdatePostInput
from app.graphql.types.delete_response import DeleteResponse
from app.graphql.mappers.post_mapper import to_post_type
from app.services.post_service import PostService


@strawberry.type
class PostMutation:

    # Create new post with authentication check
    @strawberry.mutation
    def create_post(
        self,
        info: Info,
        input: CreatePostInput
    ) -> PostResponse:

        current_user = info.context["user"]

        if current_user is None:

            return PostResponse(
                success=False,
                message="Authentication required."
            )

        service = PostService(
            info.context["db"]
        )

        try:

            post = service.create_post(
                content=input.content,
                image_url=input.image_url,
                current_user=current_user
            )

            return PostResponse(
                success=True,
                message="Post created successfully.",
                post=to_post_type(post)
            )

        except ValueError as e:

            return PostResponse(
                success=False,
                message=str(e)
            )

    @strawberry.mutation
    def update_post(
        self,
        info: Info,
        input: UpdatePostInput
    ) -> PostResponse:

        current_user = info.context["user"]

        if current_user is None:
            return PostResponse(
                success=False,
                message="Authentication required."
            )

        service = PostService(
            info.context["db"]
        )

        try:

            post = service.update_post(
                post_id=input.post_id,
                content=input.content,
                image_url=input.image_url,
                current_user=current_user
            )

            return PostResponse(
                success=True,
                message="Post updated successfully.",
                post=to_post_type(post)
            )

        except ValueError as e:

            return PostResponse(
                success=False,
                message=str(e)
            )

    @strawberry.mutation
    def delete_post(
        self,
        info: Info,
        post_id: int
    ) -> DeleteResponse:

        current_user = info.context["user"]

        if current_user is None:

            return DeleteResponse(
                success=False,
                message="Authentication required."
            )

        service = PostService(
            info.context["db"]
        )

        try:

            service.delete_post(
                post_id=post_id,
                current_user=current_user
            )

            return DeleteResponse(
                success=True,
                message="Post deleted successfully."
            )

        except ValueError as e:

            return DeleteResponse(
                success=False,
                message=str(e)
            )