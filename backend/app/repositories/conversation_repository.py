# Conversation repository - Database access layer for conversation lookups
from sqlalchemy import or_, func
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.message import Message


class ConversationRepository:

    def __init__(self, db: Session):

        self.db = db

    def get_conversation_by_id(
        self,
        conversation_id: int
    ):

        return (
            self.db.query(Conversation)
            .filter(
                Conversation.id == conversation_id
            )
            .first()
        )

    # 1-on-1 conversations are unordered pairs, so normalize before lookup
    def get_conversation_between(
        self,
        user_a_id: int,
        user_b_id: int
    ):

        low_id, high_id = sorted([user_a_id, user_b_id])

        return (
            self.db.query(Conversation)
            .filter(
                Conversation.user_one_id == low_id,
                Conversation.user_two_id == high_id,
            )
            .first()
        )

    def create_conversation(
        self,
        user_a_id: int,
        user_b_id: int
    ):

        low_id, high_id = sorted([user_a_id, user_b_id])

        conversation = Conversation(
            user_one_id=low_id,
            user_two_id=high_id,
        )

        self.db.add(conversation)

        self.db.commit()

        self.db.refresh(conversation)

        return conversation

    # Most recently active conversations first (by last message, falling
    # back to conversation creation time if it has no messages yet)
    def get_conversations_for_user(
        self,
        user_id: int
    ):

        last_message_subquery = (
            self.db.query(
                Message.conversation_id,
                func.max(Message.created_at).label("last_message_at"),
            )
            .group_by(Message.conversation_id)
            .subquery()
        )

        return (
            self.db.query(Conversation)
            .outerjoin(
                last_message_subquery,
                Conversation.id == last_message_subquery.c.conversation_id,
            )
            .filter(
                or_(
                    Conversation.user_one_id == user_id,
                    Conversation.user_two_id == user_id,
                )
            )
            .order_by(
                func.coalesce(
                    last_message_subquery.c.last_message_at,
                    Conversation.created_at,
                ).desc()
            )
            .all()
        )