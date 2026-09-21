import strawberry


@strawberry.input
class UpdateProfileInput:

    username: str | None = None

    bio: str | None = None

    profile_picture_url: str | None = None


@strawberry.input
class ChangePasswordInput:

    current_password: str

    new_password: str