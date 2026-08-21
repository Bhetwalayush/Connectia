# Post model - Represents a user's social media post
from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.core.database import Base


class Post(Base):

    __tablename__ = "posts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    content = Column(
        Text,
        nullable=False
    )

    image_url = Column(
        String,
        nullable=True  # Optional image attachment
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    author = relationship(
        "User",
        back_populates="posts"
    )

    comments = relationship(
        "Comment",
        back_populates="post",
        cascade="all, delete-orphan"
    )
    
    likes = relationship(
    "Like",
    back_populates="post",
    cascade="all, delete-orphan"
    )
    
    