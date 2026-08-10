import strawberry


@strawberry.type
class DeleteResponse:

    success: bool

    message: str