# Message service - Handles sending messages, conversation history, and read receipts
from sqlalchemy.orm import Session

from app.models.message import Message
from app.repositories.message_repository import MessageRepository
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.user_repository import UserRepository


class MessageService:

    def __init__(self, db: Session):

        self.message_repository = MessageRepository(db)

        self.conversation_repository = ConversationRepository(db)

        self.user_repository = UserRepository(db)

    def send_message(
        self,
        recipient_id: int,
        content: str,
        current_user,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        if not content or not content.strip():

            raise ValueError(
                "Message cannot be empty."
            )

        if recipient_id == current_user.id:

            raise ValueError(
                "You cannot message yourself."
            )

        recipient = self.user_repository.get_user_by_id(
            recipient_id
        )

        if not recipient:

            raise ValueError(
                "Recipient not found."
            )

        conversation = self.conversation_repository.get_conversation_between(
            current_user.id,
            recipient_id,
        )

        if not conversation:

            conversation = self.conversation_repository.create_conversation(
                current_user.id,
                recipient_id,
            )

        message = Message(

            conversation_id=conversation.id,

            sender_id=current_user.id,

            content=content.strip(),

        )

        created_message = self.message_repository.create_message(
            message
        )

        return created_message, conversation

    def get_conversations(
        self,
        current_user,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        return self.conversation_repository.get_conversations_for_user(
            current_user.id
        )

    def get_messages(
        self,
        conversation_id: int,
        current_user,
        cursor: int | None = None,
        limit: int = 20,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        if limit < 1:

            raise ValueError(
                "Limit must be greater than 0."
            )

        if limit > 100:

            raise ValueError(
                "Limit cannot exceed 100."
            )

        conversation = self.conversation_repository.get_conversation_by_id(
            conversation_id
        )

        if not conversation:

            raise ValueError(
                "Conversation not found."
            )

        if current_user.id not in (
            conversation.user_one_id,
            conversation.user_two_id,
        ):

            raise ValueError(
                "You do not have access to this conversation."
            )

        # Fetch one extra row to know if more history exists beyond this page
        messages = self.message_repository.get_messages_by_conversation(
            conversation_id=conversation_id,
            cursor=cursor,
            limit=limit + 1,
        )

        has_more = len(messages) > limit

        page = messages[:limit]

        next_cursor = page[-1].id if has_more else None

        # Reverse to chronological order (oldest first) for display
        return list(reversed(page)), next_cursor, has_more

    def mark_as_read(
        self,
        conversation_id: int,
        current_user,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        conversation = self.conversation_repository.get_conversation_by_id(
            conversation_id
        )

        if not conversation:

            raise ValueError(
                "Conversation not found."
            )

        if current_user.id not in (
            conversation.user_one_id,
            conversation.user_two_id,
        ):

            raise ValueError(
                "You do not have access to this conversation."
            )

        updated_messages = self.message_repository.mark_messages_read(
            conversation_id=conversation_id,
            reader_id=current_user.id,
        )

        return updated_messages

    def get_conversation_with_user(
        self,
        other_user_id: int,
        current_user,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        conversation = self.conversation_repository.get_conversation_between(
            current_user.id,
            other_user_id,
        )

        return conversation