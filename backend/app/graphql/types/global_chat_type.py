from datetime import datetime

import strawberry


@strawberry.type
class GlobalMessageType:

    id: int

    sender_id: int

    display_name: str

    content: str

    created_at: datetime


@strawberry.type
class GlobalMessagePage:

    items: list[GlobalMessageType]

    next_cursor: int | None

    has_more: bool