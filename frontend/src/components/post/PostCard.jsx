// Post card component - Display post with edit/delete/like/comment options
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import useLikeSubscription from "../../hooks/useLikeSubscription";
import CommentSection from "../comment/CommentSection";
import { useAuth } from "../../context/useAuth";
import {
  UPDATE_POST,
  DELETE_POST,
} from "../../graphql/mutations/postMutations";
import { GET_POSTS } from "../../graphql/queries/postQueries";

function PostCard({ post }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [message, setMessage] = useState("");
  // Refetch posts list after mutation
  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST, {
    refetchQueries: [GET_POSTS],
    awaitRefetchQueries: true,
  });
  const [deletePost, { loading: deleting }] = useMutation(DELETE_POST, {
    refetchQueries: [GET_POSTS],
    awaitRefetchQueries: true,
  });
  useLikeSubscription(post.id);
  // Only post author can edit/delete
  const isOwner = String(user?.id) === String(post.author.id);

  // Update post content
  // Update Image url
  async function handleUpdate(event) {
    event.preventDefault();
    setMessage("");

    if (!content.trim()) {
      setMessage("Post cannot be empty.");
      return;
    }

    try {
      const { data } = await updatePost({
        variables: {
          input: {
            postId: Number(post.id),
            content: content.trim(),
            imageUrl: imageUrl.trim() || null,
          },
        },
      });

      if (!data?.updatePost?.success) {
        setMessage(data?.updatePost?.message || "Could not update post.");
        return;
      }

      setEditing(false);
    } catch {
      setMessage("Could not update post. Please try again.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post?")) return;
    setMessage("");

    try {
      const { data } = await deletePost({
        variables: { postId: Number(post.id) },
      });

      if (!data?.deletePost?.success) {
        setMessage(data?.deletePost?.message || "Could not delete post.");
      }
    } catch {
      setMessage("Could not delete post. Please try again.");
    }
  }

  return (
    <article className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/profile/${post.author.id}`}
          className="font-semibold hover:text-blue-600"
        >
          {post.author.username}
        </Link>
        {isOwner && (
          <div className="flex shrink-0 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="mt-3 space-y-2">
          <textarea
            value={content}
            maxLength={2000}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            type="text"
            value={imageUrl || ""}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Image url optional"
            className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={updating}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {updating ? "Saving..." : "Save changes"}
          </button>
        </form>
      ) : (
        <p className="mt-3">{post.content}</p>
      )}

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
          <span aria-hidden="true">💬</span> {post.commentCount}
        </button>
      </div>

      <CommentSection postId={post.id} />
      {message && (
        <p className="mt-2 text-xs text-red-600" role="status">
          {message}
        </p>
      )}
    </article>
  );
}

export default PostCard;
