# GraphQL mutations for messages (send_message, mark_messages_read)
import strawberry

from strawberry.types import Info

from app.graphql.inputs.message_input import SendMessageInput
from app.graphql.inputs.mark_read_input import MarkReadInput

from app.graphql.types.message_response import MessageResponse

from app.graphql.mappers.message_mapper import (
    to_message_type,
    to_conversation_type,
)

from app.services.message_service import MessageService

from app.graphql.subscriptions.message_events import (
    message_event_manager
)

from app.graphql.types.message_event_type import (
    MessageAction
)


@strawberry.type
class MessageMutation:

    # Send a message, creating the conversation on first contact, with
    # broadcast to any client subscribed to this conversation
    @strawberry.mutation
    async def send_message(
        self,
        info: Info,
        input: SendMessageInput
    ) -> MessageResponse:

        current_user = info.context["user"]

        if current_user is None:

            return MessageResponse(
                success=False,
                message="Authentication required."
            )

        service = MessageService(
            info.context["db"]
        )

        try:

            message, conversation = service.send_message(

                recipient_id=input.recipient_id,

                content=input.content,

                current_user=current_user

            )

            message_type = to_message_type(message)

            await message_event_manager.publish(

                conversation_id=conversation.id,

                event={
                    "conversation_id": conversation.id,
                    "action": MessageAction.SENT,
                    "actor_id": current_user.id,
                    "message": message_type,
                    "read_message_ids": None,
                }

            )

            return MessageResponse(

                success=True,

                message="Message sent successfully.",

                chat_message=message_type,

                conversation=to_conversation_type(
                    conversation,
                    current_user.id
                )

            )

        except ValueError as e:

            return MessageResponse(

                success=False,

                message=str(e)

            )

    # Mark all unread messages in a conversation as read, broadcasting the
    # read receipt to the other participant
    @strawberry.mutation
    async def mark_messages_read(
        self,
        info: Info,
        input: MarkReadInput
    ) -> MessageResponse:

        current_user = info.context["user"]

        if current_user is None:

            return MessageResponse(
                success=False,
                message="Authentication required."
            )

        service = MessageService(
            info.context["db"]
        )

        try:

            updated_messages = service.mark_as_read(

                conversation_id=input.conversation_id,

                current_user=current_user

            )

            if updated_messages:

                await message_event_manager.publish(

                    conversation_id=input.conversation_id,

                    event={
                        "conversation_id": input.conversation_id,
                        "action": MessageAction.READ,
                        "actor_id": current_user.id,
                        "message": None,
                        "read_message_ids": [
                            message.id for message in updated_messages
                        ],
                    }

                )

            return MessageResponse(

                success=True,

                message="Messages marked as read."

            )

        except ValueError as e:

            return MessageResponse(

                success=False,

                message=str(e)

            )