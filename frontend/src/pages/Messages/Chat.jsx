// Chat page - message history for one conversation, with live updates
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient,
} from "@apollo/client/react";
import {
  GET_MESSAGES,
  GET_CONVERSATION_WITH_USER,
  GET_CONVERSATION,
} from "../../graphql/queries/messageQueries";
import {
  SEND_MESSAGE,
  MARK_MESSAGES_READ,
} from "../../graphql/mutations/messageMutations";
import { MESSAGE_UPDATED_SUBSCRIPTION } from "../../graphql/subscriptions/messageSubscription";
import { GET_PROFILE } from "../../graphql/queries/userQueries";
import { useQuery as useProfileQuery } from "@apollo/client/react";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from "react-icons/hi";
import { useAuth } from "../../context/useAuth";
// import { colorForName } from "../../utils/avatarColor";
import ProfilePicture from "../../components/common/ProfilePicture";

const PAGE_SIZE = 20;

function formatMessageTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// function UserAvatar({ username, size = "md" }) {
//   const name = username || "?";
//   const { bg } = colorForName(name);
//   const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

//   return (
//     <span
//       className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${bg} ${sizeClass}`}
//       aria-hidden="true"
//     >
//       {name.charAt(0).toUpperCase()}
//     </span>
//   );
// }

function ChatHeader({ otherUser, onBack, onOpenProfile }) {
  return (
    <header className="flex shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-2 py-2 sm:gap-2 sm:px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to messages"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 active:bg-slate-200"
      >
        <HiOutlineArrowLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={onOpenProfile}
        disabled={!otherUser?.id}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-left transition hover:bg-slate-50 disabled:hover:bg-transparent sm:px-2"
      >
        {/* <UserAvatar username={otherUser?.username} /> */}
        <ProfilePicture
          src={otherUser?.profilePictureUrl}
          alt={otherUser?.username}
        />
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold text-slate-900 sm:text-lg">
            {otherUser?.username || "New message"}
          </span>
          <span className="block text-xs text-slate-500">
            {otherUser?.id ? "View profile" : "Start the conversation"}
          </span>
        </span>
      </button>
    </header>
  );
}

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

  const { data: existingConversationData, loading: checkingExisting } =
    useQuery(GET_CONVERSATION_WITH_USER, {
      variables: { otherUserId: Number(recipientId) },
      skip: !recipientId || conversationId != null,
    });

  const { data: conversationData } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
    skip: !conversationId,
  });

  useEffect(() => {
    const existingId = existingConversationData?.conversationWithUser?.id;
    if (existingId) {
      navigate(`/messages/${existingId}`, { replace: true });
    }
  }, [existingConversationData, navigate]);

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

      // If the incoming message is from the other person and I'm actively
      // viewing this conversation, mark it read immediately instead of
      // waiting for a future mount/re-visit.
      if (String(event.actorId) !== String(user?.id)) {
        markMessagesRead({ variables: { input: { conversationId } } }).catch(
          () => {
            // non-critical; ignore silently
          },
        );
      }
    } catch {
      setMessage("Could not send message. Please try again.");
    }
  }

  // const otherUser = conversationId
  //   ? messages.find((message) => String(message.sender.id) !== String(user?.id))
  //       ?.sender
  //   : recipientData?.user;
  const otherUser = conversationId
    ? conversationData?.conversation?.otherUser
    : recipientData?.user;

  if (conversationId && loading) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-slate-50">
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col bg-white md:border-x md:border-slate-200">
          <ChatHeader
            otherUser={null}
            onBack={() => navigate("/messages")}
            onOpenProfile={() => {}}
          />
          <div className="flex-1 space-y-3 p-4">
            <div className="ml-auto h-10 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-slate-100" />
            <div className="ml-auto h-10 w-1/3 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }
  if (!conversationId && recipientId && checkingExisting) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-slate-50">
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col bg-white md:border-x md:border-slate-200">
          <ChatHeader
            otherUser={recipientData?.user}
            onBack={() => navigate("/messages")}
            onOpenProfile={() => {
              if (recipientData?.user?.id) {
                navigate(`/profile/${recipientData.user.id}`);
              }
            }}
          />
          <div className="flex-1 space-y-3 p-4">
            <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-slate-100" />
            <div className="ml-auto h-10 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (conversationId && error) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-slate-50">
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col bg-white md:border-x md:border-slate-200">
          <ChatHeader
            otherUser={null}
            onBack={() => navigate("/messages")}
            onOpenProfile={() => {}}
          />
          <p className="p-6 text-sm text-red-600">
            Could not load this conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col bg-white md:border-x md:border-slate-200">
        <ChatHeader
          otherUser={otherUser}
          onBack={() => navigate("/messages")}
          onOpenProfile={() => {
            if (otherUser?.id) navigate(`/profile/${otherUser.id}`);
          }}
        />

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-6">
          {hasMore && (
            <button
              type="button"
              onClick={loadOlder}
              className="mx-auto block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm hover:bg-slate-50"
            >
              Load earlier messages
            </button>
          )}

          {!messages.length && (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              {/* <UserAvatar username={otherUser?.username} /> */}
              <ProfilePicture
                src={otherUser?.profilePictureUrl}
                alt={otherUser?.username}
              />
              <p className="mt-3 font-semibold text-slate-900">
                {otherUser?.username
                  ? `Message ${otherUser.username}`
                  : "New message"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                No messages yet. Say hello!
              </p>
            </div>
          )}

          {messages.map((item) => {
            const isMine = String(item.sender.id) === String(user?.id);
            return (
              <div
                key={item.id}
                className={`flex items-end gap-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {/* {!isMine && (
                  <UserAvatar username={item.sender.username} size="sm" />
                )} */}
                {!isMine && (
                  <ProfilePicture
                    src={item.sender.profilePictureUrl}
                    alt={item.sender.username}
                    size="sm"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed sm:max-w-xs ${
                    isMine
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {item.content}
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? "text-right text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {formatMessageTime(item.createdAt)}
                    {isMine && (item.readAt ? " · Read" : " · Sent")}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex shrink-0 items-end gap-2 border-t border-slate-200 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4"
        >
          <input
            value={content}
            maxLength={2000}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a message..."
            aria-label="Write a message"
            className="min-h-11 min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            aria-label={sending ? "Sending" : "Send message"}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HiOutlinePaperAirplane className="h-5 w-5 translate-x-px -rotate-45" />
          </button>
        </form>
        {message && (
          <p className="px-4 pb-3 text-xs text-red-600" role="status">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Chat;
