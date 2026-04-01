import { useContext } from "react";
import AuthContext from "./AuthContext";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>. Check that your component tree wraps the app with AuthProvider.");
  }
  return ctx;
};

export default useAuth;