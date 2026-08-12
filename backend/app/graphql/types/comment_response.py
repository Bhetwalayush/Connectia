import strawberry

from app.graphql.types.comment_type import CommentType


@strawberry.type
class CommentResponse:

    success: bool

    message: str

    comment: CommentType | None = None