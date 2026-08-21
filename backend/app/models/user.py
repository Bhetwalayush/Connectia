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
    
    