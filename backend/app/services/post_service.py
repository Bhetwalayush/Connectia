# Post service - Handles post creation, retrieval, and modification
from sqlalchemy.orm import Session

from app.models.post import Post
from app.repositories.post_repository import PostRepository


class PostService:

    def __init__(self, db: Session):

        self.post_repository = PostRepository(db)

    # Create new post with validation (empty check, character limit)
    def create_post(
    self,
    content: str,
    image_url: str | None,
    current_user
):

        if current_user is None:

            raise ValueError(
                "Authentication required."
            )

        content = content.strip()

        if not content:

            raise ValueError(
                "Post cannot be empty."
            )

        if len(content) > 2000:

            raise ValueError(
                "Post exceeds 2000 characters."
            )

        post = Post(
            content=content,
            image_url=image_url,
            user_id=current_user.id
        )

        return self.post_repository.create_post(post)

    def get_post(
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

        return post

    # Fetch paginated feed of all posts
    def get_feed(
        self,
        limit: int = 10,
        offset: int = 0
    ):
        return self.post_repository.get_all_posts(
            limit=limit,
            offset=offset
        )

    # Update post only if user is the author
    def update_post(
        self,
        post_id: int,
        content: str,
        current_user
    ):

        post = self.get_post(post_id)

        if post.user_id != current_user.id:

            raise ValueError(
                "You cannot edit this post."
            )

        content = content.strip()

        if not content:

            raise ValueError(
                "Post cannot be empty."
            )

        post.content = content

        return self.post_repository.update_post(post)

    def delete_post(
        self,
        post_id: int,
        current_user
    ):

        post = self.get_post(post_id)

        if post.user_id != current_user.id:

            raise ValueError(
                "You cannot delete this post."
            )

        self.post_repository.delete_post(post)

        return True