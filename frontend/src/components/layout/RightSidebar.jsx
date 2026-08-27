import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import FollowButton from "../profile/FollowButton";
import { useAuth } from "../../context/useAuth";
import { GET_MUTUAL_SUGGESTIONS } from "../../graphql/queries/suggestionQueries";

function suggestionCopy(followsYou, mutualCount) {
  const lines = [];

  if (followsYou) {
    lines.push("Follows you");
  } else if (mutualCount <= 0) {
    lines.push("Suggested for you");
  }

  if (mutualCount === 1) {
    lines.push("1 mutual connection");
  } else if (mutualCount > 1) {
    lines.push(`${mutualCount} mutual connections`);
  }

  return lines;
}

function RightSidebar() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_MUTUAL_SUGGESTIONS, {
    variables: { limit: 5 },
    skip: !user,
    fetchPolicy: "cache-and-network",
  });

  const suggestions = data?.suggestedUsers ?? [];

  return (
    <aside className="hidden h-full w-72 flex-none overflow-y-auto border-l bg-white p-5 xl:block">
      <h2 className="text-lg font-bold text-slate-900">Suggestions</h2>
      <p className="mt-1 text-xs text-slate-500">
        People with mutual connections
      </p>

      {loading && !suggestions.length && (
        <ul className="mt-4 space-y-3" aria-busy="true">
          {[1, 2, 3].map((item) => (
            <li
              key={item}
              className="h-16 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Could not load suggestions.
        </p>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          No suggestions yet. Follow people to see mutual connections.
        </p>
      )}

      {suggestions.length > 0 && (
        <ul className="mt-4 space-y-3">
          {suggestions.map((suggested) => {
            const initial = suggested.username.charAt(0).toUpperCase();

            return (
              <li
                key={suggested.id}
                className="rounded-xl border border-slate-100 p-3"
              >
                <div className="flex items-start gap-3">
                  <Link
                    to={`/profile/${suggested.id}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
                  >
                    {initial}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/profile/${suggested.id}`}
                      className="block truncate font-semibold text-slate-900 hover:text-blue-600"
                    >
                      {suggested.username}
                    </Link>
                    {suggestionCopy(
                      suggested.followsYou,
                      suggested.mutualCount,
                    ).map((line) => (
                      <p key={line} className="mt-0.5 text-xs text-slate-500">
                        {line}
                      </p>
                    ))}
                    <div className="mt-2">
                      <FollowButton
                        userId={Number(suggested.id)}
                        isFollowing={false}
                        followsYou={Boolean(suggested.followsYou)}
                        compact
                        onToggled={() => refetch()}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

export default RightSidebar;
