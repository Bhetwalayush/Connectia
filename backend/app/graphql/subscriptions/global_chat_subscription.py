from collections.abc import AsyncGenerator

import strawberry

from app.graphql.types.global_chat_type import GlobalMessageType

from app.graphql.subscriptions.global_chat_events import (
    global_chat_event_manager
)


@strawberry.type
class GlobalChatSubscription:

    @strawberry.subscription
    async def global_chat_updated(
        self,
    ) -> AsyncGenerator[GlobalMessageType, None]:

        queue = global_chat_event_manager.subscribe()

        try:

            while True:

                message = await queue.get()

                yield message

        finally:

            global_chat_event_manager.unsubscribe(
                queue
            )