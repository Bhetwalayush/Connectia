import { useFollow } from "../../hooks/useFollow";

export default function FollowButton({ userId, isFollowing, onToggled }) {
  const { toggleFollow, loading } = useFollow(userId, isFollowing, onToggled);

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={loading}
      className={`rounded-full px-4 py-2 font-medium transition ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
