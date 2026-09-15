import asyncio


class GlobalChatEventManager:

    def __init__(self):

        self.subscribers: set[asyncio.Queue] = set()

    def subscribe(self) -> asyncio.Queue:

        queue = asyncio.Queue()

        self.subscribers.add(queue)

        return queue

    def unsubscribe(
        self,
        queue: asyncio.Queue
    ):

        self.subscribers.discard(queue)

    # Broadcasts to every connected client - no per-user targeting,
    # since this is a single public room everyone shares
    async def publish(
        self,
        event
    ):

        for queue in self.subscribers:

            await queue.put(event)