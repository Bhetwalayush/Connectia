# Notification model - represents a like/comment/follow notification for a user
from enum import Enum

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    Enum as SqlEnum,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class NotificationType(str, Enum):
    LIKE = "LIKE"
    COMMENT = "COMMENT"
    FOLLOW = "FOLLOW"


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Who receives this notification
    recipient_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # Who performed the action that triggered it
    actor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    type = Column(
        SqlEnum(NotificationType, name="notification_type"),
        nullable=False,
    )

    # Only relevant for LIKE/COMMENT; null for FOLLOW
    post_id = Column(
        Integer,
        ForeignKey("posts.id"),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    read_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    recipient = relationship(
        "User",
        foreign_keys=[recipient_id],
    )

    actor = relationship(
        "User",
        foreign_keys=[actor_id],
    )

    post = relationship(
        "Post",
    )