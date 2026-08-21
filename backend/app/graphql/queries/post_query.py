# GraphQL queries for retrieving posts
import strawberry

from strawberry.types import Info

from app.services.post_service import PostService
from app.graphql.mappers.post_mapper import to_post_type
from app.graphql.types.post_type import PostType


@strawberry.type
class PostQuery:

    # Fetch paginated feed of all posts
    @strawberry.field
    def posts(
        self,
        info: Info,
        limit: int = 10,
        offset: int = 0
    ) -> list[PostType]:

        service = PostService(
            info.context["db"]
        )

        posts = service.get_feed(
            limit=limit,
            offset=offset
        )

        return [
            to_post_type(post)
            for post in posts
        ]
    # Fetch single post by ID with full details
    @strawberry.field
    def post(
        self,
        info: Info,
        post_id: int
    ) -> PostType:

        service = PostService(
            info.context["db"]
        )

        post = service.get_post(post_id)

        return to_post_type(post)