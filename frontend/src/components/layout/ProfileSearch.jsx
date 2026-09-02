// Modal search for finding a user by username, navigates to their profile
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "../../graphql/queries/userQueries";

function ProfileSearch({ onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const [searchUsers, { data, loading }] = useLazyQuery(SEARCH_USERS);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers({ variables: { query: query.trim() } });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, searchUsers]);

  function handleChange(event) {
    setQuery(event.target.value);
  }

  function handleSelect(user) {
    onClose();
    navigate(`/profile/${user.id}`);
  }

  const results = data?.searchUsers ?? [];
  const trimmedQuery = query.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 pt-20 backdrop-blur-sm sm:items-center sm:pt-0"
      onClick={onClose}
    >
      <div
        className="flex max-h-[70vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <svg
            className="h-5 w-5 shrink-0 text-slate-400"
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
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Search people by username"
            aria-label="Search users"
            className="min-w-0 flex-1 border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {!trimmedQuery && (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m5-5.13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 0a4 4 0 1 0 0-8"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-500">
                Find people by their username
              </p>
            </div>
          )}

          {trimmedQuery && loading && (
            <div className="space-y-1 p-1">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {trimmedQuery && !loading && !results.length && (
            <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-600">No one found</p>
              <p className="text-xs text-slate-400">Try a different username</p>
            </div>
          )}

          <div className="space-y-0.5">
            {results.map((user) => {
              const initial = user.username.charAt(0).toUpperCase();
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.username}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSearch;
