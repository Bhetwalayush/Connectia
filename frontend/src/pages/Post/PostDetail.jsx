// Single post view - used for notification links (like/comment) and direct post links
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_POST } from "../../graphql/queries/postQueries";
import PostCard from "../../components/post/PostCard";

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { postId: Number(postId) },
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="h-48 animate-pulse rounded-xl border bg-white" />
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          This post could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-3 p-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
      >
        ←
      </button>
      <PostCard post={data.post} />
    </div>
  );
}

export default PostDetail;
