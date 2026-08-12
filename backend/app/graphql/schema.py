import strawberry

from app.graphql.queries.hello_query import HelloQuery
from app.graphql.queries.user_query import UserQuery
from app.graphql.mutations import Mutation
from app.graphql.mutations.auth_mutation import AuthMutation
from app.graphql.mutations.post_mutation import PostMutation
from app.graphql.queries.post_query import PostQuery
from app.graphql.mutations.comment_mutation import (
    CommentMutation
)
from app.graphql.queries.comment_query import CommentQuery
@strawberry.type
class Query(

    HelloQuery,
    

    UserQuery,

    PostQuery,

    CommentQuery,

):
    pass

@strawberry.type
class Mutation(
    AuthMutation,
    PostMutation,
    CommentMutation
):
    pass

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)

