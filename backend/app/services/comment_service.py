from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.repositories.comment_repository import CommentRepository
from app.repositories.post_repository import PostRepository


class CommentService:

    def __init__(self, db: Session):

        self.comment_repository = CommentRepository(db)

        self.post_repository = PostRepository(db)

    def create_comment(
        self,
        post_id: int,
        content: str,
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

        content = content.strip()

        if not content:

            raise ValueError(
                "Comment cannot be empty."
            )

        if len(content) > 1000:

            raise ValueError(
                "Comment cannot exceed 1000 characters."
            )

        comment = Comment(
            content=content,
            user_id=current_user.id,
            post_id=post_id
        )

        return self.comment_repository.create_comment(
            comment
        )

    def get_comments(
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

        return self.comment_repository.get_comments_by_post(
            post_id=post_id,
            limit=limit,
            offset=offset
        )

    def get_comment(
        self,
        comment_id: int
    ):

        comment = (
            self.comment_repository
            .get_comment_by_id(comment_id)
        )

        if not comment:

            raise ValueError(
                "Comment not found."
            )

        return comment

    def update_comment(
        self,
        comment_id: int,
        content: str,
        current_user
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        comment = self.get_comment(
            comment_id
        )

        if comment.user_id != current_user.id:

            raise ValueError(
                "You cannot edit this comment."
            )

        content = content.strip()

        if not content:

            raise ValueError(
                "Comment cannot be empty."
            )

        if len(content) > 1000:

            raise ValueError(
                "Comment cannot exceed 1000 characters."
            )

        comment.content = content

        return (
            self.comment_repository
            .update_comment(comment)
        )

    def delete_comment(
        self,
        comment_id: int,
        current_user
    ):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        comment = self.get_comment(
            comment_id
        )

        if comment.user_id != current_user.id:

            raise ValueError(
                "You cannot delete this comment."
            )

        self.comment_repository.delete_comment(
            comment
        )

        return True