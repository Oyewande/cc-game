import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import { useAuth } from "../context/useAuth";

// Simulated online-player count to make the lobby feel alive
const ONLINE_COUNT = Math.floor(Math.random() * 40) + 12;

export default function OnlineMultiplayer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [finding, setFinding] = useState(false);

  // If somehow an unauthenticated user reaches this page (shouldn't happen
  // due to ProtectedRoute), show a prompt instead of crashing.
  if (!user) {
    return (
      <div className="h-screen overflow-hidden flex flex-col relative
                      bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl
                          border border-slate-200/60 dark:border-slate-700/60 text-center max-w-sm">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
              Account Required
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You need an account to play online multiplayer and appear on the global leaderboard.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm
                          bg-emerald-600 hover:bg-emerald-700 text-white
                          transition-all duration-300 cursor-pointer"
              >
                Sign In / Register
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm
                          bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200
                          hover:bg-slate-200 dark:hover:bg-slate-600
                          transition-all duration-300 cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFindMatch = () => {
    setFinding(true);
    // Placeholder — real matchmaking would go here
    setTimeout(() => setFinding(false), 3000);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🌐</div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Online Multiplayer
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Challenge real players around the world in real-time
            </p>
          </div>

          {/* Online player count */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{ONLINE_COUNT}</span> players online
            </span>
          </div>

          {/* Logged-in player card */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 mb-4
                          border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                             flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg">
                {(user.displayName || user.email || "?")[0].toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-white text-sm">
                  {user.displayName || user.email?.split("@")[0]}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">Ready to play</div>
              </div>
              <div className="ml-auto">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                               text-emerald-700 dark:text-emerald-400 font-semibold">
                  Online
                </span>
              </div>
            </div>

            <button
              onClick={handleFindMatch}
              disabled={finding}
              className="w-full py-3.5 rounded-xl font-bold text-sm
                        bg-emerald-600 hover:bg-emerald-700 text-white
                        transition-all duration-300 cursor-pointer
                        disabled:opacity-70 disabled:cursor-not-allowed
                        active:scale-[0.98] shadow-lg"
            >
              {finding ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding a match…
                </span>
              ) : (
                "⚡ Find Match"
              )}
            </button>
          </div>

          {/* Coming soon notice */}
          <div className="bg-amber-50 dark:bg-amber-900/15 rounded-xl p-4
                          border border-amber-200 dark:border-amber-800/50 text-center mb-4">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">
              🚧 Coming Soon
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-500">
              Real-time online matchmaking is in development. For now, try{" "}
              <button
                onClick={() => navigate("/start?mode=dual")}
                className="underline font-semibold cursor-pointer"
              >
                Pass &amp; Play
              </button>{" "}
              to compete with a friend on the same device.
            </p>
          </div>

          {/* How it will work */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5
                          border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              How it will work
            </h3>
            <div className="space-y-3">
              {[
                { icon: "🔍", title: "Matchmaking", desc: "Get paired with a player of similar skill in seconds" },
                { icon: "⚡", title: "Live rounds", desc: "Both players see the same question simultaneously" },
                { icon: "🏆", title: "Ranked play", desc: "Wins affect your global leaderboard position" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.title}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold
                      text-slate-500 dark:text-slate-400
                      hover:text-slate-700 dark:hover:text-slate-200
                      transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>

        </div>
      </div>
    </div>
  );
}
