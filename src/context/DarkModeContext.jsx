import { createContext, useEffect, useState } from "react";

const DarkModeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
})

export function DarkModeProvider({ children }) {
  // Initialize state from localStorage, defaulting to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    }
    return false;
  });

  // On mount, force remove dark class if localStorage says false
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "false" || saved === null) {
      // Explicitly remove dark class on mount if we should be in light mode
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // Update class and localStorage when isDarkMode changes
  useEffect(() => {
    const html = document.documentElement;
    
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem("darkMode", newValue.toString());
      return newValue;
    });
  }

  return <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>
}  
export default DarkModeContext;