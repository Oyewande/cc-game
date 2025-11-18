import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";

export default function LeaderboardSidebar({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "leaderboard"), orderBy("totalScore", "desc"));
        const snap = await getDocs(q);
        const games = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        const playerScores = {};
        games.forEach(game => {

          if (!playerScores[game.player1] || playerScores[game.player1] < game.player1Score) {
            playerScores[game.player1] = game.player1Score;
          }

          if (game.player2 && game.player2 !== "CPU") {
            if (!playerScores[game.player2] || playerScores[game.player2] < game.player2Score) {
              playerScores[game.player2] = game.player2Score;
            }
          }
        });
        
        const sortedPlayers = Object.entries(playerScores)
          .map(([name, score]) => ({ name, score }))
          .sort((a, b) => b.score - a.score);
        
        setLeaderboard(sortedPlayers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="flex-1 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />
      
      <div className="w-full max-w-md bg-white dark:bg-[#33405D] shadow-2xl overflow-y-auto
                      animate-slideInRight transition-colors duration-300">
        <div className="sticky top-0 bg-white dark:bg-[#33405D] border-b border-[#425278]/20 dark:border-[#6b7aa8]/30
                        p-4 flex items-center justify-between z-10">
          <h2 className="text-xl md:text-2xl font-bold
                        text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            🏆 Leaderboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#49546F]
                      text-[#425278] dark:text-[#cbd6f0] transition-colors duration-300"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center py-8
                          text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
              Loading leaderboard...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8
                          text-[#2d3a5b] dark:text-[#cbd6f0] transition-colors duration-300">
              No scores yet. Be the first to play!
            </div>
          ) : (
            <ul className="space-y-2">
              {leaderboard.map((player, i) => (
                <li
                  key={player.name}
                  className={`p-3 md:p-4 rounded-lg transition-colors duration-300 ${
                    i === 0
                      ? 'bg-yellow-300 dark:bg-yellow-600 text-[#425278] dark:text-[#1f2a44] font-semibold'
                      : 'bg-gray-100 dark:bg-[#49546F] text-[#425278] dark:text-[#cbd6f0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold w-8">#{i + 1}</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-bold">{player.score}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

