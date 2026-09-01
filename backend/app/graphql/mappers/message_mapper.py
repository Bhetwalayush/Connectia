from app.graphql.types.message_type import MessageType
from app.graphql.types.conversation_type import ConversationType
from app.graphql.types.user_type import UserType


def to_message_type(message):

    return MessageType(

        id=message.id,

        content=message.content,

        created_at=message.created_at,

        read_at=message.read_at,

        conversation_id=message.conversation_id,

        sender=UserType(

            id=message.sender.id,

            username=message.sender.username,

            email=message.sender.email,

        ),

    )


def to_conversation_type(conversation, current_user_id):

    other_user = (
        conversation.user_two
        if conversation.user_one_id == current_user_id
        else conversation.user_one
    )

    # Relies on `messages` being loaded and ordered by id (see relationship);
    # fine for now, worth a dedicated "last message" query if this list grows.
    last_message = (
        conversation.messages[-1]
        if conversation.messages
        else None
    )

    return ConversationType(

        id=conversation.id,

        created_at=conversation.created_at,

        other_user=UserType(

            id=other_user.id,

            username=other_user.username,

            email=other_user.email,

        ),

        last_message=(
            to_message_type(last_message)
            if last_message
            else None
        ),

    )