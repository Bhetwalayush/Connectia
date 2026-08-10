from sqlalchemy import (
    Column,
    Integer,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Comment(Base):

    __tablename__ = "comments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    content = Column(
        Text,
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    post_id = Column(
        Integer,
        ForeignKey("posts.id"),
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
        back_populates="comments"
    )

    post = relationship(
        "Post",
        back_populates="comments"
    )