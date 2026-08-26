# GraphQL context builder - Extracts user from JWT token and provides DB session
from fastapi import Response
from fastapi import WebSocket
from starlette.requests import HTTPConnection
from typing import AsyncGenerator, Any

from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository


# Build context for each GraphQL request (parse token, fetch user)
async def get_context(
    connection: HTTPConnection,
    response: Response = None,
) -> AsyncGenerator[dict[str, Any], None]:
    # A WebSocket can stay open for a long time. Do not create a database
    # session at connection time, or it can occupy a pool connection until the
    # client disconnects. Current subscriptions do not need database access.
    # Any future subscription query should open and close its own short-lived
    # session around the database work it performs.
    if isinstance(connection, WebSocket):
        yield {
            "db": None,
            "user": None,
            "current_user": None,
            "response": response,
            "request": connection,
        }
        return

    db = SessionLocal()

    user = None

    try:
        token = connection.cookies.get("access_token")

        if token:
            payload = decode_access_token(token)

            if payload:
                user_id = payload.get("sub")

                if user_id:
                    user = UserRepository(db).get_user_by_id(int(user_id))

        yield {
            "db": db,
            "user": user,
            "current_user": user,
            "response": response,
            "request": connection,
        }

    except Exception:
        yield {
            "db": db,
            "user": None,
            "current_user": None,
            "response": response,
            "request": connection,
        }

    finally:
        # FastAPI finalizes yield dependencies after the HTTP GraphQL request
        # finishes, returning the connection to SQLAlchemy's pool.
        db.close()
