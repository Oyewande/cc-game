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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { 
      setUser(currentUser); 
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user); 
    return result;
  };
  const login = (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logout = () => {
    if (!auth) throw new Error("Firebase not initialized");
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;