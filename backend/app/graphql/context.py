# GraphQL context builder - Extracts user from JWT token and provides DB session
from fastapi import Request, Response

from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository


# Build context for each GraphQL request (parse token, fetch user)
async def get_context(request: Request, response: Response):

    db = SessionLocal()

    user = None

    try:
        token = request.cookies.get("access_token")

        if token:
            payload = decode_access_token(token)

            if payload:
                user_id = payload.get("sub")

                if user_id:
                    user = UserRepository(db).get_user_by_id(int(user_id))

        return {
            "db": db,
            "user": user,
            "response": response,
        }

    except Exception:
        return {
            "db": db,
            "user": None,
            "response": response,
        }

    finally:
        # Don't close the DB here yet if your GraphQL
        # resolvers still need to use it.
        pass