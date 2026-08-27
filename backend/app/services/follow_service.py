from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories import follow_repository as repo

def follow_user(db: Session, current_user_id: int, target_user_id: int):
    if current_user_id == target_user_id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    existing = repo.get_follow(db, current_user_id, target_user_id)
    if existing:
        raise HTTPException(status_code=400, detail="Already following this user")

    return repo.create_follow(db, current_user_id, target_user_id)

def unfollow_user(db: Session, current_user_id: int, target_user_id: int):
    follow = repo.delete_follow(db, current_user_id, target_user_id)
    if not follow:
        raise HTTPException(status_code=400, detail="You are not following this user")
    return True

def is_following(db: Session, current_user_id: int, target_user_id: int) -> bool:
    return repo.get_follow(db, current_user_id, target_user_id) is not None


def get_suggested_users(db: Session, current_user_id: int, limit: int = 5):
    safe_limit = max(1, min(limit, 20))
    return repo.get_suggested_users(db, current_user_id, safe_limit)