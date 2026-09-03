from collections.abc import AsyncGenerator

import strawberry

from app.graphql.types.inbox_event_type import InboxEvent

from app.graphql.subscriptions.notification_events import (
    inbox_event_manager
)


@strawberry.type
class InboxSubscription:

    # Personal channel: fires for this user whenever any of their
    # conversations gets a new message or a read update, regardless of
    # which conversation. Used to drive sidebar badges, and reusable later
    # for a general notifications feed.
    @strawberry.subscription
    async def inbox_updated(
        self,
        user_id: int
    ) -> AsyncGenerator[InboxEvent, None]:

        queue = inbox_event_manager.subscribe(
            user_id
        )

        try:

            while True:

                event = await queue.get()

                yield InboxEvent(
                    conversation_id=event["conversation_id"],
                    action=event["action"],
                    actor_id=event["actor_id"],
                )

        finally:

            inbox_event_manager.unsubscribe(
                user_id,
                queue
            )