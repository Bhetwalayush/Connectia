import { useState } from "react";

import { useQuery } from "@apollo/client/react";

import { GET_CURRENT_USER } from "../graphql/queries/userQueries";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    skip: !token,
  });

  const user = data?.me ?? null;

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    window.location.assign("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refetch,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
