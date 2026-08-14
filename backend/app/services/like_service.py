from sqlalchemy.orm import Session

from app.models.like import Like
from app.repositories.like_repository import LikeRepository
from app.repositories.post_repository import PostRepository


class LikeService:

    def __init__(self, db: Session):

        self.like_repository = LikeRepository(db)

        self.post_repository = PostRepository(db)

    def like_post(
        self,
        post_id: int,
        current_user
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        post = self.post_repository.get_post_by_id(
            post_id
        )

        if not post:

            raise ValueError(
                "Post not found."
            )

        existing_like = self.like_repository.get_like(
            user_id=current_user.id,
            post_id=post_id
        )

        if existing_like:

            raise ValueError(
                "You already liked this post."
            )

        like = Like(
            user_id=current_user.id,
            post_id=post_id
        )

        created_like = self.like_repository.create_like(
        like
        )

        return created_like

    def unlike_post(
        self,
        post_id: int,
        current_user
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        existing_like = self.like_repository.get_like(
            user_id=current_user.id,
            post_id=post_id
        )

        if not existing_like:

            raise ValueError(
                "You have not liked this post."
            )

        self.like_repository.delete_like(
            existing_like
        )

        return True

    def has_liked(
        self,
        post_id: int,
        current_user
    ):

        if current_user is None:

            return False

        like = self.like_repository.get_like(
            user_id=current_user.id,
            post_id=post_id
        )

        return like is not None

    def get_like_count(
        self,
        post_id: int
    ):

        post = self.post_repository.get_post_by_id(
            post_id
        )

        if not post:

            raise ValueError(
                "Post not found."
            )

        return self.like_repository.count_likes(
            post_id
        )

    def get_likes(
        self,
        post_id: int,
        limit: int = 20,
        offset: int = 0
    ):
        if limit < 1:
            raise ValueError(
                "Limit must be greater than 0."
            )

        if limit > 100:
            raise ValueError(
                "Limit cannot exceed 100."
            )

        if offset < 0:
            raise ValueError(
                "Offset cannot be negative."
            )

        post = self.post_repository.get_post_by_id(
            post_id
        )

        if not post:
            raise ValueError(
                "Post not found."
            )

        return self.like_repository.get_likes_by_post(
            post_id=post_id,
            limit=limit,
            offset=offset
        )