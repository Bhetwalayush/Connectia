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
          profilePictureUrl
        }
      }
      conversation {
        id
        createdAt
        otherUser {
          id
          username
          email
          profilePictureUrl
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
