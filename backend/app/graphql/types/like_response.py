import strawberry

from app.graphql.types.like_type import LikeType


@strawberry.type
class LikeResponse:

    success: bool

    message: str

    like: LikeType | None = None

    like_count: int = 0