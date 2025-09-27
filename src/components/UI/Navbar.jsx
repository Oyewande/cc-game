import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/useAuth";
export default function Navbar(){
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 dark:bg-gray-900 text-white">
      <div className="flex items-center gap-3"><div className="text-2xl font-semibold">🌍 Capitals</div><div className="text-sm opacity-90">Quiz</div></div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user ? (<><span className="hidden sm:inline">{user.email}</span><button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button></>) : (<span>Guest</span>)}
      </div>
    </nav>
  );
}