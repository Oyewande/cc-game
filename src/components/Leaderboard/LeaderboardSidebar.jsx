import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";
import CloseIcon from "@mui/icons-material/Close";

export default function LeaderboardSidebar({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user) {
        setError("Sign in to view the leaderboard.");
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "scores"), orderBy("highScore", "desc"), limit(50));
        const snap = await getDocs(q);
        setLeaderboard(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        const code = err?.code || "";
        if (code.includes("permission-denied")) {
          setError("Sign in to view the leaderboard.");
        } else {
          setError("Could not load leaderboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] shadow-2xl overflow-y-auto
                      animate-slideInRight transition-colors duration-300
                      border-l border-slate-200/60 dark:border-slate-700/60">
        <div className="sticky top-0 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-sm
                        border-b border-slate-200/60 dark:border-slate-700/60
                        p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            🏆 Leaderboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
                      text-slate-500 dark:text-slate-400 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-sm text-slate-400 dark:text-slate-500">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">
              {error}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">
              No scores yet. Be the first to play!
            </div>
          ) : (
            <ul className="space-y-2">
              {leaderboard.map((entry, i) => (
                <li
                  key={entry.id}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    entry.id === user?.uid
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                      : i < 3
                      ? "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg w-8 text-center">
                        {i < 3 ? medals[i] : <span className="text-sm text-slate-400 font-bold">#{i + 1}</span>}
                      </span>
                      <div>
                        <span className={`font-medium text-sm ${
                          entry.id === user?.uid ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-200"
                        }`}>
                          {entry.displayName || entry.email?.split("@")[0] || "Anonymous"}
                          {entry.id === user?.uid && <span className="text-xs ml-1 opacity-60">(you)</span>}
                        </span>
                        {entry.gamesPlayed && (
                          <span className="block text-xs text-slate-400 dark:text-slate-500">
                            {entry.gamesPlayed} game{entry.gamesPlayed !== 1 ? "s" : ""} played
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg text-slate-800 dark:text-white">
                        {entry.highScore}
                      </span>
                      <span className="block text-xs text-slate-400 dark:text-slate-500">pts</span>
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
