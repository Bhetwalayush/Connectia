import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ProfileSearch from "./ProfileSearch";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/messages", label: "Messages" },
  { to: "/notifications", label: "Notifications" },
  { to: "/profile", label: "Profile" },
];

function AppNav({ onNavigate }) {
  const { logout, user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const userName = user?.username || user?.email;

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }
    setLoggingOut(true);
    setError("");

    try {
      await logout();
    } catch {
      setLoggingOut(false);
      setError("Unable to log out. Please try again.");
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setShowSearch(true)}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-left font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
      >
        <svg
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
          />
        </svg>
        Search
      </button>

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
        {userName && (
          <p className="mt-3 truncate px-1 text-sm text-slate-500">
            {userName}
          </p>
        )}
      </div>

      {showSearch && <ProfileSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export default AppNav;
