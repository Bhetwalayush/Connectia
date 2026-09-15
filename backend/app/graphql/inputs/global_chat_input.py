import strawberry


@strawberry.input
class SendGlobalMessageInput:

    display_name: str

    content: str