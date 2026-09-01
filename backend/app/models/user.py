# User model - Represents a registered user account
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.core.database import Base
from sqlalchemy.orm import relationship

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)  # Stored as bcrypt hash

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # One-to-many relationship: User can have multiple posts
    posts = relationship(
        "Post",
        back_populates="author",
        cascade="all, delete-orphan"
    )

    # One-to-many relationship: User can have multiple comments
    comments = relationship(
        "Comment",
        back_populates="author",
        cascade="all, delete-orphan"
    )

    # One-to-many relationship: User can like multiple posts
    likes = relationship(
        "Like",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # 1-on-1 conversations where this user is stored as the lower-id side
    conversations_as_user_one = relationship(
        "Conversation",
        foreign_keys="Conversation.user_one_id",
        back_populates="user_one",
    )

    # 1-on-1 conversations where this user is stored as the higher-id side
    conversations_as_user_two = relationship(
        "Conversation",
        foreign_keys="Conversation.user_two_id",
        back_populates="user_two",
    )

    # All messages this user has sent, across any conversation
    sent_messages = relationship(
        "Message",
        back_populates="sender",
    )