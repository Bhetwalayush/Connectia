from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from app.graphql.schema import schema
from app.graphql.context import get_context

app = FastAPI()

graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context
)

app.include_router(
    graphql_app,
    prefix="/graphql"
)