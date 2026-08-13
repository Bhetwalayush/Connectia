from app.graphql.types.like_type import LikeType
from app.graphql.types.user_type import UserType


def to_like_type(like):

    return LikeType(

        id=like.id,

        created_at=like.created_at,

        user=UserType(

            id=like.user.id,

            username=like.user.username,

            email=like.user.email

        )

    )