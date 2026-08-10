import strawberry


@strawberry.input
class RegisterInput:
    username: str
    email: str
    password: str

@strawberry.input
class LoginInput:

    email: str

    password: str