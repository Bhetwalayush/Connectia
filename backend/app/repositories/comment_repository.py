# Comment repository - Database access layer for comment operations
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.models.comment import Comment

class CommentRepository:

    def __init__(
        self,
        db: Session
    ):
        self.db = db

    # Persist new comment to database
    def create_comment(
        self,
        comment: Comment
    ):

        self.db.add(comment)

        self.db.commit()

        self.db.refresh(comment)

        return comment

    def get_comment_by_id(
        self,
        comment_id: int
    ):

        return (

            self.db.query(Comment)

            .filter(
                Comment.id == comment_id
            )

            .first()

        )
    
    def get_comments_by_post(
        self,
        post_id: int,
        limit: int = 20,
        offset: int = 0
    ):

        return (
            self.db.query(Comment)
            .options(
                joinedload(Comment.author)
            )
            .filter(
                Comment.post_id == post_id
            )
            .order_by(
                Comment.created_at.asc()
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

    def update_comment(
        self,
        comment: Comment
    ):

        self.db.commit()

        self.db.refresh(comment)

        return comment

    def delete_comment(
        self,
        comment: Comment
    ):

        self.db.delete(comment)

        self.db.commit()