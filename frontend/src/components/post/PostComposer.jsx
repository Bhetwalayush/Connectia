import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_POST } from "../../graphql/mutations/postMutations";
import { GET_POSTS } from "../../graphql/queries/postQueries";

function PostComposer() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [GET_POSTS],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!content.trim()) {
      setMessage("Write something before publishing.");
      return;
    }

    try {
      const { data } = await createPost({
        variables: {
          input: {
            content: content.trim(),
            imageUrl: imageUrl.trim() || null,
          },
        },
      });

      if (!data?.createPost?.success) {
        setMessage(data?.createPost?.message || "Could not publish the post.");
        return;
      }

      setContent("");
      setImageUrl("");
      setMessage("Post published.");
    } catch {
      setMessage("Could not publish the post. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Create a post</h1>
        <span className="text-xs text-gray-500">{content.length}/2000</span>
      </div>
      <textarea
        value={content}
        maxLength={2000}
        onChange={(event) => setContent(event.target.value)}
        placeholder="What is happening in your world?"
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <input
        value={imageUrl}
        onChange={(event) => setImageUrl(event.target.value)}
        placeholder="Image URL (optional)"
        type="url"
        className="mt-3 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500" role="status">
          {message}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish post"}
        </button>
      </div>
    </form>
  );
}

export default PostComposer;
