import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function PublicRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        Loading Connectia...
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoutes;
