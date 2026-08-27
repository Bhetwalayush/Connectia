import { useFollow } from "../../hooks/useFollow";

export default function FollowButton({
  userId,
  isFollowing,
  followsYou = false,
  onToggled,
  compact = false,
}) {
  const { toggleFollow, loading } = useFollow(userId, isFollowing, onToggled);

  const followLabel = followsYou ? "Follow back" : "Follow";

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={loading}
      className={`rounded-full font-medium transition ${
        compact ? "px-3 py-1 text-sm" : "px-4 py-2"
      } ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {loading ? "..." : isFollowing ? "Following" : followLabel}
    </button>
  );
}
