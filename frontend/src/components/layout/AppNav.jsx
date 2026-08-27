import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

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
          <p className="mt-3 truncate px-1 text-sm text-slate-500">{userName}</p>
        )}
      </div>
    </div>
  );
}

export default AppNav;
