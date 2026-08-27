import strawberry
from typing import List
from strawberry.types import Info
from app.repositories import follow_repository as repo
from app.services import follow_service
from app.graphql.types.user_type import UserType
from app.graphql.types.suggested_user_type import SuggestedUserType

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

    @strawberry.field
    def suggested_users(
        self,
        info: Info,
        limit: int = 5,
    ) -> List[SuggestedUserType]:
        current_user = info.context.get("user") or info.context.get("current_user")
        if not current_user:
            return []

        rows = follow_service.get_suggested_users(
            info.context["db"],
            current_user.id,
            limit,
        )

        return [
            SuggestedUserType(
                id=row["id"],
                username=row["username"],
                email=row["email"],
                mutual_count=row["mutual_count"],
                follows_you=row["follows_you"],
            )
            for row in rows
        ]
