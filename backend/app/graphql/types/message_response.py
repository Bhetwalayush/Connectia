import strawberry

from app.graphql.types.message_type import MessageType
from app.graphql.types.conversation_type import ConversationType


@strawberry.type
class MessageResponse:

    success: bool

    message: str

    chat_message: MessageType | None = None

    conversation: ConversationType | None = None