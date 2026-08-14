import { gql } from "@apollo/client";

export const LIKE_POST = gql`
  mutation LikePost($input: LikeInput!) {
    likePost(input: $input) {
      success
      message
      likeCount

      like {
        id
        createdAt

        user {
          id
          username
        }
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($input: LikeInput!) {
    unlikePost(input: $input) {
      success
      message
      likeCount
    }
  }
`;
