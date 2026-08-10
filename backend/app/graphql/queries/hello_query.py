import strawberry


@strawberry.type
class HelloQuery:

    @strawberry.field
    def hello(self) -> str:

        return "Welcome to Connectia GraphQL 🚀"