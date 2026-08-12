import strawberry

from strawberry.types import Info

from app.services.comment_service import CommentService
from app.graphql.types.comment_type import CommentType
from app.graphql.mappers.comment_mapper import to_comment_type


@strawberry.type
class CommentQuery:

    @strawberry.field
    def comments(
        self,
        info: Info,
        post_id: int,
        limit: int = 20,
        offset: int = 0
    ) -> list[CommentType]:

        service = CommentService(
            info.context["db"]
        )

        comments = service.get_comments(
            post_id=post_id,
            limit=limit,
            offset=offset
        )

        return [
            to_comment_type(comment)
            for comment in comments
        ]