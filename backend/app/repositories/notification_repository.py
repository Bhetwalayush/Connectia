# Notification repository - Database access layer for notifications
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:

    def __init__(self, db: Session):

        self.db = db

    def create_notification(
        self,
        notification: Notification
    ):

        self.db.add(notification)

        self.db.commit()

        self.db.refresh(notification)

        return notification

    def get_notifications_for_user(
        self,
        user_id: int,
        limit: int = 30,
    ):

        return (
            self.db.query(Notification)
            .filter(
                Notification.recipient_id == user_id
            )
            .order_by(
                Notification.created_at.desc()
            )
            .limit(limit)
            .all()
        )

    def mark_all_read(
        self,
        user_id: int,
    ):

        unread = (
            self.db.query(Notification)
            .filter(
                Notification.recipient_id == user_id,
                Notification.read_at.is_(None),
            )
            .all()
        )

        from datetime import datetime, timezone

        now = datetime.now(timezone.utc)

        for notification in unread:

            notification.read_at = now

        self.db.commit()

        return unread