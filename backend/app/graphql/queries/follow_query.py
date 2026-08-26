import strawberry
from typing import List
from strawberry.types import Info
from app.repositories import follow_repository as repo
from app.graphql.types.user_type import UserType  # your existing user type

@strawberry.type
class FollowQuery:

    @strawberry.field
    def followers(self, info: Info, user_id: int) -> List[UserType]:
        db = info.context["db"]
        return repo.get_followers(db, user_id)

    @strawberry.field
    def following(self, info: Info, user_id: int) -> List[UserType]:
        db = info.context["db"]
        return repo.get_following(db, user_id)
