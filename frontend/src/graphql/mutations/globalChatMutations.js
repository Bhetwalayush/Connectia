import { gql } from "@apollo/client";

export const SEND_GLOBAL_MESSAGE = gql`
  mutation SendGlobalMessage($input: SendGlobalMessageInput!) {
    sendGlobalMessage(input: $input) {
      success
      message
      chatMessage {
        id
        senderId
        displayName
        content
        createdAt
      }
    }
  }
`;
