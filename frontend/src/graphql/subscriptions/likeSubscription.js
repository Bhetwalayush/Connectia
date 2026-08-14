import { gql } from "@apollo/client";

export const LIKE_UPDATED_SUBSCRIPTION = gql`
  subscription LikeUpdated($postId: Int!) {
    likeUpdated(postId: $postId) {
      postId

      userId

      likeCount

      action
    }
  }
`;
