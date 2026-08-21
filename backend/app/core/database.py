# Database initialization and session management
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

from app.core.config import settings

# Database connection engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True
)

# Session factory for creating database sessions
SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)

# Base class for all SQLAlchemy models
Base = declarative_base()

# Dependency injection for database session in routes
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()