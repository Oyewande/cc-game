import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import QuestionCard from "../components/Game/QuestionCard";
import ScoreBoard from "../components/Game/Scoreboard";
import { OFFLINE_COUNTRIES } from "../data/countriesOffline";
import { db } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Game() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { mode = "single", online = true, player1 = "Player 1", player2 = "CPU" } = loc.state || {};
  const twoPlayer = mode === "dual";
  const secondaryName = twoPlayer ? (player2 || "Player 2") : "CPU";

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [players, setPlayers] = useState([
    { name: player1, score: 0, mistakes: 0 },
    { name: secondaryName, score: 0, mistakes: 0 },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function load() {
      let pool = [];
      if (online) {
        try {
          const res = await fetch("https://restcountries.com/v3.1/all?fields=name,capital");
          const data = await res.json();
          pool = data.filter((c) => c.capital && c.capital.length > 0).map((c) => ({ country: c.name.common, capital: c.capital[0] }));
        } catch (e) {
          console.error("API fetch failed, switching to offline", e);
          pool = OFFLINE_COUNTRIES;
        }
      } else {
        pool = OFFLINE_COUNTRIES;
      }

      const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 20);
      const prepared = shuffled.map((q) => {
        const wrong = [];
        while (wrong.length < 3) {
          const r = pool[Math.floor(Math.random() * pool.length)].capital;
          if (r !== q.capital && !wrong.includes(r)) wrong.push(r);
        }
        return { country: q.country, correct: q.capital, options: [...wrong, q.capital].sort(() => Math.random() - 0.5) };
      });
      setQuestions(prepared);
    }
    load();
  }, [online]);

  const handleAnswer = (opt) => {
    const q = questions[index];
    if (!q) return;
    setPlayers((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (opt === q.correct) copy[currentPlayer].score += 1;
      else {
        copy[currentPlayer].mistakes += 1;
        if (copy[currentPlayer].mistakes >= 3) setGameOver(true);
      }
      return copy;
    });
    setIndex((i) => i + 1);
    if (twoPlayer) setCurrentPlayer((p) => (p === 0 ? 1 : 0));
    if (index + 1 >= questions.length) setGameOver(true);
  };

  const endAndSave = async () => {
    const p1s = players[0].score,
      p2s = players[1].score;
    if (db) {
      try {
        const payload = {
          player1: players[0].name,
          player1Score: p1s,
          totalScore: twoPlayer ? p1s + p2s : p1s,
          timestamp: serverTimestamp(),
        };
        if (twoPlayer) {
          payload.player2 = players[1].name;
          payload.player2Score = p2s;
        } else {
          payload.player2 = null;
          payload.player2Score = null;
        }
        await addDoc(collection(db, "leaderboard"), payload);
      } catch (err) {
        console.error("Save failed:", err);
      }
    }
    
    navigate("/results", { state: { player1: players[0].name, player2: twoPlayer ? players[1].name : "CPU", player1Score: p1s, player2Score: twoPlayer ? p2s : 0 } });
  };

  if (!questions.length) {
    return (
      <div className="h-screen overflow-hidden flex flex-col relative
                      bg-[#e0e4f1] dark:bg-[#1f2a44] transition-colors duration-300">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-[#425278] dark:text-[#aab6d6] text-lg">Loading questions…</div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="h-screen overflow-hidden flex flex-col relative
                      bg-[#e0e4f1] dark:bg-[#1f2a44] transition-colors duration-300">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#33405D] p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md text-center
                          transition-colors duration-300">
            <h2 className="text-2xl md:text-3xl font-bold mb-4
                          text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
              Game Over
            </h2>
            <p className="mb-6 text-[#2d3a5b] dark:text-[#cbd6f0] transition-colors duration-300">
              {twoPlayer
                ? `${players[0].name}: ${players[0].score} — ${players[1].name}: ${players[1].score}`
                : `${players[0].name}: ${players[0].score}`}
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={endAndSave} 
                className="px-6 py-2 rounded-md shadow font-semibold
                          bg-[#425278] hover:bg-[#3a4770] text-white
                          dark:bg-[#6b7aa8] dark:hover:bg-[#556294]
                          transition-colors duration-300 cursor-pointer"
              >
                Save & Results
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 rounded-md border font-semibold
                          bg-white dark:bg-[#49546F]
                          text-[#425278] dark:text-[#cbd6f0]
                          border-[#425278]/30 dark:border-[#6b7aa8]/50
                          hover:bg-gray-100 dark:hover:bg-[#556294]
                          transition-colors duration-300 cursor-pointer"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-[#e0e4f1] dark:bg-[#1f2a44] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-6">
        <ScoreBoard players={players} currentPlayer={currentPlayer} />
        <QuestionCard question={{ country: q.country, options: q.options, correct: q.correct }} onAnswer={handleAnswer} index={index + 1} total={questions.length} currentPlayer={currentPlayer} players={players} />
      </div>
    </div>
  );
}