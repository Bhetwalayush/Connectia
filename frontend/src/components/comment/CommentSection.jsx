// Comment display and creation component for posts
import { useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { GET_COMMENTS } from "../../graphql/queries/commentQueries";
import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from "../../graphql/mutations/commentMutations";
import { useAuth } from "../../context/useAuth";

const PREVIEW_COUNT = 2;

function CommentSection({ postId }) {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showAll, setShowAll] = useState(false);
  const client = useApolloClient();
  const { user } = useAuth();
  // Fetch all comments for this post
  const { data, loading, error } = useQuery(GET_COMMENTS, {
    variables: { postId: Number(postId) },
  });
  const [createComment, { loading: submitting }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      { query: GET_COMMENTS, variables: { postId: Number(postId) } },
    ],
  });
  const [updateComment, { loading: updating }] = useMutation(UPDATE_COMMENT, {
    refetchQueries: [
      { query: GET_COMMENTS, variables: { postId: Number(postId) } },
    ],
    awaitRefetchQueries: true,
  });
  const [deleteComment, { loading: deleting }] = useMutation(DELETE_COMMENT, {
    refetchQueries: [
      { query: GET_COMMENTS, variables: { postId: Number(postId) } },
    ],
    awaitRefetchQueries: true,
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!content.trim()) {
      setMessage("Comment cannot be empty.");
      return;
    }

    try {
      const { data: result } = await createComment({
        variables: {
          input: { postId: Number(postId), content: content.trim() },
        },
      });

      if (!result?.createComment?.success) {
        setMessage(result?.createComment?.message || "Could not add comment.");
        return;
      }

      setContent("");
      const cacheId = client.cache.identify({
        __typename: "PostType",
        id: String(postId),
      });
      if (cacheId) {
        client.cache.modify({
          id: cacheId,
          fields: { commentCount: (count = 0) => count + 1 },
        });
      }
    } catch {
      setMessage("Could not add comment. Please try again.");
    }
  }

  function startEditing(comment) {
    setMessage("");
    setEditingId(comment.id);
    setEditingContent(comment.content);
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!editingContent.trim()) {
      setMessage("Comment cannot be empty.");
      return;
    }

    try {
      const { data: result } = await updateComment({
        variables: {
          input: {
            commentId: Number(editingId),
            content: editingContent.trim(),
          },
        },
      });

      if (!result?.updateComment?.success) {
        setMessage(
          result?.updateComment?.message || "Could not update comment.",
        );
        return;
      }

      setEditingId(null);
      setEditingContent("");
    } catch {
      setMessage("Could not update comment. Please try again.");
    }
  }

  async function handleDelete(commentId) {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const { data: result } = await deleteComment({
        variables: { commentId: Number(commentId) },
      });

      if (!result?.deleteComment?.success) {
        setMessage(
          result?.deleteComment?.message || "Could not delete comment.",
        );
        return;
      }

      const cacheId = client.cache.identify({
        __typename: "PostType",
        id: String(postId),
      });
      if (cacheId) {
        client.cache.modify({
          id: cacheId,
          fields: { commentCount: (count = 0) => Math.max(0, count - 1) },
        });
      }
    } catch {
      setMessage("Could not delete comment. Please try again.");
    }
  }

  function renderComment(comment) {
    return (
      <div key={comment.id} className="rounded-lg bg-gray-50 px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-gray-800">
            {comment.author.username}
          </p>
          {String(user?.id) === String(comment.author.id) && (
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => startEditing(comment)}
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(comment.id)}
                disabled={deleting}
                className="font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        {editingId === comment.id ? (
          <form onSubmit={handleUpdate} className="mt-2 space-y-2">
            <input
              value={editingContent}
              maxLength={1000}
              onChange={(event) => setEditingContent(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              aria-label="Edit comment"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={updating}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-700">{comment.content}</p>
        )}
      </div>
    );
  }

  const allComments = data?.comments ?? [];
  const previewComments = allComments.slice(0, PREVIEW_COUNT);
  const remainingCount = allComments.length - previewComments.length;

  return (
    <section className="mt-4 border-t pt-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">Comments</h3>
      {loading && <p className="text-sm text-gray-500">Loading comments...</p>}
      {error && (
        <p className="text-sm text-red-600">Could not load comments.</p>
      )}
      {!loading && !error && !allComments.length && (
        <p className="mb-3 text-sm text-gray-500">No comments yet.</p>
      )}

      <div className="space-y-3">{previewComments.map(renderComment)}</div>

      {remainingCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          View all {allComments.length} comments
        </button>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={content}
          maxLength={1000}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a comment..."
          aria-label="Write a comment"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Comment"}
        </button>
      </form>
      {message && (
        <p className="mt-2 text-xs text-red-600" role="status">
          {message}
        </p>
      )}

      {showAll && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setShowAll(false)}
        >
          <div
            className="flex max-h-[80vh] w-full flex-col rounded-t-2xl bg-white sm:max-w-md sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-800">
                All comments ({allComments.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowAll(false)}
                aria-label="Close comments"
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto px-4 py-3">
              {allComments.map(renderComment)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CommentSection;
