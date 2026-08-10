import strawberry


@strawberry.input
class LoginInput:

    email: str

    password: str