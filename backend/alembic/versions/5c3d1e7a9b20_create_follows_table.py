"""Create follows table.

Revision ID: 5c3d1e7a9b20
Revises: 1fda74559ff1
Create Date: 2026-08-25
"""

from typing import Sequence, Union

from alembic import op


revision: str = "5c3d1e7a9b20"
down_revision: Union[str, Sequence[str], None] = "1fda74559ff1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS follows (
            id SERIAL PRIMARY KEY,
            follower_id INTEGER NOT NULL REFERENCES users(id),
            following_id INTEGER NOT NULL REFERENCES users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            CONSTRAINT uq_follower_following UNIQUE (follower_id, following_id)
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS ix_follows_id ON follows (id)")


def downgrade() -> None:
    op.drop_table("follows")
