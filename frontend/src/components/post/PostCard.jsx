import useLikeSubscription from "../../hooks/useLikeSubscription";

function PostCard({ post }) {
  useLikeSubscription(post.id);

  return (
    <article className="rounded-xl border bg-white p-4">
      <div>
        <h2 className="font-semibold">{post.author.username}</h2>
      </div>

      <p className="mt-3">{post.content}</p>

      <div className="mt-4 flex gap-4">
        <span>❤️ {post.likeCount}</span>

        <span>💬 {post.commentCount}</span>
      </div>
    </article>
  );
}

export default PostCard;
