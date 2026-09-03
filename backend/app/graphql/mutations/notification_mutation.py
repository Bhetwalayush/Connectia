# GraphQL mutation for marking notifications as read
import strawberry

from strawberry.types import Info

from app.services.notification_service import NotificationService


@strawberry.type
class NotificationMutation:

    @strawberry.mutation
    def mark_notifications_read(
        self,
        info: Info,
    ) -> bool:

        current_user = info.context["user"]

        if current_user is None:

            return False

        service = NotificationService(
            info.context["db"]
        )

        try:

            service.mark_all_read(
                current_user
            )

            return True

        except ValueError:

            return False