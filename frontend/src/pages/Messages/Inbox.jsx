// Inbox page - lists all conversations, most recent activity first
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_CONVERSATIONS } from "../../graphql/queries/messageQueries";
import { useAuth } from "../../context/useAuth";

function Inbox() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_CONVERSATIONS);

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
      <h1 className="mb-4 text-xl font-bold text-slate-900">Messages</h1>

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
    </div>
  );
}

export default Inbox;
