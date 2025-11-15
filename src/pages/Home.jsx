import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import LeaderboardSidebar from "../components/Leaderboard/LeaderboardSidebar";

function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-[#e0e4f1] dark:bg-[#1f2a44] transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-center 
                       text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
          🌍 Country & Capitals Challenge
        </h1>

        <p className="mb-4 md:mb-6 text-center max-w-xl text-sm md:text-base
                      text-[#2d3a5b] dark:text-[#cbd6f0] transition-colors duration-300">
          Choose single or two-player mode.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-3 md:mb-4">
          <Link 
            to="/start?mode=single" 
            className="px-6 md:px-8 py-2 md:py-3 rounded shadow font-semibold text-sm md:text-base
                       bg-[#425278] hover:bg-[#3a4770] text-white transition-colors duration-300 dark:bg-[#6b7aa8] dark:hover:bg-[#556294]"
          >
            ▶ Single Player
          </Link>

          <Link 
            to="/start?mode=dual" 
            className="px-6 md:px-8 py-2 md:py-3 rounded shadow font-semibold text-sm md:text-base
                       bg-[#425278] hover:bg-[#3a4770] text-white transition-colors duration-300 dark:bg-[#6b7aa8] dark:hover:bg-[#556294]"
          >
            👥 Two Players
          </Link>
        </div>

        <button
          onClick={() => setShowLeaderboard(true)}
          className="px-6 md:px-8 py-2 md:py-3 rounded shadow font-semibold text-sm md:text-base
                     bg-[#6b7aa8] hover:bg-[#556294] text-white
                     dark:bg-[#425278] dark:hover:bg-[#3a4770]
                     transition-colors duration-300"
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