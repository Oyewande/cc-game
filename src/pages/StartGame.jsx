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
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Start Game</h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="single">Single Player</option>
              <option value="dual">Two Players</option>
            </select>

            <label className="block mb-1 font-medium">Data source</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOnline(true)}
                className={`px-3 py-1 rounded ${online ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}
              >
                Online (API)
              </button>
              <button
                type="button"
                onClick={() => setOnline(false)}
                className={`px-3 py-1 rounded ${!online ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}
              >
                Offline (Local)
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Player 1</label>
            <input
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="Player 1 name"
              className="w-full p-2 mb-2 border rounded dark:bg-gray-700"
            />

            {mode === "dual" && (
              <>
                <label className="block mb-1 font-medium">Player 2</label>
                <input
                  value={p2}
                  onChange={(e) => setP2(e.target.value)}
                  placeholder="Player 2 name"
                  className="w-full p-2 border rounded dark:bg-gray-700"
                />
              </>
            )}
          </div>

          <button onClick={start} className="w-full py-2 bg-green-600 text-white rounded">
            Start Quiz
          </button>
        </div>
      </div>
    </>
  );
}