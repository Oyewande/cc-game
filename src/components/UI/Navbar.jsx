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
  
  // Check if we're on an auth page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/auth";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full bg-[#495B85] dark:bg-[#33405D] text-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-semibold">
          🌍 Capitals Quest
        </div>

        {/* Desktop Section */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthPage && (
            <div className="text-sm">
              {user ? (
                <>
                  <span className="mr-3">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <span className="text-gray-200">Guest</span>
              )}
            </div>
          )}

          <ThemeToggle />
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-gray-600 dark:bg-[#2a3650] p-4 rounded-lg space-y-4 animate-slideDown">
          {/* Auth - Only show if not on auth page */}
          {!isAuthPage && (
            <div>
              {user ? (
                <>
                  <div className="text-sm mb-2">{user.email}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <span className="text-gray-200">Guest</span>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <div>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}