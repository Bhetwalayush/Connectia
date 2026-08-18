import LikeButton from "./LikeButton";

function PostCard({ post }) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <div>
        <h2 className="font-semibold">{post.author.username}</h2>
      </div>

      <p className="mt-3">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="mt-4 w-full rounded-lg"
        />
      )}

      <div className="mt-4 flex items-center gap-6">
        <LikeButton
          postId={post.id}
          likedByMe={post.likedByMe}
          likeCount={post.likeCount}
        />

        <button type="button" className="flex items-center gap-2">
          💬 {post.commentCount}
        </button>
      </div>
    </article>
  );
}

export default PostCard;
