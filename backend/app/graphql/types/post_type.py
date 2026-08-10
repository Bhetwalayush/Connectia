from datetime import datetime

import strawberry

from app.graphql.types.user_type import UserType


@strawberry.type
class PostType:

    id: int

    content: str

    image_url: str | None

    created_at: datetime

    updated_at: datetime

    author: UserType