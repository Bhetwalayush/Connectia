import asyncio


class LikeEventManager:

    def __init__(self):

        self.subscribers: dict[
            int,
            set[asyncio.Queue]
        ] = {}

    def subscribe(
        self,
        post_id: int
    ) -> asyncio.Queue:

        queue = asyncio.Queue()

        if post_id not in self.subscribers:

            self.subscribers[post_id] = set()

        self.subscribers[post_id].add(queue)

        return queue

    def unsubscribe(
        self,
        post_id: int,
        queue: asyncio.Queue
    ):

        if post_id not in self.subscribers:
            return

        self.subscribers[post_id].discard(queue)

        if not self.subscribers[post_id]:

            del self.subscribers[post_id]

    async def publish(
        self,
        post_id: int,
        event: dict
    ):

        queues = self.subscribers.get(
            post_id,
            set()
        )

        for queue in queues:

            await queue.put(event)


class MessageEventManager:

    def __init__(self):

        self.subscribers: dict[
            int,
            set[asyncio.Queue]
        ] = {}

    def subscribe(
        self,
        conversation_id: int
    ) -> asyncio.Queue:

        queue = asyncio.Queue()

        if conversation_id not in self.subscribers:

            self.subscribers[conversation_id] = set()

        self.subscribers[conversation_id].add(queue)

        return queue

    def unsubscribe(
        self,
        conversation_id: int,
        queue: asyncio.Queue
    ):

        if conversation_id not in self.subscribers:
            return

        self.subscribers[conversation_id].discard(queue)

        if not self.subscribers[conversation_id]:

            del self.subscribers[conversation_id]

    async def publish(
        self,
        conversation_id: int,
        event: dict
    ):

        queues = self.subscribers.get(
            conversation_id,
            set()
        )

        for queue in queues:

            await queue.put(event)


#For managing inbox events, such as new messages or notifications
class InboxEventManager:

    def __init__(self):

        self.subscribers: dict[
            int,
            set[asyncio.Queue]
        ] = {}

    def subscribe(
        self,
        user_id: int
    ) -> asyncio.Queue:

        queue = asyncio.Queue()

        if user_id not in self.subscribers:

            self.subscribers[user_id] = set()

        self.subscribers[user_id].add(queue)

        return queue

    def unsubscribe(
        self,
        user_id: int,
        queue: asyncio.Queue
    ):

        if user_id not in self.subscribers:
            return

        self.subscribers[user_id].discard(queue)

        if not self.subscribers[user_id]:

            del self.subscribers[user_id]

    async def publish(
        self,
        user_id: int,
        event: dict
    ):

        queues = self.subscribers.get(
            user_id,
            set()
        )

        for queue in queues:

            await queue.put(event)