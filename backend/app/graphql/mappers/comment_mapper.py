from app.graphql.types.comment_type import CommentType
from app.graphql.types.user_type import UserType


def to_comment_type(comment):

    return CommentType(

        id=comment.id,

        content=comment.content,

        created_at=comment.created_at,

        updated_at=comment.updated_at,

        author=UserType(

            id=comment.author.id,

            username=comment.author.username,

            email=comment.author.email

        )

    )