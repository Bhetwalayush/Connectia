import strawberry


@strawberry.input
class CreatePostInput:

    content: str

    image_url: str | None = None

@strawberry.input
class UpdatePostInput:

    post_id: int

    content: str

    image_url: str | None = None