import strawberry
from strawberry.types import Info

@strawberry.type
class UserType:

    id: int

    username: str

    email: str

    @strawberry.field
    def followers_count(self, info: Info) -> int:
        db = info.context["db"]
        from app.repositories import follow_repository as repo
        return repo.count_followers(db, self.id)

    @strawberry.field
    def following_count(self, info: Info) -> int:
        db = info.context["db"]
        from app.repositories import follow_repository as repo
        return repo.count_following(db, self.id)

    @strawberry.field
    def is_following(self, info: Info) -> bool:
        db = info.context["db"]
        current_user = info.context["current_user"]
        if not current_user:
            return False
        from app.services.follow_service import is_following as check
        return check(db, current_user.id, self.id)