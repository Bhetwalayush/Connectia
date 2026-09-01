import strawberry

from app.graphql.types.message_type import MessageType


@strawberry.type
class MessagePage:

    items: list[MessageType]

    next_cursor: int | None

    has_more: bool