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

            token = authorization.split(" ")[1]

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