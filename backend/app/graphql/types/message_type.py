from datetime import datetime

import strawberry

from app.graphql.types.user_type import UserType


@strawberry.type
class MessageType:

    id: int

    content: str

    created_at: datetime

    read_at: datetime | None

    conversation_id: int

    sender: UserType