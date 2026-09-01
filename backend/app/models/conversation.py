# Conversation model - Represents a 1-on-1 (and future group) chat thread
from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # For 1-on-1 chats, always stored with user_one_id < user_two_id so the
    # same pair of users can never end up with two separate conversation
    # rows, regardless of who messages whom first.
    user_one_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    user_two_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "user_one_id",
            "user_two_id",
            name="uq_conversation_pair",
        ),
    )

    user_one = relationship(
        "User",
        foreign_keys=[user_one_id],
        back_populates="conversations_as_user_one",
    )

    user_two = relationship(
        "User",
        foreign_keys=[user_two_id],
        back_populates="conversations_as_user_two",
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        order_by="Message.id",
    )