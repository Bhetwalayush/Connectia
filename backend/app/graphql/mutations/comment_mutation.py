# GraphQL mutations for comments (create, update, delete)
import strawberry

from strawberry.types import Info

from app.graphql.inputs.comment_input import (
    CreateCommentInput,
    UpdateCommentInput
)

from app.graphql.types.comment_response import (
    CommentResponse
)

from app.graphql.types.delete_response import (
    DeleteResponse
)

from app.graphql.mappers.comment_mapper import (
    to_comment_type
)

from app.services.comment_service import (
    CommentService
)


@strawberry.type
class CommentMutation:

    # Create new comment on a post
    @strawberry.mutation
    def create_comment(
        self,
        info: Info,
        input: CreateCommentInput
    ) -> CommentResponse:

        current_user = info.context["user"]

        if current_user is None:

            return CommentResponse(
                success=False,
                message="Authentication required."
            )

        service = CommentService(
            info.context["db"]
        )

        try:

            comment = service.create_comment(

                post_id=input.post_id,

                content=input.content,

                current_user=current_user

            )

            return CommentResponse(

                success=True,

                message="Comment created successfully.",

                comment=to_comment_type(comment)

            )

        except ValueError as e:

            return CommentResponse(

                success=False,

                message=str(e)

            )

    @strawberry.mutation
    def update_comment(
        self,
        info: Info,
        input: UpdateCommentInput
    ) -> CommentResponse:

        current_user = info.context["user"]

        if current_user is None:

            return CommentResponse(
                success=False,
                message="Authentication required."
            )

        service = CommentService(
            info.context["db"]
        )

        try:

            comment = service.update_comment(

                comment_id=input.comment_id,

                content=input.content,

                current_user=current_user

            )

            return CommentResponse(

                success=True,

                message="Comment updated successfully.",

                comment=to_comment_type(comment)

            )

        except ValueError as e:

            return CommentResponse(

                success=False,

                message=str(e)

            )

    @strawberry.mutation
    def delete_comment(
        self,
        info: Info,
        comment_id: int
    ) -> DeleteResponse:

        current_user = info.context["user"]

        if current_user is None:

            return DeleteResponse(
                success=False,
                message="Authentication required."
            )

        service = CommentService(
            info.context["db"]
        )

        try:

            service.delete_comment(

                comment_id=comment_id,

                current_user=current_user

            )

            return DeleteResponse(

                success=True,

                message="Comment deleted successfully."

            )

        except ValueError as e:

            return DeleteResponse(

                success=False,

                message=str(e)

            )