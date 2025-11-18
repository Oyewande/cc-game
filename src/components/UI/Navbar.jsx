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
    <nav className="w-full bg-[#495B85] dark:bg-[#33405D] text-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-semibold">
          🌍 Capitals Quest
        </div>

        {/* Desktop Section */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthPage && (
            <div className="text-sm flex items-center gap-2">
              {user ? (
                <>
                  <span className="mr-1">{preferredName}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-200">Guest</span>
                  <button
                    onClick={handleLoginNavigate}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/30 transition cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          )}

          <ThemeToggle />
        </div>

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
          {!isAuthPage && (
            <div>
              {user ? (
                <>
                  <div className="text-sm mb-2">{preferredName}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-200 block mb-2">Guest</span>
                  <button
                    onClick={handleLoginNavigate}
                    className="w-full px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition text-left"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          )}

          <div>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}