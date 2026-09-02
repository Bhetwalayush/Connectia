# User repository - Database access layer for user operations
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str):
        return (
            self.db
            .query(User)
            .filter(User.email == email)
            .first()
        )

    def get_user_by_username(self, username: str):
        return (
            self.db
            .query(User)
            .filter(User.username == username)
            .first()
        )

    def get_user_by_id(self, user_id: int):
        return (
            self.db
            .query(User)
            .filter(User.id == user_id)
            .first()
        )

    # Case-insensitive partial match on username, for search bars
    def search_users_by_username(
        self,
        query: str,
        exclude_user_id: int | None = None,
        limit: int = 10,
    ):
        search_query = (
            self.db
            .query(User)
            .filter(User.username.ilike(f"%{query}%"))
        )

        if exclude_user_id is not None:
            search_query = search_query.filter(User.id != exclude_user_id)

        return (
            search_query
            .order_by(User.username.asc())
            .limit(limit)
            .all()
        )

    def create_user(self, user_data: UserCreate):
        user = User(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user

    def delete_user(self, user: User):
        self.db.delete(user)
        self.db.commit()

    def update_user(self, user: User):
        self.db.commit()
        self.db.refresh(user)
        return user