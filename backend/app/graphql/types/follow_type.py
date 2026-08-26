import strawberry
from datetime import datetime

@strawberry.type
class FollowType:
    id: int
    follower_id: int
    following_id: int
    created_at: datetime