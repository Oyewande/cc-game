import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import QuestionCard from "../components/Game/QuestionCard";
import ScoreBoard from "../components/Game/Scoreboard";
import { OFFLINE_COUNTRIES } from "../data/countriesOffline";

export default function Game() {
  const loc = useLocation();
  const navigate = useNavigate();
  const {
    mode = "single",
    player1 = "Player 1",
    player2 = "CPU",
    difficulty = "all",
    continent = "All",
    anonymous = false,
  } = loc.state || {};

  const twoPlayer = mode === "dual";
  const secondaryName = twoPlayer ? (player2 || "Player 2") : "CPU";

  // Always unlimited — game ends only when a player hits 3 mistakes
  const unlimited = true;

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

      try {
        // Fetch population so we can assign difficulty tiers
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,region,population"
        );
        const data = await res.json();
        pool = data
          .filter((c) => c.capital && c.capital.length > 0)
          .map((c) => {
            const pop = c.population || 0;
            return {
              country: c.name.common,
              capital: c.capital[0],
              continent: mapRegionToContinent(c.region),
              // Difficulty based on how well-known a country is (population as proxy)
              difficulty: pop > 50_000_000 ? "easy" : pop > 5_000_000 ? "medium" : "hard",
            };
          })
          // Drop countries whose region didn't map to a known continent
          .filter((c) => c.continent !== null);
      } catch (e) {
        console.error("API fetch failed, falling back to built-in data", e);
        pool = [...OFFLINE_COUNTRIES];
      }

      // --- Filter by continent ---
      if (continent !== "All") {
        const filtered = pool.filter((c) => c.continent === continent);
        // Only apply the filter if there are enough questions; otherwise play globally
        if (filtered.length >= 8) pool = filtered;
      }

      // --- Filter by difficulty ---
      // Now works for both online and offline because online data has population-derived tags
      if (difficulty !== "all") {
        const filtered = pool.filter((c) => c.difficulty === difficulty);
        if (filtered.length >= 8) pool = filtered;
      }

      // Shuffle
      const shuffled = pool.sort(() => Math.random() - 0.5);

      const prepared = shuffled.map((q) => {
        const wrong = [];
        let attempts = 0;
        while (wrong.length < 3 && attempts < 100) {
          attempts++;
          const r = pool[Math.floor(Math.random() * pool.length)].capital;
          if (r !== q.capital && !wrong.includes(r)) wrong.push(r);
        }
        return {
          country: q.country,
          correct: q.capital,
          options: [...wrong, q.capital].sort(() => Math.random() - 0.5),
        };
      });

      setQuestions(prepared);
    }
    load();
  }, [difficulty, continent]);

  // Game-over: triggered when any player reaches 3 mistakes
  useEffect(() => {
    if (questions.length === 0) return;
    for (const p of players) {
      if (p.mistakes >= 3) {
        setGameOver(true);
        return;
      }
    }
  }, [players, questions.length]);

  const handleAnswer = useCallback((opt) => {
    if (gameOver) return;
    const q = questions[index];
    if (!q) return;

    // opt === null means the timer ran out — treat as wrong answer
    const isCorrect = opt !== null && opt === q.correct;

    setPlayers((prev) => {
      const copy = prev.map((p) => ({ ...p }));
      if (isCorrect) {
        copy[currentPlayer].score += 1;
      } else {
        copy[currentPlayer].mistakes += 1;
      }
      return copy;
    });

    setIndex((i) => i + 1);
    if (twoPlayer) setCurrentPlayer((p) => (p === 0 ? 1 : 0));
  }, [gameOver, questions, index, currentPlayer, twoPlayer]);

  const goToResults = () => {
    navigate("/results", {
      state: {
        mode,
        anonymous,
        player1: players[0].name,
        player2: twoPlayer ? players[1].name : "CPU",
        player1Score: players[0].score,
        player2Score: twoPlayer ? players[1].score : 0,
        difficulty,
        continent,
      },
    });
  };

  if (!questions.length) {
    return (
      <div className="h-screen overflow-hidden flex flex-col relative
                      bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-slate-500 dark:text-slate-400 text-sm">Loading questions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const isTie = players[0].score === players[1].score;
    const winner = players[0].score >= players[1].score ? players[0] : players[1];

    return (
      <div className="h-screen overflow-hidden flex flex-col relative
                      bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl
                          border border-slate-200/60 dark:border-slate-700/60
                          w-full max-w-md text-center transition-colors duration-300">
            <div className="text-5xl mb-4">{isTie ? "🤝" : "🏆"}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800 dark:text-white">
              Game Over!
            </h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              {twoPlayer
                ? isTie ? "It's a tie!" : `${winner.name} wins!`
                : `You scored ${players[0].score} point${players[0].score !== 1 ? "s" : ""}`}
            </p>

            <div className="flex gap-4 justify-center mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-6 py-3 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{players[0].name}</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{players[0].score}</div>
              </div>
              {twoPlayer && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-6 py-3 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{players[1].name}</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{players[1].score}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={goToResults}
                className="px-6 py-2.5 rounded-xl shadow font-semibold text-sm
                          bg-emerald-600 hover:bg-emerald-700 text-white
                          transition-all duration-300 cursor-pointer"
              >
                View Results
              </button>
              <button
                onClick={() => navigate("/start")}
                className="px-5 py-2.5 rounded-xl border font-semibold text-sm
                          bg-white dark:bg-slate-800
                          text-slate-700 dark:text-slate-200
                          border-slate-200 dark:border-slate-600
                          hover:bg-slate-50 dark:hover:bg-slate-700
                          transition-all duration-300 cursor-pointer"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[index];

  if (!q) {
    if (!gameOver) setGameOver(true);
    return null;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <ScoreBoard players={players} currentPlayer={currentPlayer} />
        <QuestionCard
          question={{ country: q.country, options: q.options, correct: q.correct }}
          onAnswer={handleAnswer}
          index={index + 1}
          total={null}
          currentPlayer={currentPlayer}
          players={players}
        />
      </div>
    </div>
  );
}

function mapRegionToContinent(region) {
  const map = {
    Africa: "Africa",
    Europe: "Europe",
    Asia: "Asia",
    Americas: "Americas",
    Oceania: "Oceania",
    // Antarctic and any unknown regions return null so they get filtered out
    // and never appear in the question pool
  };
  return map[region] ?? null;
}
