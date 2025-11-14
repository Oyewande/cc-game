import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";

export default function StartGame() {
  const [params] = useSearchParams();
  const defaultMode = params.get("mode") || "single"; 
  const [mode, setMode] = useState(defaultMode); 
  const [online, setOnline] = useState(true);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const navigate = useNavigate();

  const start = () => {
    if (mode === "single" && !p1.trim()) {
      return alert("Please enter Player 1 name.");
    }
    if (mode === "dual" && (!p1.trim() || !p2.trim())) {
      return alert("Please enter both player names.");
    }

    navigate("/game", {
      state: {
        mode,
        online,
        player1: p1.trim() || "Player 1",
        player2: mode === "dual" ? (p2.trim() || "Player 2") : "CPU",
      },
    });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-[#e0e4f1] dark:bg-[#1f2a44] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md bg-white dark:bg-[#33405D] p-6 md:p-8 rounded-xl shadow-lg
                        transition-colors duration-300">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center
                         text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            Start Game
          </h2>

          <div className="mb-6">
            <label className="block mb-2 font-medium
                             text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-3 border rounded-md mb-4
                        bg-white dark:bg-[#49546F] 
                        text-[#425278] dark:text-[#cbd6f0]
                        border-[#425278]/30 dark:border-[#6b7aa8]/50
                        focus:outline-none focus:ring-2 focus:ring-[#425278]/50 dark:focus:ring-[#6b7aa8]/50
                        transition-colors duration-300"
            >
              <option value="single">Single Player</option>
              <option value="dual">Two Players</option>
            </select>

            <label className="block mb-2 font-medium
                             text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
              Data source
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOnline(true)}
                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                  online 
                    ? "bg-[#425278] hover:bg-[#3a4770] text-white dark:bg-[#6b7aa8] dark:hover:bg-[#556294]" 
                    : "bg-gray-200 hover:bg-gray-300 text-[#425278] dark:bg-[#49546F] dark:hover:bg-[#556294] dark:text-[#cbd6f0]"
                }`}
              >
                Online (API)
              </button>
              <button
                type="button"
                onClick={() => setOnline(false)}
                className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                  !online 
                    ? "bg-[#425278] hover:bg-[#3a4770] text-white dark:bg-[#6b7aa8] dark:hover:bg-[#556294]" 
                    : "bg-gray-200 hover:bg-gray-300 text-[#425278] dark:bg-[#49546F] dark:hover:bg-[#556294] dark:text-[#cbd6f0]"
                }`}
              >
                Offline (Local)
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium
                             text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
              Player 1
            </label>
            <input
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="Player 1 name"
              className="w-full p-3 mb-4 border rounded-md
                        bg-white dark:bg-[#49546F]
                        text-[#425278] dark:text-[#cbd6f0]
                        placeholder:text-[#425278]/50 dark:placeholder:text-[#cbd6f0]/50
                        border-[#425278]/30 dark:border-[#6b7aa8]/50
                        focus:outline-none focus:ring-2 focus:ring-[#425278]/50 dark:focus:ring-[#6b7aa8]/50
                        transition-colors duration-300"
            />

            {mode === "dual" && (
              <>
                <label className="block mb-2 font-medium
                                 text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
                  Player 2
                </label>
                <input
                  value={p2}
                  onChange={(e) => setP2(e.target.value)}
                  placeholder="Player 2 name"
                  className="w-full p-3 border rounded-md
                            bg-white dark:bg-[#49546F]
                            text-[#425278] dark:text-[#cbd6f0]
                            placeholder:text-[#425278]/50 dark:placeholder:text-[#cbd6f0]/50
                            border-[#425278]/30 dark:border-[#6b7aa8]/50
                            focus:outline-none focus:ring-2 focus:ring-[#425278]/50 dark:focus:ring-[#6b7aa8]/50
                            transition-colors duration-300"
                />
              </>
            )}
          </div>

          <button 
            onClick={start} 
            className="w-full py-3 rounded-md shadow font-semibold
                      bg-[#425278] hover:bg-[#3a4770] text-white
                      dark:bg-[#6b7aa8] dark:hover:bg-[#556294]
                      transition-colors duration-300
                      cursor-pointer active:scale-[0.98]"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}