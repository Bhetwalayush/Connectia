// Chat page - message history for one conversation, with live updates
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient,
} from "@apollo/client/react";
import { GET_MESSAGES } from "../../graphql/queries/messageQueries";
import {
  SEND_MESSAGE,
  MARK_MESSAGES_READ,
} from "../../graphql/mutations/messageMutations";
import { MESSAGE_UPDATED_SUBSCRIPTION } from "../../graphql/subscriptions/messageSubscription";
import { GET_PROFILE } from "../../graphql/queries/userQueries";
import { useQuery as useProfileQuery } from "@apollo/client/react";
import { useAuth } from "../../context/useAuth";

const PAGE_SIZE = 20;

function Chat() {
  const { conversationId: conversationIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get("userId");
  const navigate = useNavigate();
  const { user } = useAuth();
  const client = useApolloClient();

  const conversationId = conversationIdParam
    ? Number(conversationIdParam)
    : null;

  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  // If we arrived via ?userId= with no conversation yet, load that user's
  // basic info so we can show a header before any message has been sent.
  const { data: recipientData } = useProfileQuery(GET_PROFILE, {
    variables: { userId: Number(recipientId) },
    skip: !recipientId || conversationId != null,
  });

  const { data, loading, error, fetchMore } = useQuery(GET_MESSAGES, {
    variables: { conversationId, limit: PAGE_SIZE },
    skip: !conversationId,
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE);
  const [markMessagesRead] = useMutation(MARK_MESSAGES_READ);

  useSubscription(MESSAGE_UPDATED_SUBSCRIPTION, {
    variables: { conversationId },
    skip: !conversationId,
    onData: ({ data: subscriptionData }) => {
      const event = subscriptionData?.data?.messageUpdated;
      if (!event) return;

      if (event.action === "SENT" && event.message) {
        client.cache.updateQuery(
          {
            query: GET_MESSAGES,
            variables: { conversationId, limit: PAGE_SIZE },
          },
          (existing) => {
            if (!existing) return existing;
            // Avoid duplicating a message we just sent ourselves
            const alreadyPresent = existing.messages.items.some(
              (item) => item.id === event.message.id,
            );
            if (alreadyPresent) return existing;
            return {
              messages: {
                ...existing.messages,
                items: [...existing.messages.items, event.message],
              },
            };
          },
        );
      }

      if (event.action === "READ" && event.readMessageIds?.length) {
        client.cache.updateQuery(
          {
            query: GET_MESSAGES,
            variables: { conversationId, limit: PAGE_SIZE },
          },
          (existing) => {
            if (!existing) return existing;
            return {
              messages: {
                ...existing.messages,
                items: existing.messages.items.map((item) =>
                  event.readMessageIds.includes(item.id)
                    ? { ...item, readAt: new Date().toISOString() }
                    : item,
                ),
              },
            };
          },
        );
      }
    },
  });

  const messages = data?.messages?.items ?? [];
  const hasMore = data?.messages?.hasMore;
  const nextCursor = data?.messages?.nextCursor;

  // Mark unread messages as read once the conversation is loaded/opened
  useEffect(() => {
    if (conversationId) {
      markMessagesRead({ variables: { input: { conversationId } } }).catch(
        () => {
          // non-critical; ignore silently
        },
      );
    }
  }, [conversationId, markMessagesRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function loadOlder() {
    if (!hasMore) return;
    fetchMore({
      variables: { conversationId, cursor: nextCursor, limit: PAGE_SIZE },
      updateQuery: (previous, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previous;
        return {
          messages: {
            ...fetchMoreResult.messages,
            items: [
              ...fetchMoreResult.messages.items,
              ...previous.messages.items,
            ],
          },
        };
      },
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!content.trim()) return;

    const targetRecipientId = conversationId
      ? otherUser?.id
      : Number(recipientId);

    if (!targetRecipientId) {
      setMessage("Could not determine recipient.");
      return;
    }

    try {
      const { data: result } = await sendMessage({
        variables: {
          input: {
            recipientId: targetRecipientId,
            content: content.trim(),
          },
        },
      });

      if (!result?.sendMessage?.success) {
        setMessage(result?.sendMessage?.message || "Could not send message.");
        return;
      }

      setContent("");

      // First message in a brand-new conversation: now that it exists,
      // move to its real URL so refresh/back-navigation and the
      // subscription (keyed by conversationId) work correctly.
      if (!conversationId) {
        navigate(`/messages/${result.sendMessage.conversation.id}`, {
          replace: true,
        });
        return;
      }

      client.cache.updateQuery(
        {
          query: GET_MESSAGES,
          variables: { conversationId, limit: PAGE_SIZE },
        },
        (existing) => {
          if (!existing) return existing;
          const alreadyPresent = existing.messages.items.some(
            (item) => item.id === result.sendMessage.chatMessage.id,
          );
          if (alreadyPresent) return existing;
          return {
            messages: {
              ...existing.messages,
              items: [
                ...existing.messages.items,
                result.sendMessage.chatMessage,
              ],
            },
          };
        },
      );
    } catch {
      setMessage("Could not send message. Please try again.");
    }
  }

  const otherUser = conversationId
    ? messages.find((message) => String(message.sender.id) !== String(user?.id))
        ?.sender
    : recipientData?.user;

  if (conversationId && loading) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="h-64 animate-pulse rounded-xl border bg-white" />
      </div>
    );
  }

  if (conversationId && error) {
    return (
      <p className="mx-auto max-w-2xl p-4 text-sm text-red-600">
        Could not load this conversation.
      </p>
    );
  }

  return (
    // Header with back button and recipient's username
    // clciking on the recipient's username should navigate to their profile page
    <div className="mx-auto flex h-[80vh] max-w-2xl flex-col p-4">
      <div className="flex items-center gap-3 border-b pb-3">
        <button
          type="button"
          onClick={() => navigate("/messages")}
          aria-label="Back to messages"
          className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => navigate(`/profile/${otherUser?.id}`)}
          className="text-lg font-bold text-slate-900 hover:text-blue-600"
        >
          {otherUser?.username || "New message"}
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto py-3">
        {hasMore && (
          <button
            type="button"
            onClick={loadOlder}
            className="mx-auto block text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Load earlier messages
          </button>
        )}

        {!messages.length && (
          <p className="text-center text-sm text-slate-500">
            No messages yet. Say hello!
          </p>
        )}

        {messages.map((item) => {
          const isMine = String(item.sender.id) === String(user?.id);
          return (
            <div
              key={item.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-slate-900"
                }`}
              >
                <p>{item.content}</p>
                {isMine && (
                  <p className="mt-1 text-right text-[10px] opacity-70">
                    {item.readAt ? "Read" : "Sent"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-3">
        <input
          value={content}
          maxLength={2000}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a message..."
          aria-label="Write a message"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
      {message && (
        <p className="mt-2 text-xs text-red-600" role="status">
          {message}
        </p>
      )}
    </div>
  );
}

export default Chat;
