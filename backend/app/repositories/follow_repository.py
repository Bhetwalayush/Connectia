from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.follow import Follow
from app.models.user import User

def get_follow(db: Session, follower_id: int, following_id: int):
    return db.query(Follow).filter(
        Follow.follower_id == follower_id,
        Follow.following_id == following_id
    ).first()

def create_follow(db: Session, follower_id: int, following_id: int):
    follow = Follow(follower_id=follower_id, following_id=following_id)
    db.add(follow)
    db.commit()
    db.refresh(follow)
    return follow

def delete_follow(db: Session, follower_id: int, following_id: int):
    follow = get_follow(db, follower_id, following_id)
    if follow:
        db.delete(follow)
        db.commit()
    return follow

def get_followers(db: Session, user_id: int):
    return db.query(User).join(Follow, Follow.follower_id == User.id)\
        .filter(Follow.following_id == user_id).all()

def get_following(db: Session, user_id: int):
    return db.query(User).join(Follow, Follow.following_id == User.id)\
        .filter(Follow.follower_id == user_id).all()

def count_followers(db: Session, user_id: int) -> int:
    return db.query(func.count(Follow.id)).filter(Follow.following_id == user_id).scalar()

def count_following(db: Session, user_id: int) -> int:
    return db.query(func.count(Follow.id)).filter(Follow.follower_id == user_id).scalar()