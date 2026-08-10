from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=True
)

SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)

Base = declarative_base()

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()