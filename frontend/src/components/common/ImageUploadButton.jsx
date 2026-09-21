// Reusable upload trigger - opens file picker, uploads to backend, returns URL
import { useRef, useState } from "react";

const UPLOAD_ENDPOINT = `${import.meta.env.VITE_GRAPHQL_HTTP_URL.replace("/graphql", "")}/upload/image`;

function ImageUploadButton({ onUploaded, children, className }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploaded(data.url);
    } catch {
      setError("Could not upload image. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={className}
      >
        {uploading ? "Uploading..." : children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}

export default ImageUploadButton;
