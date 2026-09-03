# Notification service - creates and reads notifications
from sqlalchemy.orm import Session

from app.models.notification import Notification, NotificationType
from app.repositories.notification_repository import NotificationRepository


class NotificationService:

    def __init__(self, db: Session):

        self.notification_repository = NotificationRepository(db)

    def create_notification(
        self,
        recipient_id: int,
        actor_id: int,
        notification_type: NotificationType,
        post_id: int | None = None,
    ):

        # Never notify a user about their own action
        if recipient_id == actor_id:

            return None

        notification = Notification(

            recipient_id=recipient_id,

            actor_id=actor_id,

            type=notification_type,

            post_id=post_id,

        )

        return self.notification_repository.create_notification(
            notification
        )

    def get_notifications(
        self,
        current_user,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        return self.notification_repository.get_notifications_for_user(
            current_user.id
        )

    def mark_all_read(
        self,
        current_user,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        return self.notification_repository.mark_all_read(
            current_user.id
        )