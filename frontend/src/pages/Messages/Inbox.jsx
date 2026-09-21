// Inbox page - lists all conversations, most recent activity first
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GET_CONVERSATIONS } from "../../graphql/queries/messageQueries";
import { useAuth } from "../../context/useAuth";
import MessageSearch from "../../components/message/MessageSearch";
// import UserAvatar from "../../components/common/UserAvatar";
import ProfilePicture from "../../components/common/ProfilePicture";

// Accent used for unread state — dot, tint wash, and timestamp.
// One color, used consistently, rather than default Tailwind blue-600.
const ACCENT = "#3A6FF0";
const ACCENT_TINT = "rgba(58, 111, 240, 0.06)"; // faint wash for unread rows

// Small local helper — only renders if the query actually returns a
// timestamp. Safe no-op if GET_CONVERSATIONS doesn't select createdAt yet.
function formatTime(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  const diffDays = Math.floor((now - date) / 86400000);
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function Inbox() {
  const { user } = useAuth();

  const { data, loading, error } = useQuery(GET_CONVERSATIONS);

  const [showSearch, setShowSearch] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="mb-5 h-8 w-32 animate-pulse rounded bg-slate-100" />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-48 animate-pulse rounded bg-slate-50" />
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-40 animate-pulse rounded bg-slate-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <p className="mx-auto max-w-2xl px-4 py-6 text-sm text-red-600">
          Could not load conversations.
        </p>
      </div>
    );
  }

  const conversations = data?.conversations ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Messages
          </h1>

          <button
            type="button"
            onClick={() => setShowSearch(true)}
            aria-label="Search messages"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
          >
            <svg
              className="h-5 w-5"
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
          </button>
        </div>

        {/* ONE messages container — kept as one list, given a real border
            (not just a shadow) so it holds its shape on a white page */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {!conversations.length && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-7 w-7 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
                  />
                </svg>
              </div>

              <h2 className="font-semibold text-slate-900">No messages yet</h2>

              <p className="mt-1 text-sm text-slate-500">
                Visit a profile and hit "Message" to start a conversation.
              </p>
            </div>
          )}

          {/* Conversation list */}
          {conversations.map((conversation, index) => {
            const isUnread =
              conversation.lastMessage &&
              !conversation.lastMessage.readAt &&
              String(conversation.lastMessage.sender.id) !== String(user?.id);

            const time = formatTime(conversation.lastMessage?.createdAt);

            return (
              <Link
                key={conversation.id}
                to={`/messages/${conversation.id}`}
                className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50"
                style={isUnread ? { backgroundColor: ACCENT_TINT } : undefined}
              >
                {/* Avatar */}
                {/* <UserAvatar
                  username={conversation.otherUser.username}
                  size="lg"
                /> */}
                <ProfilePicture
                  src={conversation.otherUser.profilePictureUrl}
                  alt={conversation.otherUser.username}
                  size="lg"
                />

                {/* Conversation information — divider sits under this
                    column only, inset past the avatar (iMessage-style),
                    so it reads as a list boundary rather than a stray line
                    across the whole row */}
                <div
                  className={`min-w-0 flex-1 ${
                    index !== conversations.length - 1
                      ? "border-b border-slate-150 pb-3.5 -mb-3.5"
                      : ""
                  }`}
                  style={
                    index !== conversations.length - 1
                      ? { borderColor: "#EAEBEF" }
                      : undefined
                  }
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={`truncate text-[15px] ${
                        isUnread
                          ? "font-bold text-slate-950"
                          : "font-semibold text-slate-800"
                      }`}
                    >
                      {conversation.otherUser.username}
                    </p>

                    {time && (
                      <span
                        className="shrink-0 text-xs"
                        style={{
                          color: isUnread ? ACCENT : "#94969C",
                          fontWeight: isUnread ? 600 : 400,
                        }}
                      >
                        {time}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-0.5 truncate text-sm ${
                      isUnread ? "font-medium text-slate-700" : "text-slate-500"
                    }`}
                  >
                    {conversation.lastMessage
                      ? conversation.lastMessage.content
                      : "No messages yet"}
                  </p>
                </div>

                {/* Unread indicator */}
                {isUnread && (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-label="Unread"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {showSearch && <MessageSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export default Inbox;
