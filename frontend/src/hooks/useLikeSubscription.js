import { useEffect } from "react";

import { useApolloClient, useSubscription } from "@apollo/client";

import { LIKE_SUBSCRIPTION } from "../graphql/subscriptions/likeSubscription";

function useLikeSubscription() {
  const client = useApolloClient();

  const { data, loading, error } = useSubscription(LIKE_SUBSCRIPTION);

  useEffect(() => {
    if (!data?.likeSubscription) {
      return;
    }

    const { postId, userId, likeCount, action } = data.likeSubscription;

    console.log("Like event:", {
      postId,
      userId,
      likeCount,
      action,
    });

    const cacheId = client.cache.identify({
      __typename: "Post",
      id: postId,
    });

    if (!cacheId) {
      console.warn("Post not found in Apollo cache:", postId);

      return;
    }

    client.cache.modify({
      id: cacheId,

      fields: {
        likeCount() {
          return likeCount;
        },
      },
    });
  }, [data, client]);

  return {
    loading,
    error,
  };
}

export default useLikeSubscription;
