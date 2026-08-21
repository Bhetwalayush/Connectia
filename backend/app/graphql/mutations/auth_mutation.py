# GraphQL mutations for authentication (login, register)
import strawberry

from app.graphql.inputs.auth_input import LoginInput
from app.core.database import SessionLocal
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService

from app.graphql.inputs.auth_input import RegisterInput
from app.graphql.types.auth_type import AuthResponse
from app.graphql.types.user_type import UserType
from strawberry.types import Info

ACCESS_TOKEN_COOKIE = "access_token"

@strawberry.type
class AuthMutation:

    # Register new user account
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
    # Authenticate user and return JWT token
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

            info.context["response"].set_cookie(
                key=ACCESS_TOKEN_COOKIE,
                value=result["token"],
                httponly=True,
                secure=False,
                samesite="lax",
                max_age=60 * 60,
            )

            return AuthResponse(
                success=True,
                message="Login successful.",
                access_token=None,
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

    @strawberry.mutation
    def logout(self, info: Info) -> AuthResponse:
        info.context["response"].delete_cookie(
            key=ACCESS_TOKEN_COOKIE,
            httponly=True,
            samesite="lax",
        )

        return AuthResponse(
            success=True,
            message="Logout successful.",
            access_token=None,
            user=None,
        )