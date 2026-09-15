# GraphQL query for global chat history
import strawberry

from strawberry.types import Info

from app.services.global_chat_service import GlobalChatService
from app.graphql.types.global_chat_type import GlobalMessagePage
from app.graphql.mappers.global_chat_mapper import to_global_message_type


@strawberry.type
class GlobalChatQuery:

    @strawberry.field
    def global_messages(
        self,
        info: Info,
        cursor: int | None = None,
        limit: int = 50,
    ) -> GlobalMessagePage:

        service = GlobalChatService(
            info.context["db"]
        )

        try:

            messages, next_cursor, has_more = service.get_messages(
                cursor=cursor,
                limit=limit,
            )

            return GlobalMessagePage(

                items=[
                    to_global_message_type(message)
                    for message in messages
                ],

                next_cursor=next_cursor,

                has_more=has_more,

            )

        except ValueError as e:

            raise ValueError(str(e))