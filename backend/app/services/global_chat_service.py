# Global chat service - validates and creates public chat messages
from sqlalchemy.orm import Session

from app.models.global_message import GlobalMessage
from app.repositories.global_chat_repository import GlobalChatRepository

MAX_DISPLAY_NAME_LENGTH = 30
MAX_MESSAGE_LENGTH = 1000


class GlobalChatService:

    def __init__(self, db: Session):

        self.global_chat_repository = GlobalChatRepository(db)

    def send_message(
        self,
        current_user,
        display_name: str,
        content: str,
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        trimmed_name = (display_name or "").strip()

        if not trimmed_name:

            raise ValueError(
                "Display name cannot be empty."
            )

        if len(trimmed_name) > MAX_DISPLAY_NAME_LENGTH:

            raise ValueError(
                f"Display name cannot exceed {MAX_DISPLAY_NAME_LENGTH} characters."
            )

        trimmed_content = (content or "").strip()

        if not trimmed_content:

            raise ValueError(
                "Message cannot be empty."
            )

        if len(trimmed_content) > MAX_MESSAGE_LENGTH:

            raise ValueError(
                f"Message cannot exceed {MAX_MESSAGE_LENGTH} characters."
            )

        message = GlobalMessage(

            sender_id=current_user.id,

            display_name=trimmed_name,

            content=trimmed_content,

        )

        return self.global_chat_repository.create_message(
            message
        )

    def get_messages(
        self,
        cursor: int | None = None,
        limit: int = 50,
    ):

        if limit < 1:

            raise ValueError(
                "Limit must be greater than 0."
            )

        if limit > 100:

            raise ValueError(
                "Limit cannot exceed 100."
            )

        messages = self.global_chat_repository.get_messages(
            cursor=cursor,
            limit=limit + 1,
        )

        has_more = len(messages) > limit

        page = messages[:limit]

        next_cursor = page[-1].id if has_more else None

        return list(reversed(page)), next_cursor, has_more