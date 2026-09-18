// Public global chat room - join screen + live chat with colored bubbles
import { useEffect, useRef, useState } from "react";
import {
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient,
} from "@apollo/client/react";
import { useAuth } from "../../context/useAuth";
import { GET_GLOBAL_MESSAGES } from "../../graphql/queries/globalChatQueries";
import { SEND_GLOBAL_MESSAGE } from "../../graphql/mutations/globalChatMutations";
import { GLOBAL_CHAT_UPDATED_SUBSCRIPTION } from "../../graphql/subscriptions/globalChatSubscription";
import { colorForName } from "../../utils/avatarColor";
import GlobalChatJoin from "./GlobalChatJoin";

const PAGE_SIZE = 50;

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function GlobalChatRoom() {
  const { user } = useAuth();
  const client = useApolloClient();
  const storageKey = `global-chat-name-${user?.id}`;

  const [displayName, setDisplayName] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(storageKey) : null,
  );
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  const { data, loading, fetchMore } = useQuery(GET_GLOBAL_MESSAGES, {
    variables: { limit: PAGE_SIZE },
    skip: !displayName,
  });

  const [sendGlobalMessage, { loading: sending }] =
    useMutation(SEND_GLOBAL_MESSAGE);

  useSubscription(GLOBAL_CHAT_UPDATED_SUBSCRIPTION, {
    skip: !displayName,
    onData: ({ data: subscriptionData }) => {
      const incoming = subscriptionData?.data?.globalChatUpdated;
      if (!incoming) return;

      client.cache.updateQuery(
        { query: GET_GLOBAL_MESSAGES, variables: { limit: PAGE_SIZE } },
        (existing) => {
          if (!existing) return existing;
          const alreadyPresent = existing.globalMessages.items.some(
            (item) => item.id === incoming.id,
          );
          if (alreadyPresent) return existing;
          return {
            globalMessages: {
              ...existing.globalMessages,
              items: [...existing.globalMessages.items, incoming],
            },
          };
        },
      );
    },
  });

  const messages = data?.globalMessages?.items ?? [];
  const hasMore = data?.globalMessages?.hasMore;
  const nextCursor = data?.globalMessages?.nextCursor;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function handleJoin(name) {
    localStorage.setItem(storageKey, name);
    setDisplayName(name);
  }

  function handleLeave() {
    localStorage.removeItem(storageKey);
    setDisplayName(null);
  }

  function loadOlder() {
    if (!hasMore) return;
    const container = containerRef.current;
    const previousHeight = container?.scrollHeight ?? 0;

    fetchMore({
      variables: { cursor: nextCursor, limit: PAGE_SIZE },
      updateQuery: (previous, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previous;
        return {
          globalMessages: {
            ...fetchMoreResult.globalMessages,
            items: [
              ...fetchMoreResult.globalMessages.items,
              ...previous.globalMessages.items,
            ],
          },
        };
      },
    }).then(() => {
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - previousHeight;
        }
      });
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!content.trim()) return;

    try {
      const { data: result } = await sendGlobalMessage({
        variables: {
          input: {
            displayName,
            content: content.trim(),
          },
        },
      });

      if (!result?.sendGlobalMessage?.success) {
        setError(
          result?.sendGlobalMessage?.message || "Could not send message.",
        );
        return;
      }

      setContent("");
    } catch {
      setError("Could not send message. Please try again.");
    }
  }

  if (!displayName) {
    return <GlobalChatJoin realUsername={user?.username} onJoin={handleJoin} />;
  }

  return (
    <div className="mx-auto flex h-[80vh] max-w-2xl flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-indigo-600 to-purple-500 px-5 py-4">
        <div>
          <h1 className="text-base font-bold text-white">Global Chat Room</h1>
          <p className="text-xs text-indigo-100">
            Chatting as{" "}
            <span className="font-semibold text-white">{displayName}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleLeave}
          className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
        >
          Change identity
        </button>
      </div>

      {/* Public notice strip */}
      <div className="flex items-center gap-2 border-b bg-amber-50 px-5 py-2">
        <svg
          className="h-4 w-4 shrink-0 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <p className="text-xs text-amber-800">
          This room is public — anyone can read every message here.
        </p>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4"
      >
        {loading && !messages.length && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-12 w-2/3 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {hasMore && (
          <button
            type="button"
            onClick={loadOlder}
            className="mx-auto block text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Load earlier messages
          </button>
        )}

        {!loading && !messages.length && (
          <p className="pt-10 text-center text-sm text-slate-400">
            No messages yet. Be the first to say something!
          </p>
        )}

        {messages.map((item) => {
          const isMine =
            String(item.senderId) === String(user?.id) &&
            item.displayName === displayName;
          const color = colorForName(item.displayName);
          const initial = item.displayName.charAt(0).toUpperCase();

          return (
            <div
              key={item.id}
              className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color.bg}`}
              >
                {initial}
              </div>
              <div
                className={`flex max-w-[75%] flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                {!isMine && (
                  <span className="mb-0.5 px-1 text-xs font-semibold text-slate-500">
                    {item.displayName}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMine
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : `rounded-bl-md text-white ${color.bg}`
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {item.content}
                  </p>
                </div>
                <span className="mt-0.5 px-1 text-[10px] text-slate-400">
                  {formatTime(new Date(item.createdAt))}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t bg-white p-3"
      >
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={1000}
          placeholder="Say something to the room..."
          aria-label="Write a message"
          className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200"
          aria-label="Send"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.289Z" />
          </svg>
        </button>
      </form>
      {error && (
        <p
          className="border-t bg-white px-4 pb-2 text-xs text-red-600"
          role="status"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default GlobalChatRoom;
