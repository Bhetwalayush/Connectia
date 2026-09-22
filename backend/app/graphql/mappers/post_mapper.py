from app.graphql.types.post_type import PostType
# from app.graphql.types.user_type import UserType
from app.graphql.queries.user_query import to_user_type

def to_post_type(post):

    return PostType(

        id=post.id,

        content=post.content,

        image_url=post.image_url,

        created_at=post.created_at,

        updated_at=post.updated_at,

        # author=UserType(

        #     id=post.author.id,

        #     username=post.author.username,

        #     email=post.author.email

        # ),

        author=to_user_type(post.author),

        comment_count=len(post.comments)

    )