# GlobalMessage model - a single message in the public global chat room
from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class GlobalMessage(Base):

    __tablename__ = "global_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Real user is always tracked server-side, even when displaying anonymously
    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # What everyone else actually sees - either the real username or a
    # generated anonymous handle, chosen by the sender at join time
    display_name = Column(
        String,
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
        index=True,
    )

    sender = relationship(
        "User",
    )