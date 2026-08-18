import { useApolloClient, useMutation } from "@apollo/client/react";

import { LIKE_POST, UNLIKE_POST } from "../../graphql/mutations/likeMutations";

function LikeButton({ postId, likedByMe, likeCount }) {
  const client = useApolloClient();

  const [likePost, { loading: liking }] = useMutation(LIKE_POST);

  const [unlikePost, { loading: unliking }] = useMutation(UNLIKE_POST);

  const loading = liking || unliking;

  function updatePostLikeCount(newLikeCount) {
    const cacheId = client.cache.identify({
      __typename: "Post",
      id: postId,
    });

    if (!cacheId) {
      return;
    }

    client.cache.modify({
      id: cacheId,

      fields: {
        likeCount() {
          return newLikeCount;
        },

        likedByMe() {
          return !likedByMe;
        },
      },
    });
  }

  async function handleLike() {
    try {
      if (likedByMe) {
        const result = await unlikePost({
          variables: {
            input: {
              postId,
            },
          },
        });

        const response = result.data?.unlikePost;

        if (response?.success) {
          updatePostLikeCount(response.likeCount);
        }

        return;
      }

      const result = await likePost({
        variables: {
          input: {
            postId,
          },
        },
      });

      const response = result.data?.likePost;

      if (response?.success) {
        updatePostLikeCount(response.likeCount);
      }
    } catch (error) {
      console.error("Like action failed:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <span>{likedByMe ? "❤️" : "♡"}</span>

      <span>{likeCount}</span>
    </button>
  );
}

export default LikeButton;
