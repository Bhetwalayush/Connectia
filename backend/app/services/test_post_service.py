from app.core.database import SessionLocal
from app.services.post_service import PostService
from app.repositories.user_repository import UserRepository

db = SessionLocal()

user = UserRepository(db).get_user_by_id(1)

service = PostService(db)

post = service.create_post(
    content="Hello Connectia!",
    image_url=None,
    current_user=user
)

print(post.id, post.content)

db.close()