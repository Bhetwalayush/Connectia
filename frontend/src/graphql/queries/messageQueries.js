import { gql } from "@apollo/client";

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      id
      createdAt
      otherUser {
        id
        username
        email
      }
      lastMessage {
        id
        content
        createdAt
        readAt
        sender {
          id
          username
        }
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: Int!, $cursor: Int, $limit: Int) {
    messages(conversationId: $conversationId, cursor: $cursor, limit: $limit) {
      items {
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
      nextCursor
      hasMore
    }
  }
`;
