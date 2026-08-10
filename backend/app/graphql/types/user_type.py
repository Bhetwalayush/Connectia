import strawberry


@strawberry.type
class UserType:

    id: int

    username: str

    email: str