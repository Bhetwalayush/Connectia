import { useEffect } from "react";

import { useApolloClient, useSubscription } from "@apollo/client/react";

import { LIKE_UPDATED_SUBSCRIPTION } from "../graphql/subscriptions/likeSubscription";

function useLikeSubscription(postId) {
  const client = useApolloClient();

  const { data, loading, error } = useSubscription(LIKE_UPDATED_SUBSCRIPTION, {
    variables: { postId: Number(postId) },
    skip: !postId,
  });

  useEffect(() => {
    if (!data?.likeUpdated) {
      return;
    }

    const { postId, userId, likeCount, action } = data.likeUpdated;

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
