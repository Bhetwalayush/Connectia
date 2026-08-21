// Authentication context provider - Manages the cookie-backed user session
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_CURRENT_USER } from "../graphql/queries/userQueries";
import { LOGOUT } from "../graphql/mutations/authMutations";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  // Fetch current user data from GraphQL server
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
  });
  const [logoutRequest] = useMutation(LOGOUT);

  const user = data?.me ?? null;

  // Clear the HttpOnly cookie through the backend and redirect to login.
  async function logout() {
    try {
      await logoutRequest();
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refetch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
