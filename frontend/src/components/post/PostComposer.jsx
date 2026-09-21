// Post creation form component
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_POST } from "../../graphql/mutations/postMutations";
import { GET_POSTS } from "../../graphql/queries/postQueries";
import ImageUploadButton from "../common/ImageUploadButton";

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

      <div className="mt-3 flex items-center gap-2">
        <input
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="Image URL (optional)"
          type="url"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

      {imageUrl && (
        <div className="relative mt-3 inline-block">
          <img
            src={imageUrl}
            alt="Selected"
            className="max-h-48 rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => setImageUrl("")}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm hover:bg-slate-700"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

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
