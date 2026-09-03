from collections.abc import AsyncGenerator

import strawberry

from app.graphql.types.notification_event_type import NotificationEvent

from app.graphql.subscriptions.notification_events import (
    notification_event_manager
)


@strawberry.type
class NotificationSubscription:

    @strawberry.subscription
    async def notifications_updated(
        self,
        user_id: int
    ) -> AsyncGenerator[NotificationEvent, None]:

        queue = notification_event_manager.subscribe(
            user_id
        )

        try:

            while True:

                event = await queue.get()

                yield NotificationEvent(
                    notification_id=event["notification_id"],
                )

        finally:

            notification_event_manager.unsubscribe(
                user_id,
                queue
            )