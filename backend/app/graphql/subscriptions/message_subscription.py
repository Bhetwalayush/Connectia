from collections.abc import AsyncGenerator

import strawberry

from app.graphql.types.message_event_type import (
    MessageEvent,
    MessageAction
)

from app.graphql.subscriptions.message_events import (
    message_event_manager
)


@strawberry.type
class MessageSubscription:

    @strawberry.subscription
    async def message_updated(
        self,
        conversation_id: int
    ) -> AsyncGenerator[MessageEvent, None]:

        queue = message_event_manager.subscribe(
            conversation_id
        )

        try:

            while True:

                event = await queue.get()

                yield MessageEvent(
                    conversation_id=event["conversation_id"],
                    action=event["action"],
                    actor_id=event["actor_id"],
                    message=event["message"],
                    read_message_ids=event["read_message_ids"],
                )

        finally:

            message_event_manager.unsubscribe(
                conversation_id,
                queue
            )