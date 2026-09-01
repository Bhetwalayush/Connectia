# Message model - A single chat message within a conversation
from sqlalchemy import (
    Column,
    Integer,
    Text,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Message(Base):

    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
        nullable=False,
        index=True,
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Null while unread. Set the moment the recipient's client marks it read.
    read_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages",
    )

    sender = relationship(
        "User",
        back_populates="sent_messages",
    )