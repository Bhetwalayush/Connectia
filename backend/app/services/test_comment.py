from app.core.database import SessionLocal
from app.repositories.user_repository import UserRepository
from app.services.comment_service import CommentService


db = SessionLocal()

user_repository = UserRepository(db)

user = user_repository.get_user_by_id(1)

service = CommentService(db)

comment = service.create_comment(
    post_id=2,
    content="Great post!",
    current_user=user
)

print(comment.id)
print(comment.content)
print(comment.user_id)
print(comment.post_id)

db.close()