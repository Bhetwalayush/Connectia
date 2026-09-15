# Global chat repository - Database access layer for the public chat room
from sqlalchemy.orm import Session

from app.models.global_message import GlobalMessage


class GlobalChatRepository:

    def __init__(self, db: Session):

        self.db = db

    def create_message(
        self,
        message: GlobalMessage
    ):

        self.db.add(message)

        self.db.commit()

        self.db.refresh(message)

        return message

    # Cursor-based pagination, same pattern as direct messages: returns
    # messages older than `cursor` (by id), newest first
    def get_messages(
        self,
        cursor: int | None = None,
        limit: int = 50,
    ):

        query = self.db.query(GlobalMessage)

        if cursor is not None:

            query = query.filter(
                GlobalMessage.id < cursor
            )

        return (
            query
            .order_by(
                GlobalMessage.id.desc()
            )
            .limit(limit)
            .all()
        )