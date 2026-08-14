from collections.abc import AsyncGenerator

import strawberry

from app.graphql.types.like_event_type import (
    LikeEvent,
    LikeAction
)

from app.graphql.subscriptions.like_events import (
    like_event_manager
)


@strawberry.type
class LikeSubscription:

    @strawberry.subscription
    async def like_updated(
        self,
        post_id: int
    )-> AsyncGenerator[LikeEvent, None]:

        queue = like_event_manager.subscribe(
            post_id
        )

        try:

            while True:

                event = await queue.get()

                yield LikeEvent(
                    post_id=event["post_id"],
                    user_id=event["user_id"],
                    like_count=event["like_count"],
                    action=event["action"]
                )

        finally:

            like_event_manager.unsubscribe(
                post_id,
                queue
            )