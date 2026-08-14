import strawberry

from app.graphql.mutations.like_mutation import LikeMutation
from app.graphql.queries.hello_query import HelloQuery
from app.graphql.queries.like_query import LikeQuery
from app.graphql.queries.user_query import UserQuery
from app.graphql.mutations import Mutation
from app.graphql.mutations.auth_mutation import AuthMutation
from app.graphql.mutations.post_mutation import PostMutation
from app.graphql.queries.post_query import PostQuery
from app.graphql.mutations.comment_mutation import (
    CommentMutation
)
from app.graphql.subscriptions.like_subscription import (
    LikeSubscription
)
from app.graphql.queries.comment_query import CommentQuery
@strawberry.type
class Query(

    HelloQuery,
    
    UserQuery,

    PostQuery,

    CommentQuery,

    LikeQuery,

):
    pass

@strawberry.type
class Mutation(
    AuthMutation,
    PostMutation,
    CommentMutation,
    LikeMutation
):
    pass

@strawberry.type
class Subscription(
    LikeSubscription
):
    pass


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription
)

