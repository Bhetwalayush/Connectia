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
from app.services.notification_service import NotificationService
from app.models.notification import NotificationType
from app.graphql.subscriptions.notification_events import notification_event_manager

@strawberry.type
class CommentMutation:

    # Create new comment on a post
    @strawberry.mutation
    async def create_comment(
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

            notification_service = NotificationService(
                info.context["db"]
            )

            notification = notification_service.create_notification(
                recipient_id=comment.post.user_id,
                actor_id=current_user.id,
                notification_type=NotificationType.COMMENT,
                post_id=comment.post_id,
            )

            if notification:

                await notification_event_manager.publish(
                    comment.post.user_id,
                    {"notification_id": notification.id},
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