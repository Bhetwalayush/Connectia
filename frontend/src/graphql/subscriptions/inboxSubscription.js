import { gql } from "@apollo/client";

export const INBOX_UPDATED_SUBSCRIPTION = gql`
  subscription InboxUpdated($userId: Int!) {
    inboxUpdated(userId: $userId) {
      conversationId
      action
      actorId
    }
  }
`;
