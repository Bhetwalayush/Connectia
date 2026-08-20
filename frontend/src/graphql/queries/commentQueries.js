import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($postId: Int!) {
    comments(postId: $postId) {
      id
      content
      createdAt
      updatedAt
      author {
        id
        username
      }
    }
  }
`;
