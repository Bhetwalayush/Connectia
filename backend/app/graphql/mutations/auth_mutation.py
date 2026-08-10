import strawberry

from app.graphql.inputs.auth_input import LoginInput
from app.core.database import SessionLocal
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService

from app.graphql.inputs.auth_input import RegisterInput
from app.graphql.types.auth_type import AuthResponse
from app.graphql.types.user_type import UserType
from strawberry.types import Info

@strawberry.type
class AuthMutation:

    @strawberry.mutation
    def register(
        self,
        info: Info,
        input: RegisterInput
    ) -> AuthResponse:

        try:
            db = info.context["db"]
            service = AuthService(db)

            user_data = UserCreate(
                username=input.username,
                email=input.email,
                password=input.password
            )

            user = service.register_user(user_data)

            return AuthResponse(
                success=True,
                message="Registration successful.",
                user=UserType(
                    id=user.id,
                    username=user.username,
                    email=user.email
                )
            )

        except ValueError as e:
            return AuthResponse(
                success=False,
                message=str(e),
                user=None
            )
    @strawberry.mutation
    def login(
        self,
        info: Info,
        input: LoginInput
    ) -> AuthResponse:

        db = info.context["db"]

        try:
            service = AuthService(db)

            result = service.login_user(
                input.email,
                input.password
            )

            user = result["user"]

            return AuthResponse(
                success=True,
                message="Login successful.",
                access_token=result["token"],
                user=UserType(
                    id=user.id,
                    username=user.username,
                    email=user.email
                )
            )

        except ValueError as e:
            return AuthResponse(
                success=False,
                message=str(e),
                access_token=None,
                user=None
            )