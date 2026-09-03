// Notifications page - likes, comments, and follows, grouped by day
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_NOTIFICATIONS } from "../../graphql/queries/notificationQueries";
import { MARK_NOTIFICATIONS_READ } from "../../graphql/mutations/notificationMutations";

function messageFor(notification) {
  switch (notification.type) {
    case "LIKE":
      return "liked your post";
    case "COMMENT":
      return "commented on your post";
    case "FOLLOW":
      return "started following you";
    default:
      return "did something";
  }
}

function linkFor(notification) {
  if (notification.type === "FOLLOW") {
    return `/profile/${notification.actor.id}`;
  }
  if (notification.postId) {
    return `/post/${notification.postId}`;
  }
  return "/";
}

function formatDateHeader(date) {
  const today = new Date();
  const isThisYear = date.getFullYear() === today.getFullYear();

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    ...(isThisYear ? {} : { year: "numeric" }),
  });
}

function formatTime(date) {
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/^0/, "");
}

// Groups notifications into { dateLabel, items }[] buckets, most recent day first
function groupByDay(notifications) {
  const groups = [];
  const groupsByKey = new Map();

  for (const notification of notifications) {
    const date = new Date(notification.createdAt);
    const key = date.toDateString();

    if (!groupsByKey.has(key)) {
      const group = { dateLabel: formatDateHeader(date), items: [] };
      groupsByKey.set(key, group);
      groups.push(group);
    }

    groupsByKey.get(key).items.push(notification);
  }

  return groups;
}

function Notifications() {
  const { data, loading, error } = useQuery(GET_NOTIFICATIONS);
  const [markNotificationsRead] = useMutation(MARK_NOTIFICATIONS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    markNotificationsRead().catch(() => {
      // non-critical; ignore silently
    });
  }, [markNotificationsRead]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-3 p-4">
        <div className="h-14 animate-pulse rounded-xl border bg-white" />
        <div className="h-14 animate-pulse rounded-xl border bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="mx-auto max-w-2xl p-4 text-sm text-red-600">
        Could not load notifications.
      </p>
    );
  }

  const notifications = data?.notifications ?? [];
  const groups = groupByDay(notifications);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-xl font-bold text-slate-900">Notifications</h1>

      {!notifications.length && (
        <p className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
          No notifications yet.
        </p>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.dateLabel}>
            <h2 className="mb-2 px-1 text-sm font-semibold text-slate-500">
              {group.dateLabel}
            </h2>
            <div className="space-y-2">
              {group.items.map((notification) => (
                <Link
                  key={notification.id}
                  to={linkFor(notification)}
                  className="flex items-center gap-3 rounded-xl border bg-white p-4 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {notification.actor.username.charAt(0).toUpperCase()}
                  </div>
                  <p className="min-w-0 flex-1 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {notification.actor.username}
                    </span>{" "}
                    {messageFor(notification)}
                  </p>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatTime(new Date(notification.createdAt))}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
