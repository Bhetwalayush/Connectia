import strawberry


@strawberry.input
class CreateCommentInput:

    post_id: int
    content: str


@strawberry.input
class UpdateCommentInput:

    comment_id: int
    content: str