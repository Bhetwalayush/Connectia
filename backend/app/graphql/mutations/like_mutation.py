# GraphQL mutations for likes (like_post, unlike_post)
import strawberry

from strawberry.types import Info

from app.graphql.inputs.like_input import LikeInput

from app.graphql.types.like_response import LikeResponse

from app.graphql.mappers.like_mapper import to_like_type

from app.services.like_service import LikeService

from app.graphql.subscriptions.like_events import (
    like_event_manager
)

from app.graphql.types.like_event_type import (
    LikeAction
)

from app.services.notification_service import NotificationService
from app.models.notification import NotificationType
from app.graphql.subscriptions.notification_events import notification_event_manager

@strawberry.type
class LikeMutation:

    # Like a post with broadcast to subscribed clients
    @strawberry.mutation
    async def like_post(
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

            notification_service = NotificationService(
                info.context["db"]
            )

            post = service.post_repository.get_post_by_id(
                input.post_id
            )

            notification = notification_service.create_notification(
                recipient_id=post.user_id,
                actor_id=current_user.id,
                notification_type=NotificationType.LIKE,
                post_id=post.id,
            )

            if notification:

                await notification_event_manager.publish(
                    post.user_id,
                    {"notification_id": notification.id},
                )

            like_count = service.get_like_count(
                input.post_id
            )
            await like_event_manager.publish(

                post_id=input.post_id,

                event={
                    "post_id": input.post_id,
                    "user_id": current_user.id,
                    "like_count": like_count,
                    "action": LikeAction.LIKED
                }

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
    async def unlike_post(
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
            await like_event_manager.publish(

                post_id=input.post_id,

                event={

                    "post_id": input.post_id,

                    "user_id": current_user.id,

                    "like_count": like_count,

                    "action": LikeAction.UNLIKED

                }

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
