import { colorForName } from "../../utils/avatarColor";

function UserAvatar({ username, size = "md" }) {
  const name = username || "?";
  const { bg } = colorForName(name);

  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-12 w-12 text-base"
        : "h-10 w-10 text-sm";

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${bg} ${sizeClass}`}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export default UserAvatar;
