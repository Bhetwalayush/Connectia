// Displays a user's uploaded picture, falling back to a default silhouette
function ProfilePicture({ src, size = "md", alt = "" }) {
  const sizeClass =
    size === "sm"
      ? "h-8 w-8"
      : size === "lg"
        ? "h-12 w-12"
        : size === "xl"
          ? "h-20 w-20"
          : "h-10 w-10";

  return (
    <img
      src={src || "/selectionprofile.png"}
      alt={alt}
      className={`shrink-0 rounded-full border border-slate-100 object-cover ${sizeClass}`}
    />
  );
}

export default ProfilePicture;
