import strawberry

from strawberry.types import Info

from app.services.like_service import LikeService
from app.graphql.types.like_type import LikeType
from app.graphql.mappers.like_mapper import to_like_type


@strawberry.type
class LikeQuery:

    @strawberry.field
    def likes(
        self,
        info: Info,
        post_id: int,
        limit: int = 20,
        offset: int = 0
    ) -> list[LikeType]:

        service = LikeService(
            info.context["db"]
        )

        try:

            likes = service.get_likes(
                post_id=post_id,
                limit=limit,
                offset=offset
            )

            return [
                to_like_type(like)
                for like in likes
            ]

        except ValueError as e:

            raise ValueError(str(e))

    @strawberry.field
    def like_count(
        self,
        info: Info,
        post_id: int
    ) -> int:

        service = LikeService(
            info.context["db"]
        )

        return service.get_like_count(
            post_id
        )

    @strawberry.field
    def has_liked(
        self,
        info: Info,
        post_id: int
    ) -> bool:

        current_user = info.context["user"]

        if current_user is None:
            return False

        service = LikeService(
            info.context["db"]
        )

        return service.has_liked(
            post_id=post_id,
            current_user=current_user
        )