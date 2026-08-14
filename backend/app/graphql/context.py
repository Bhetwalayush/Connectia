from fastapi import Request

from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository


async def get_context(request: Request):

    db = SessionLocal()

    user = None

    try:
        authorization = request.headers.get("Authorization")

        if authorization:
            parts = authorization.split(" ")

            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]

                payload = decode_access_token(token)

                user_id = payload.get("sub")

                if user_id:
                    user = (
                        UserRepository(db)
                        .get_user_by_id(int(user_id))
                    )

        return {
            "db": db,
            "user": user
        }

    except Exception:
        return {
            "db": db,
            "user": None
        }

    finally:
        # Don't close the DB here yet if your GraphQL
        # resolvers still need to use it.
        pass