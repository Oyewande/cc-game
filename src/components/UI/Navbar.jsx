import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/useAuth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const preferredName = user?.displayName?.trim() || user?.email || "";

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLoginNavigate = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-md
                    border-b border-slate-200/60 dark:border-slate-700/60
                    transition-colors duration-300 z-40">
      {/* Desktop & Mobile navbar bar */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo — always visible */}
        <button
          onClick={() => navigate("/")}
          className="text-lg md:text-xl font-bold cursor-pointer
                     text-slate-800 dark:text-white hover:opacity-80 transition-opacity"
        >
          🌍 Capitals Quest
        </button>

        {/* Desktop Section — full spacing */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthPage && (
            <div className="text-sm flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {preferredName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold
                              bg-slate-100 dark:bg-slate-800
                              text-slate-600 dark:text-slate-300
                              hover:bg-slate-200 dark:hover:bg-slate-700
                              transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="text-slate-400 dark:text-slate-500 text-xs">Guest</span>
                  <button
                    onClick={handleLoginNavigate}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold
                              bg-emerald-600 hover:bg-emerald-700 text-white
                              transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile controls — dark mode toggle + menu icon */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="text-slate-600 dark:text-slate-300 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 bg-slate-50 dark:bg-slate-800 space-y-3
                        border-t border-slate-200/60 dark:border-slate-700/60 transition-colors duration-300">
          {!isAuthPage && (
            <div>
              {user ? (
                <>
                  <div className="text-sm mb-2 text-slate-700 dark:text-slate-200 font-medium">
                    {preferredName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-left
                              bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200
                              hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="text-slate-400 dark:text-slate-500 block mb-2 text-xs">Guest</span>
                  <button
                    onClick={handleLoginNavigate}
                    className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-left
                              bg-emerald-600 hover:bg-emerald-700 text-white
                              transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
