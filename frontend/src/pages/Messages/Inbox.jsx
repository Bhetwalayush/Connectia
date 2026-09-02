// Inbox page - lists all conversations, most recent activity first
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_CONVERSATIONS } from "../../graphql/queries/messageQueries";
import { useAuth } from "../../context/useAuth";
import MessageSearch from "../../components/message/MessageSearch";

function Inbox() {
  const { user } = useAuth();
  // const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CONVERSATIONS);
  const [showSearch, setShowSearch] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-3 p-4">
        <div className="h-16 animate-pulse rounded-xl border bg-white" />
        <div className="h-16 animate-pulse rounded-xl border bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="mx-auto max-w-2xl p-4 text-sm text-red-600">
        Could not load conversations.
      </p>
    );
  }

  const conversations = data?.conversations ?? [];

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
          >
            ←
          </button> */}
          <h1 className="text-xl font-bold text-slate-900">Messages</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          aria-label="Search messages"
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
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
        </button>
      </div>

      {!conversations.length && (
        <p className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
          No conversations yet. Visit a profile and hit "Message" to start one.
        </p>
      )}

      <div className="space-y-2">
        {conversations.map((conversation) => {
          const isUnread =
            conversation.lastMessage &&
            !conversation.lastMessage.readAt &&
            String(conversation.lastMessage.sender.id) !== String(user?.id);

          return (
            <Link
              key={conversation.id}
              to={`/messages/${conversation.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border bg-white p-4 transition hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {conversation.otherUser.username}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {conversation.lastMessage
                    ? conversation.lastMessage.content
                    : "No messages yet"}
                </p>
              </div>
              {isUnread && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600"
                  aria-label="Unread"
                />
              )}
            </Link>
          );
        })}
      </div>

      {showSearch && <MessageSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export default Inbox;
