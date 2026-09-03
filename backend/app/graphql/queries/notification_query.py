# GraphQL queries for notifications
import strawberry

from strawberry.types import Info

from app.services.notification_service import NotificationService
from app.graphql.types.notification_type import NotificationType
from app.graphql.mappers.notification_mapper import to_notification_type


@strawberry.type
class NotificationQuery:

    @strawberry.field
    def notifications(
        self,
        info: Info,
    ) -> list[NotificationType]:

        current_user = info.context["user"]

        service = NotificationService(
            info.context["db"]
        )

        try:

            notifications = service.get_notifications(
                current_user
            )

            return [
                to_notification_type(notification)
                for notification in notifications
            ]

        except ValueError as e:

            raise ValueError(str(e))