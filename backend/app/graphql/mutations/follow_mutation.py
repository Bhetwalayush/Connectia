import strawberry
from strawberry.types import Info
from app.services import follow_service
from app.services.notification_service import NotificationService
from app.models.notification import NotificationType
from app.graphql.subscriptions.notification_events import notification_event_manager


@strawberry.type
class FollowMutations:

    @strawberry.mutation
    async def follow_user(self, info: Info, user_id: int) -> bool:
        db = info.context["db"]
        current_user = info.context["user"]
        if not current_user:
            raise Exception("Authentication required")

        follow_service.follow_user(db, current_user.id, user_id)

        notification_service = NotificationService(db)

        notification = notification_service.create_notification(
            recipient_id=user_id,
            actor_id=current_user.id,
            notification_type=NotificationType.FOLLOW,
        )

        if notification:

            await notification_event_manager.publish(
                user_id,
                {"notification_id": notification.id},
            )

        return True

    @strawberry.mutation
    def unfollow_user(self, info: Info, user_id: int) -> bool:
        db = info.context["db"]
        current_user = info.context["user"]
        if not current_user:
            raise Exception("Authentication required")

        follow_service.unfollow_user(db, current_user.id, user_id)
        return True