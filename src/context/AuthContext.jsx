import { createContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();

/** Map Firebase error codes to friendly messages */
export function friendlyAuthError(err) {
  const code = err?.code || "";
  const map = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Incorrect email or password. Try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Try again.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    // Use auth.currentUser (the live Firebase User object) — never spread it.
    // Spreading destroys prototype methods (getIdToken, reload, etc.).
    // onAuthStateChanged fires on account creation but before updateProfile
    // completes, so we manually sync here to get the displayName immediately.
    setUser(auth.currentUser);
    return result;
  };

  const login = (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Centralised Google sign-in used by both LoginForm and SignupForm.
  // Trims the display name to first name only for a cleaner leaderboard.
  const loginWithGoogle = async () => {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await signInWithPopup(auth, googleProvider);
    const firstName = (result.user.displayName || "").split(" ")[0].trim();
    if (firstName && result.user.displayName !== firstName) {
      await updateProfile(result.user, { displayName: firstName });
      setUser(auth.currentUser);
    }
    return result;
  };

  const logout = () => {
    if (!auth) throw new Error("Firebase not initialized");
    return signOut(auth);
  };

  const resetPassword = (email) => {
    if (!auth) throw new Error("Firebase not initialized");
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
