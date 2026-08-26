import strawberry
from strawberry.types import Info
from app.services import follow_service

@strawberry.type
class FollowMutations:

    @strawberry.mutation
    def follow_user(self, info: Info, user_id: int) -> bool:
        db = info.context["db"]
        current_user = info.context["user"]
        if not current_user:
            raise Exception("Authentication required")

        follow_service.follow_user(db, current_user.id, user_id)
        return True

    @strawberry.mutation
    def unfollow_user(self, info: Info, user_id: int) -> bool:
        db = info.context["db"]
        current_user = info.context["user"]
        if not current_user:
            raise Exception("Authentication required")

        follow_service.unfollow_user(db, current_user.id, user_id)
        return True
