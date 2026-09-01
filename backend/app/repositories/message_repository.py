# Message repository - Database access layer for message operations
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.message import Message


class MessageRepository:

    def __init__(self, db: Session):

        self.db = db

    def create_message(
        self,
        message: Message
    ):

        self.db.add(message)

        self.db.commit()

        self.db.refresh(message)

        return message

    def get_message_by_id(
        self,
        message_id: int
    ):

        return (
            self.db.query(Message)
            .filter(
                Message.id == message_id
            )
            .first()
        )

    # Cursor-based pagination: returns messages older than `cursor` (by id),
    # newest first, for infinite-scroll-up chat history.
    def get_messages_by_conversation(
        self,
        conversation_id: int,
        cursor: int | None = None,
        limit: int = 20,
    ):

        query = (
            self.db.query(Message)
            .filter(
                Message.conversation_id == conversation_id
            )
        )

        if cursor is not None:

            query = query.filter(
                Message.id < cursor
            )

        return (
            query
            .order_by(
                Message.id.desc()
            )
            .limit(limit)
            .all()
        )

    def mark_messages_read(
        self,
        conversation_id: int,
        reader_id: int
    ):

        unread_messages = (
            self.db.query(Message)
            .filter(
                Message.conversation_id == conversation_id,
                Message.sender_id != reader_id,
                Message.read_at.is_(None),
            )
            .all()
        )

        now = datetime.now(timezone.utc)

        for message in unread_messages:

            message.read_at = now

        self.db.commit()

        return unread_messages