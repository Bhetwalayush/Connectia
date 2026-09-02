import strawberry

from app.graphql.types.message_event_type import MessageAction


@strawberry.type
class InboxEvent:

    conversation_id: int

    action: MessageAction

    actor_id: int