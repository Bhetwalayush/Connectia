# FastAPI application with GraphQL support for Connectia social platform
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import (
    GRAPHQL_TRANSPORT_WS_PROTOCOL,
    GRAPHQL_WS_PROTOCOL,
)

from app.graphql.schema import schema
from app.graphql.context import get_context


app = FastAPI()

# CORS configuration for frontend at localhost:5173
origins = [
    "http://localhost:5173",
    "ws://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL endpoint with WebSocket support for real-time subscriptions
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context,
    subscription_protocols=[
        GRAPHQL_TRANSPORT_WS_PROTOCOL,
        GRAPHQL_WS_PROTOCOL,
    ],
)

app.include_router(
    graphql_app,
    prefix="/graphql",
)