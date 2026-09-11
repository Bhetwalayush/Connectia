# FastAPI application with GraphQL support for Connectia social platform
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import (
    GRAPHQL_TRANSPORT_WS_PROTOCOL,
    GRAPHQL_WS_PROTOCOL,
)
from dotenv import load_dotenv

from app.graphql.schema import schema
from app.graphql.context import get_context

load_dotenv()

app = FastAPI()

# CORS configuration for frontend at localhost:5173
# origins = [
#             load_dotenv().get("CORS_ORIGINS").split(",")
# ]

origins = os.getenv("CORS_ORIGINS", "").split(",")

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