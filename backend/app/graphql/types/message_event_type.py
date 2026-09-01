from enum import Enum

import strawberry

from app.graphql.types.message_type import MessageType


@strawberry.enum
class MessageAction(Enum):
    SENT = "SENT"
    READ = "READ"


@strawberry.type
class MessageEvent:

    conversation_id: int

    action: MessageAction

    actor_id: int

    message: MessageType | None = None

    read_message_ids: list[int] | None = None