import { useApolloClient, useSubscription } from "@apollo/client/react";

import { LIKE_UPDATED_SUBSCRIPTION } from "../graphql/subscriptions/likeSubscription";

function useLikeSubscription(postId) {
  const client = useApolloClient();

  return useSubscription(LIKE_UPDATED_SUBSCRIPTION, {
    variables: {
      postId,
    },

    onData: ({ data: subscriptionResult }) => {
      const event = subscriptionResult?.data?.likeUpdated;

      if (!event) {
        return;
      }

      const cacheId = client.cache.identify({
        __typename: "Post",
        id: event.postId,
      });

      if (!cacheId) {
        return;
      }

      client.cache.modify({
        id: cacheId,

        fields: {
          likeCount() {
            return event.likeCount;
          },
        },
      });
    },
  });
}

export default useLikeSubscription;
