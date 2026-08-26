# Post repository - Database access layer for post operations
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.models.post import Post


class PostRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_post(
        self,
        post: Post
    ):
        self.db.add(post)
        self.db.commit()

        self.db.refresh(post)

        return post

    # Retrieve post with eager loading of author and comments
    def get_post_by_id(
        self,
        post_id: int
    ):

        return (
            self.db.query(Post)
            .options(
                joinedload(Post.author),
                joinedload(Post.comments)
            )
            .filter(
                Post.id == post_id
            )
            .first()
        )

    # Fetch all posts ordered by creation date (newest first) with pagination
    def get_all_posts(
        self,
        limit: int = 10,
        offset: int = 0
    ):
        return (
            self.db.query(Post)
            .options(joinedload(Post.author),
                     joinedload(Post.comments))
            .order_by(Post.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_posts_by_user(
        self,
        user_id: int,
        limit: int = 20,
        offset: int = 0,
    ):
        return (
            self.db.query(Post)
            .options(joinedload(Post.author), joinedload(Post.comments))
            .filter(Post.user_id == user_id)
            .order_by(Post.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    def update_post(
        self,
        post: Post
    ):
        self.db.commit()

        self.db.refresh(post)

        return post

    def delete_post(
        self,
        post: Post
    ):
        self.db.delete(post)

        self.db.commit()

    
