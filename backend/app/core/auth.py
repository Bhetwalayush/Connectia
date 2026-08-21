# Current user extraction and validation from JWT token
from fastapi import HTTPException

from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository


# Extract and validate current user from JWT token
def get_current_user(
    token: str,
    db
):
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token."
        )

    try:
        user_id = int(payload["sub"])

    except (KeyError, ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid token."
        )

    user = UserRepository(db).get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found."
        )

    return user