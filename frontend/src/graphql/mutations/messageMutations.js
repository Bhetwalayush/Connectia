import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      success
      message
      chatMessage {
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
      conversation {
        id
        createdAt
        otherUser {
          id
          username
          email
        }
      }
    }
  }
`;

export const MARK_MESSAGES_READ = gql`
  mutation MarkMessagesRead($input: MarkReadInput!) {
    markMessagesRead(input: $input) {
      success
      message
    }
  }
`;
