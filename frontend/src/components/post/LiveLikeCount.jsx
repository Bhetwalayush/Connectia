import { useSubscription, useApolloClient } from "@apollo/client/react";

import { LIKE_UPDATED_SUBSCRIPTION } from "../../graphql/subscriptions/likeSubscription";

function LiveLikeCount({ postId }) {
  const client = useApolloClient();

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
          __typename: "Post",
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
