import strawberry

from .auth_mutation import AuthMutation


@strawberry.type
class Mutation(AuthMutation):
    pass