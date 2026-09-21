import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { useQuery, useSubscription } from "@apollo/client/react";
import { useAuth } from "../../context/useAuth";
import { GET_CONVERSATIONS } from "../../graphql/queries/messageQueries";
import { GET_NOTIFICATIONS } from "../../graphql/queries/notificationQueries";
import { INBOX_UPDATED_SUBSCRIPTION } from "../../graphql/subscriptions/inboxSubscription";
import { NOTIFICATIONS_UPDATED_SUBSCRIPTION } from "../../graphql/subscriptions/notificationSubscription";
import ProfileSearch from "./ProfileSearch";
import ProfilePicture from "../common/ProfilePicture";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/messages", label: "Messages" },
  { to: "/notifications", label: "Notifications" },
  { to: "/profile", label: "Profile" },
];

function AppNav({ onNavigate, onOpenSuggestions }) {
  const { logout, user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const userName = user?.username || user?.email;

  const { data: conversationsData, refetch: refetchConversations } = useQuery(
    GET_CONVERSATIONS,
    { skip: !user?.id },
  );

  const { data: notificationsData, refetch: refetchNotifications } = useQuery(
    GET_NOTIFICATIONS,
    { skip: !user?.id },
  );

  useSubscription(INBOX_UPDATED_SUBSCRIPTION, {
    variables: { userId: user?.id },
    skip: !user?.id,
    onData: () => {
      refetchConversations();
    },
  });

  useSubscription(NOTIFICATIONS_UPDATED_SUBSCRIPTION, {
    variables: { userId: user?.id },
    skip: !user?.id,
    onData: () => {
      refetchNotifications();
    },
  });

  const hasUnreadMessages = (conversationsData?.conversations ?? []).some(
    (conversation) =>
      conversation.lastMessage &&
      !conversation.lastMessage.readAt &&
      String(conversation.lastMessage.sender.id) !== String(user?.id),
  );

  const hasUnreadNotifications = (notificationsData?.notifications ?? []).some(
    (notification) => !notification.readAt,
  );

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
                `relative block rounded-lg px-3 py-2 font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                }`
              }
            >
              {link.label}
              {link.to === "/messages" && hasUnreadMessages && (
                <span
                  className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500"
                  aria-label="Unread messages"
                />
              )}
              {link.to === "/notifications" && hasUnreadNotifications && (
                <span
                  className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500"
                  aria-label="Unread notifications"
                />
              )}
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
      {onOpenSuggestions && (
        <button
          type="button"
          onClick={onOpenSuggestions}
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
          Suggestions
        </button>
      )}

      <div className="mt-auto pt-6">
        <Link
          to="/edit-profile"
          onClick={onNavigate}
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-left font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          Settings
        </Link>
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
          <div className="mt-3 flex items-center gap-2 px-1">
            <ProfilePicture
              src={user?.profilePictureUrl}
              alt={userName}
              size="sm"
            />
            <p className="truncate text-sm text-slate-500">{userName}</p>
          </div>
        )}
      </div>

      {showSearch && <ProfileSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export default AppNav;
