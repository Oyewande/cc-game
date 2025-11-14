import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => { 
      setUser(u); 
      setLoading(false); 
    });
    return () => unsub();
  }, []);

  const signup = (email, pw) => {
    if (!auth) throw new Error("Firebase not initialized");
    return createUserWithEmailAndPassword(auth, email, pw);
  };
  const login = (email, pw) => {
    if (!auth) throw new Error("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, pw);
  };
  const logout = () => {
    if (!auth) throw new Error("Firebase not initialized");
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;