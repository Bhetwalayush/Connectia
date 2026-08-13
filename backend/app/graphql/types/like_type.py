from datetime import datetime

import strawberry

from app.graphql.types.user_type import UserType


@strawberry.type
class LikeType:

    id: int

    created_at: datetime

    user: UserType