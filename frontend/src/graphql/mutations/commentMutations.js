import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      message
      comment {
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
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      success
      message
      comment {
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
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: Int!) {
    deleteComment(commentId: $commentId) {
      success
      message
    }
  }
`;
