import { gql } from "@apollo/client";

export const GLOBAL_CHAT_UPDATED_SUBSCRIPTION = gql`
  subscription GlobalChatUpdated {
    globalChatUpdated {
      id
      senderId
      displayName
      content
      createdAt
    }
  }
`;
