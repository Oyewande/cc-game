import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import { useAuth } from "../context/useAuth";
import { CONTINENTS } from "../data/countriesOffline";

export default function StartGame() {
  const [params] = useSearchParams();
  const defaultMode = params.get("mode") || "single";
  const [mode, setMode] = useState(defaultMode);
  const [difficulty, setDifficulty] = useState("all");
  const [continent, setContinent] = useState("All");
  const [anonymous, setAnonymous] = useState(false);
  const [p1, setP1] = useState("");   // only used when user is not logged in
  const [p2, setP2] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // For single player, if user is logged in use their displayName;
  // otherwise fall back to whatever they typed in p1.
  const resolvedP1 = mode === "single" && user
    ? (anonymous ? "Anonymous" : (user.displayName || user.email?.split("@")[0] || "Player"))
    : (p1.trim() || "Player 1");

  const start = () => {
    if (mode === "single" && !user && !p1.trim()) {
      return alert("Please enter your name to play.");
    }
    if (mode === "dual" && (!p1.trim() || !p2.trim())) {
      return alert("Please enter both player names.");
    }

    navigate("/game", {
      state: {
        mode,
        difficulty,
        continent,
        anonymous: mode === "single" && anonymous,
        player1: resolvedP1,
        player2: mode === "dual" ? (p2.trim() || "Player 2") : "CPU",
      },
    });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-lg bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-2xl shadow-xl
                        border border-slate-200/60 dark:border-slate-700/60 transition-colors duration-300">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center
                         text-slate-800 dark:text-white">
            Game Setup
          </h2>

          {/* Mode selector — dual mode kept for same-device play */}
          <div className="mb-5">
            <label className="block mb-2 text-xs font-semibold uppercase tracking-wider
                             text-slate-400 dark:text-slate-500">
              Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("single")}
                className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 ${
                  mode === "single"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                }`}
              >
                <div className="text-2xl mb-1">🧑</div>
                <div className={`text-sm font-semibold ${
                  mode === "single" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-200"
                }`}>
                  Single Player
                </div>
              </button>
              <button
                onClick={() => setMode("dual")}
                className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 ${
                  mode === "dual"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                }`}
              >
                <div className="text-2xl mb-1">👥</div>
                <div className={`text-sm font-semibold ${
                  mode === "dual" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-200"
                }`}>
                  Pass &amp; Play
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Same device</div>
              </button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-5">
            <label className="block mb-2 text-xs font-semibold uppercase tracking-wider
                             text-slate-400 dark:text-slate-500">
              Difficulty
            </label>
            <div className="flex gap-2">
              {[
                { value: "all", label: "Mixed", emoji: "🎲" },
                { value: "easy", label: "Easy", emoji: "🟢" },
                { value: "medium", label: "Medium", emoji: "🟡" },
                { value: "hard", label: "Hard", emoji: "🔴" },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${
                    difficulty === d.value
                      ? "bg-slate-800 text-white dark:bg-emerald-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {d.emoji} {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Continent filter */}
          <div className="mb-5">
            <label className="block mb-2 text-xs font-semibold uppercase tracking-wider
                             text-slate-400 dark:text-slate-500">
              Region
            </label>
            <div className="flex flex-wrap gap-2">
              {CONTINENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setContinent(c)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${
                    continent === c
                      ? "bg-slate-800 text-white dark:bg-emerald-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {c === "All" ? "🌍 All" : c}
                </button>
              ))}
            </div>
          </div>

          {/* Player name section */}
          <div className="mb-6">
            {mode === "single" ? (
              <>
                <label className="block mb-2 text-xs font-semibold uppercase tracking-wider
                                 text-slate-400 dark:text-slate-500">
                  Player
                </label>

                {user ? (
                  <div className={`w-full p-3 mb-3 rounded-lg text-sm transition-all duration-300
                                  border ${anonymous
                                    ? "bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-400 dark:text-slate-500 line-through"
                                    : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-semibold"}`}>
                    {anonymous ? "Anonymous" : (user.displayName || user.email?.split("@")[0])}
                  </div>
                ) : (
                  <input
                    value={p1}
                    onChange={(e) => setP1(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 mb-3 rounded-lg text-sm
                              bg-slate-50 dark:bg-slate-800
                              text-slate-800 dark:text-slate-200
                              placeholder:text-slate-400 dark:placeholder:text-slate-500
                              border border-slate-200 dark:border-slate-600
                              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                              transition-all duration-300"
                  />
                )}

                {user && (
                  <button
                    type="button"
                    onClick={() => setAnonymous((a) => !a)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2
                                cursor-pointer transition-all duration-300 border ${
                      anonymous
                        ? "bg-slate-800 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-500"
                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>{anonymous ? "✓" : "○"}</span>
                    Play as Anonymous
                    <span className="font-normal opacity-70"></span>
                  </button>
                )}
              </>
            ) : (
              /* Dual / Pass-and-play: both names editable */
              <>
                <label className="block mb-2 text-xs font-semibold uppercase tracking-wider
                                 text-slate-400 dark:text-slate-500">
                  Player 1
                </label>
                <input
                  value={p1}
                  onChange={(e) => setP1(e.target.value)}
                  placeholder="Enter Player 1 name"
                  className="w-full p-3 mb-3 rounded-lg text-sm
                            bg-slate-50 dark:bg-slate-800
                            text-slate-800 dark:text-slate-200
                            placeholder:text-slate-400 dark:placeholder:text-slate-500
                            border border-slate-200 dark:border-slate-600
                            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                            transition-all duration-300"
                />
                <label className="block mb-2 text-xs font-semibold uppercase tracking-wider
                                 text-slate-400 dark:text-slate-500">
                  Player 2
                </label>
                <input
                  value={p2}
                  onChange={(e) => setP2(e.target.value)}
                  placeholder="Enter Player 2 name"
                  className="w-full p-3 rounded-lg text-sm
                            bg-slate-50 dark:bg-slate-800
                            text-slate-800 dark:text-slate-200
                            placeholder:text-slate-400 dark:placeholder:text-slate-500
                            border border-slate-200 dark:border-slate-600
                            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                            transition-all duration-300"
                />
              </>
            )}
          </div>

          <button
            onClick={start}
            className="w-full py-3.5 rounded-xl shadow-lg font-bold text-sm
                      bg-emerald-600 hover:bg-emerald-700 text-white
                      transition-all duration-300
                      cursor-pointer active:scale-[0.98]"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}
