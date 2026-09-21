"""add profile_picture_url to users

Revision ID: caccde43e6bd
Revises: 37363f9c7131
Create Date: 2026-09-18 08:04:56.312448

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'caccde43e6bd'
down_revision: Union[str, Sequence[str], None] = '37363f9c7131'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'users',
        sa.Column('profile_picture_url', sa.String(), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'profile_picture_url')