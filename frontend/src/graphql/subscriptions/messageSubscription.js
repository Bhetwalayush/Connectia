import { gql } from "@apollo/client";

export const MESSAGE_UPDATED_SUBSCRIPTION = gql`
  subscription MessageUpdated($conversationId: Int!) {
    messageUpdated(conversationId: $conversationId) {
      conversationId
      action
      actorId
      message {
        id
        content
        createdAt
        readAt
        conversationId
        sender {
          id
          username
        }
      }
      readMessageIds
    }
  }
`;
