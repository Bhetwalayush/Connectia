// Modal search for starting/finding a conversation by username
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "../../graphql/queries/userQueries";

function MessageSearch({ onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const [searchUsers, { data, loading }] = useLazyQuery(SEARCH_USERS);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers({ variables: { query: query.trim() } });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, searchUsers]);

  function handleSelect(user) {
    onClose();
    navigate(`/messages/new?userId=${user.id}`);
  }

  const results = data?.searchUsers ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-16 sm:items-center sm:pt-0"
      onClick={onClose}
    >
      <div
        className="flex max-h-[70vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b p-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by username..."
            aria-label="Search users to message"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-2">
          {!query.trim() && (
            <p className="px-3 py-4 text-center text-sm text-slate-500">
              Type a username to find someone to message.
            </p>
          )}
          {query.trim() && loading && (
            <p className="px-3 py-4 text-center text-sm text-slate-500">
              Searching...
            </p>
          )}
          {query.trim() && !loading && !results.length && (
            <p className="px-3 py-4 text-center text-sm text-slate-500">
              No users found.
            </p>
          )}
          {results.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleSelect(user)}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {user.username}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageSearch;
