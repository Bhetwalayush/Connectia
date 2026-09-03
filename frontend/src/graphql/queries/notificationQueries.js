import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      type
      createdAt
      readAt
      postId
      actor {
        id
        username
      }
    }
  }
`;
