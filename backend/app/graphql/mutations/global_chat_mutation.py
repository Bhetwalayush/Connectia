# GraphQL mutation for sending a message to the public global chat room
import strawberry

from strawberry.types import Info

from app.graphql.inputs.global_chat_input import SendGlobalMessageInput
from app.graphql.types.global_chat_response import GlobalChatResponse
from app.graphql.mappers.global_chat_mapper import to_global_message_type

from app.services.global_chat_service import GlobalChatService

from app.graphql.subscriptions.global_chat_events import (
    global_chat_event_manager
)


@strawberry.type
class GlobalChatMutation:

    @strawberry.mutation
    async def send_global_message(
        self,
        info: Info,
        input: SendGlobalMessageInput
    ) -> GlobalChatResponse:

        current_user = info.context["user"]

        if current_user is None:

            return GlobalChatResponse(
                success=False,
                message="Authentication required."
            )

        service = GlobalChatService(
            info.context["db"]
        )

        try:

            message = service.send_message(

                current_user=current_user,

                display_name=input.display_name,

                content=input.content,

            )

            message_type = to_global_message_type(message)

            await global_chat_event_manager.publish(
                message_type
            )

            return GlobalChatResponse(

                success=True,

                message="Message sent successfully.",

                chat_message=message_type,

            )

        except ValueError as e:

            return GlobalChatResponse(

                success=False,

                message=str(e)

            )