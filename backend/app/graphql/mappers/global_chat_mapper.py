from app.graphql.types.global_chat_type import GlobalMessageType


def to_global_message_type(message):

    return GlobalMessageType(

        id=message.id,

        sender_id=message.sender_id,

        display_name=message.display_name,

        content=message.content,

        created_at=message.created_at,

    )