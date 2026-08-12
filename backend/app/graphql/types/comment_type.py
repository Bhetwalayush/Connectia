from datetime import datetime

import strawberry

from app.graphql.types.user_type import UserType


@strawberry.type
class CommentType:

    id: int

    content: str

    created_at: datetime

    updated_at: datetime

    author: UserType