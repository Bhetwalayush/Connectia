# Database session dependency injection for FastAPI routes
from app.core.database import SessionLocal


# Provide database session as a dependency in route handlers
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()