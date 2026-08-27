import strawberry


@strawberry.type
class SuggestedUserType:
    id: int
    username: str
    email: str
    mutual_count: int
    follows_you: bool
