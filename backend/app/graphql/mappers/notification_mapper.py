from app.graphql.types.notification_type import NotificationType
from app.graphql.types.user_type import UserType


def to_notification_type(notification):

    return NotificationType(

        id=notification.id,

        type=notification.type.value,

        created_at=notification.created_at,

        read_at=notification.read_at,

        actor=UserType(

            id=notification.actor.id,

            username=notification.actor.username,

            email=notification.actor.email,

        ),

        post_id=notification.post_id,

    )