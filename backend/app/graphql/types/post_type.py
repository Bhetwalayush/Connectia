from datetime import datetime

import strawberry
from strawberry.types import Info
from app.graphql.types.user_type import UserType


@strawberry.type
class PostType:

    id: int

    content: str

    image_url: str | None

    created_at: datetime

    updated_at: datetime

    author: UserType

    comment_count: int


    @strawberry.field
    def like_count(self, info: Info) -> int:

        from app.services.like_service import LikeService

        service = LikeService(
            info.context["db"]
        )

        return service.get_like_count(
            self.id
        )

    @strawberry.field
    def liked_by_me(self, info: Info) -> bool:

        from app.services.like_service import LikeService

        current_user = info.context["user"]

        if current_user is None:
            return False

        service = LikeService(
            info.context["db"]
        )

        return service.has_liked(
            post_id=self.id,
            current_user=current_user
        )