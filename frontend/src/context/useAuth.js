import { useContext } from "react";

import { AuthContext } from "./AuthContextValue";

export function useAuth() {
  return useContext(AuthContext);
}
