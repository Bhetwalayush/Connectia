import { useMutation } from "@apollo/client/react";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "../graphql/mutations/followMutations";

export function useFollow(userId, currentlyFollowing, onToggled) {
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER);
  const [unfollowUser, { loading: unfollowLoading }] =
    useMutation(UNFOLLOW_USER);

  const toggleFollow = async () => {
    try {
      if (currentlyFollowing) {
        await unfollowUser({ variables: { userId } });
      } else {
        await followUser({ variables: { userId } });
      }
      onToggled?.(); // let the caller refetch profile/counts
    } catch (err) {
      console.error("Follow toggle failed:", err.message);
    }
  };

  return { toggleFollow, loading: followLoading || unfollowLoading };
}
