import { gql } from "@apollo/client";

export const GET_GLOBAL_MESSAGES = gql`
  query GetGlobalMessages($cursor: Int, $limit: Int) {
    globalMessages(cursor: $cursor, limit: $limit) {
      items {
        id
        senderId
        displayName
        content
        createdAt
      }
      nextCursor
      hasMore
    }
  }
`;
