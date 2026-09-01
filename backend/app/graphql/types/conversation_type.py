from datetime import datetime

import strawberry

from app.graphql.types.user_type import UserType
from app.graphql.types.message_type import MessageType


@strawberry.type
class ConversationType:

    id: int

    created_at: datetime

    other_user: UserType

    last_message: MessageType | None = None