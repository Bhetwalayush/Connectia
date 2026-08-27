from sqlalchemy.orm import Session, aliased
from sqlalchemy import and_, exists, func, literal
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


def get_suggested_users(db: Session, current_user_id: int, limit: int = 5):
    """Users the current user does not follow.

    Ranked by: people who follow you first, then mutual follow overlap.
    Mutual count = how many accounts you follow that also follow the candidate.
    """
    following_ids = [
        row[0]
        for row in db.query(Follow.following_id)
        .filter(Follow.follower_id == current_user_id)
        .all()
    ]
    excluded_ids = following_ids + [current_user_id]

    FollowBack = aliased(Follow)
    follows_you = exists().where(
        and_(
            FollowBack.follower_id == User.id,
            FollowBack.following_id == current_user_id,
        )
    )

    if following_ids:
        MutualFollow = aliased(Follow)
        mutual_sub = (
            db.query(
                MutualFollow.following_id.label("user_id"),
                func.count(MutualFollow.id).label("mutual_count"),
            )
            .filter(MutualFollow.follower_id.in_(following_ids))
            .group_by(MutualFollow.following_id)
            .subquery()
        )
        query = (
            db.query(
                User.id,
                User.username,
                User.email,
                func.coalesce(mutual_sub.c.mutual_count, 0).label("mutual_count"),
                follows_you.label("follows_you"),
            )
            .outerjoin(mutual_sub, mutual_sub.c.user_id == User.id)
            .filter(~User.id.in_(excluded_ids))
            .order_by(
                follows_you.desc(),
                func.coalesce(mutual_sub.c.mutual_count, 0).desc(),
                User.id.desc(),
            )
            .limit(limit)
        )
    else:
        query = (
            db.query(
                User.id,
                User.username,
                User.email,
                literal(0).label("mutual_count"),
                follows_you.label("follows_you"),
            )
            .filter(~User.id.in_(excluded_ids))
            .order_by(follows_you.desc(), User.id.desc())
            .limit(limit)
        )

    return [
        {
            "id": row.id,
            "username": row.username,
            "email": row.email,
            "mutual_count": int(row.mutual_count),
            "follows_you": bool(row.follows_you),
        }
        for row in query.all()
    ]