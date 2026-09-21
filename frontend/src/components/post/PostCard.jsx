// Post card component - Display post with edit/delete/like/comment options
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import useLikeSubscription from "../../hooks/useLikeSubscription";
import CommentSection from "../comment/CommentSection";
import { useAuth } from "../../context/useAuth";
import {
  UPDATE_POST,
  DELETE_POST,
} from "../../graphql/mutations/postMutations";
import { GET_POSTS } from "../../graphql/queries/postQueries";
import ImageUploadButton from "../common/ImageUploadButton";
import ProfilePicture from "../common/ProfilePicture";

function PostCard({ post }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || "");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
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

  function goToPost(event) {
    // Don't navigate if the click originated from an interactive element
    if (event.target.closest("button, a, input, textarea, form")) return;
    navigate(`/post/${post.id}`);
  }
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
          className="flex items-center gap-2 font-semibold hover:text-blue-600"
        >
          <ProfilePicture
            src={post.author.profilePictureUrl}
            alt={post.author.username}
            size="sm"
          />
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imageUrl || ""}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Image url optional"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <ImageUploadButton
              onUploaded={setImageUrl}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 4.5h19.5a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5H2.25a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5Z"
                />
              </svg>
            </ImageUploadButton>
          </div>
          <button
            type="submit"
            disabled={updating}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {updating ? "Saving..." : "Save changes"}
          </button>
        </form>
      ) : (
        <div onClick={goToPost} className="cursor-pointer">
          <p className="mt-3">{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              className="mt-4 w-full rounded-lg"
            />
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-6">
        <LikeButton
          postId={post.id}
          likedByMe={post.likedByMe}
          likeCount={post.likeCount}
        />

        <button
          type="button"
          onClick={() => setShowComments(true)}
          className="flex items-center gap-2"
        >
          <span aria-hidden="true">💬</span> {post.commentCount}
        </button>
      </div>

      <CommentSection
        postId={post.id}
        showAll={showComments}
        setShowAll={setShowComments}
      />
      {message && (
        <p className="mt-2 text-xs text-red-600" role="status">
          {message}
        </p>
      )}
    </article>
  );
}

export default PostCard;
