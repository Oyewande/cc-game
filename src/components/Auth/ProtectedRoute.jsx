import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

/**
 * Wraps routes that require authentication.
 * If not logged in, redirects to login page.
 * Pass `guestAllowed` to let unauthenticated users through
 * (e.g., game page allows guest play but warns they can't save).
 */
export default function ProtectedRoute({ children, guestAllowed = false }) {
  const { user } = useAuth();

  if (!user && !guestAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
