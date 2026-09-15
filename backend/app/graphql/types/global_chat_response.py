import strawberry

from app.graphql.types.global_chat_type import GlobalMessageType


@strawberry.type
class GlobalChatResponse:

    success: bool

    message: str

    chat_message: GlobalMessageType | None = None