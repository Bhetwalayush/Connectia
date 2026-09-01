# GraphQL queries for messages (conversations list, message history)
import strawberry

from strawberry.types import Info

from app.services.message_service import MessageService
from app.graphql.types.conversation_type import ConversationType
from app.graphql.types.message_page_type import MessagePage
from app.graphql.mappers.message_mapper import (
    to_conversation_type,
    to_message_type,
)


@strawberry.type
class MessageQuery:

    # List all conversations for the current user, most recent activity first
    @strawberry.field
    def conversations(
        self,
        info: Info,
    ) -> list[ConversationType]:

        current_user = info.context["user"]

        service = MessageService(
            info.context["db"]
        )

        try:

            conversations = service.get_conversations(
                current_user
            )

            return [
                to_conversation_type(conversation, current_user.id)
                for conversation in conversations
            ]

        except ValueError as e:

            raise ValueError(str(e))

    # Cursor-paginated message history for one conversation, oldest-first
    @strawberry.field
    def messages(
        self,
        info: Info,
        conversation_id: int,
        cursor: int | None = None,
        limit: int = 20,
    ) -> MessagePage:

        current_user = info.context["user"]

        service = MessageService(
            info.context["db"]
        )

        try:

            messages, next_cursor, has_more = service.get_messages(
                conversation_id=conversation_id,
                current_user=current_user,
                cursor=cursor,
                limit=limit,
            )

            return MessagePage(

                items=[
                    to_message_type(message)
                    for message in messages
                ],

                next_cursor=next_cursor,

                has_more=has_more,

            )

        except ValueError as e:

            raise ValueError(str(e))