// WebSocket subscription to listen for real-time like/unlike events
import { gql } from "@apollo/client";

// Subscribe to like changes on a specific post
export const LIKE_UPDATED_SUBSCRIPTION = gql`
  subscription LikeUpdated($postId: Int!) {
    likeUpdated(postId: $postId) {
      postId

      userId

      likeCount

      action # 'like' or 'unlike'
    }
  }
`;
