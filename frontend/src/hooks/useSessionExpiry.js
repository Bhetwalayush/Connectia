// hooks/useSessionExpiry.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function useSessionExpiry(expiresInSeconds, logout) {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!expiresInSeconds) return;

    timerRef.current = setTimeout(() => {
      logout(); // clear user/token state — reuse your existing logout()
      navigate("/login?expired=1");
    }, expiresInSeconds * 1000);

    return () => clearTimeout(timerRef.current);
  }, [expiresInSeconds, logout, navigate]);
}
