// Route guard - Only authenticated users can access protected routes
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        Loading Connectia...
      </div>
    );
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export default ProtectedRoutes;
