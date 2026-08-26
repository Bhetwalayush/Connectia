// Real-time like count listener via WebSocket subscription
import { useSubscription, useApolloClient } from "@apollo/client/react";

import { LIKE_UPDATED_SUBSCRIPTION } from "../../graphql/subscriptions/likeSubscription";

// Listen for like updates and sync Apollo cache
function LiveLikeCount({ postId }) {
  const client = useApolloClient();

  // Subscribe to like events and update cache in real-time
  const { error } = useSubscription(LIKE_UPDATED_SUBSCRIPTION, {
    variables: {
      postId,
    },

    onData: ({ data: subscriptionData }) => {
      const event = subscriptionData?.data?.likeUpdated;

      if (!event) {
        return;
      }

      client.cache.modify({
        id: client.cache.identify({
          __typename: "PostType",
          id: event.postId,
        }),

        fields: {
          likeCount() {
            return event.likeCount;
          },
        },
      });
    },
  });

  if (error) {
    console.error("Like subscription error:", error);
  }

  return null;
}

export default LiveLikeCount;
