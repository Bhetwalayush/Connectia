from datetime import datetime

import strawberry
from enum import Enum

from app.graphql.types.user_type import UserType


@strawberry.enum
class NotificationTypeEnum(Enum):
    LIKE = "LIKE"
    COMMENT = "COMMENT"
    FOLLOW = "FOLLOW"


@strawberry.type
class NotificationType:

    id: int

    type: NotificationTypeEnum

    created_at: datetime

    read_at: datetime | None

    actor: UserType

    post_id: int | None