// Inline sidebar search - find a user by username, navigate to their profile
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "../../graphql/queries/userQueries";

function SidebarSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const [searchUsers, { data, loading }] = useLazyQuery(SEARCH_USERS);

  // Debounced network call only — no state updates here, just syncing
  // with the external GraphQL search as the query text settles.
  useEffect(() => {
    if (!query.trim()) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers({ variables: { query: query.trim() } });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, searchUsers]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(event) {
    const value = event.target.value;
    setQuery(value);
    setIsOpen(Boolean(value.trim()));
  }

  function handleSelect(user) {
    setQuery("");
    setIsOpen(false);
    navigate(`/profile/${user.id}`);
  }

  const results = data?.searchUsers ?? [];

  return (
    <div ref={containerRef} className="relative mb-4">
      <input
        value={query}
        onChange={handleChange}
        onFocus={() => query.trim() && setIsOpen(true)}
        placeholder="Search users..."
        aria-label="Search users"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border bg-white shadow-lg">
          {loading && (
            <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>
          )}
          {!loading && !results.length && (
            <p className="px-3 py-2 text-sm text-slate-500">No users found.</p>
          )}
          {results.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleSelect(user)}
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {user.username}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SidebarSearch;
