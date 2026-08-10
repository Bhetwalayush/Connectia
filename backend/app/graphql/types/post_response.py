import strawberry

from app.graphql.types.post_type import PostType


@strawberry.type
class PostResponse:

    success: bool

    message: str

    post: PostType | None = None