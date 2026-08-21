# Like repository - Database access layer for like operations
from sqlalchemy.orm import Session

from app.models.like import Like


class LikeRepository:

    def __init__(self, db: Session):

        self.db = db

    # Persist new like to database
    def create_like(
        self,
        like: Like
    ):

        self.db.add(like)

        self.db.commit()

        self.db.refresh(like)

        return like

    # Check if user has already liked this post
    def get_like(
        self,
        user_id: int,
        post_id: int
    ):

        return (
            self.db.query(Like)
            .filter(
                Like.user_id == user_id,
                Like.post_id == post_id
            )
            .first()
        )

    def get_like_by_id(
        self,
        like_id: int
    ):

        return (
            self.db.query(Like)
            .filter(
                Like.id == like_id
            )
            .first()
        )

    def get_likes_by_post(
        self,
        post_id: int,
        limit: int = 20,
        offset: int = 0
    ):

        return (
            self.db.query(Like)
            .filter(
                Like.post_id == post_id
            )
            .order_by(
                Like.created_at.desc()
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

    def count_likes(
        self,
        post_id: int
    ):

        return (
            self.db.query(Like)
            .filter(
                Like.post_id == post_id
            )
            .count()
        )

    def delete_like(
        self,
        like: Like
    ):

        self.db.delete(like)

        self.db.commit()