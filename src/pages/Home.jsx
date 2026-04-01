import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import LeaderboardSidebar from "../components/Leaderboard/LeaderboardSidebar";

function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="text-6xl md:text-7xl mb-4 animate-float">🌍</div>

        <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center
                       text-slate-800 dark:text-white">
          Capitals Quest
        </h1>

        <p className="mb-8 text-center max-w-md text-sm md:text-base
                      text-slate-500 dark:text-slate-400">
          Test your geography knowledge. Pick a difficulty, compete on the leaderboard, and challenge players around the world.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Link
            to="/start?mode=single"
            className="px-8 py-3 rounded-xl shadow-lg font-semibold text-sm
                       bg-emerald-600 hover:bg-emerald-700 text-white
                       transition-all duration-300 hover:shadow-emerald-500/25 hover:-translate-y-0.5"
          >
            🧑 Single Player
          </Link>

          <Link
            to="/online"
            className="px-8 py-3 rounded-xl shadow-lg font-semibold text-sm
                       bg-slate-800 hover:bg-slate-900 text-white
                       dark:bg-slate-700 dark:hover:bg-slate-600
                       transition-all duration-300 hover:-translate-y-0.5"
          >
            🌐 Multiplayer
          </Link>
        </div>

        <button
          onClick={() => setShowLeaderboard(true)}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm
                     bg-white dark:bg-[#1e293b]
                     text-slate-700 dark:text-slate-200
                     border border-slate-200 dark:border-slate-700
                     hover:bg-slate-50 dark:hover:bg-slate-800
                     shadow-sm hover:shadow-md
                     transition-all duration-300 cursor-pointer"
        >
          🏆 Leaderboard
        </button>
      </div>

      {showLeaderboard && (
        <LeaderboardSidebar onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}

export default Home;
