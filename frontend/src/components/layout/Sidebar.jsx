import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Sidebar() {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await logout();
    } catch {
      setLoggingOut(false);
      setError("Unable to log out. Please try again.");
    }
  }

  //user name in sidebar
  const { user } = useAuth();
  const userName = user?.username || user?.email;

  return (
    <aside
      className="
      hidden
      md:block
      w-64
      bg-white
      h-full
      flex-none
      overflow-hidden
      p-5
      border-r
      flex
      flex-col
    "
    >
      <ul className="space-y-4">
        <li>
          <NavLink to="/" end className="hover:text-blue-600">
            Home
          </NavLink>
        </li>

        <li>Explore</li>

        <li>Messages</li>

        <li>Notifications</li>

        <li>
          <NavLink to="/profile" className="hover:text-blue-600">
            Profile
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto pt-6">
        {error && (
          <p className="mb-2 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-left font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
        <li>{userName}</li>
      </div>
    </aside>
  );
}

export default Sidebar;
