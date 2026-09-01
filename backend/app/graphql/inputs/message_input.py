import strawberry


@strawberry.input
class SendMessageInput:

    recipient_id: int

    content: str