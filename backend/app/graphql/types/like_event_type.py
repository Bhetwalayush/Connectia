from enum import Enum

import strawberry


@strawberry.enum
class LikeAction(Enum):
    LIKED = "LIKED"
    UNLIKED = "UNLIKED"


@strawberry.type
class LikeEvent:

    post_id: int
    user_id: int
    like_count: int
    action: LikeAction