// Custom hook to access authentication context from any component
import { useContext } from "react";

import { AuthContext } from "./AuthContextValue";

// Returns user, token, and auth functions from AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
