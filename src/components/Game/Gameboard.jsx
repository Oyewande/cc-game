import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GameBoard() {
  const { state } = useLocation();
  const { mode, player1 = "Player 1", player2 = "Player 2" } = state || {};
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [turn, setTurn] = useState(1);
  const [lives, setLives] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        const formatted = data
          .filter((c) => c && c.capital && c.capital.length > 0 && c.name && c.name.common)
          .map((c) => ({
            country: c.name.common,
            capital: c.capital[0],
          }));
        setQuestions(formatted.sort(() => 0.5 - Math.random()).slice(0, 10));
      } catch (error) {
        console.error("API failed, using offline data", error);
        try {
          const offlineModule = await import("../../data/countriesOffline.js");
          const offlineData =
            offlineModule.default ||
            offlineModule.countries ||
            offlineModule.countriesOffline ||
            offlineModule;
          const formatted = (offlineData || [])
            .filter((c) => c && (c.capital || (Array.isArray(c.capital) && c.capital.length > 0)))
            .map((c) => ({
              country: c.country || (c.name && (typeof c.name === "string" ? c.name : c.name.common)) || "Unknown",
              capital: Array.isArray(c.capital) ? c.capital[0] : c.capital,
            }));
          setQuestions(formatted.sort(() => 0.5 - Math.random()).slice(0, 10));
        } catch (err) {
          console.error("Failed to load offline data", err);
          setQuestions([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAnswer = (choice, correct) => {
    const isCorrect = choice === correct;
    let nextScore1 = score1;
    let nextScore2 = score2;
    let nextLives = lives;
    let nextTurn = turn;

    if (mode === "single") {
      if (isCorrect) nextScore1 += 1;
      else nextLives -= 1;
    } else {
      if (turn === 1) {
        if (isCorrect) nextScore1 += 1;
        nextTurn = 2;
      } else {
        if (isCorrect) nextScore2 += 1;
        nextTurn = 1;
      }
    }

    setScore1(nextScore1);
    setScore2(nextScore2);
    setLives(nextLives);
    setTurn(nextTurn);

    const isGameOver = (mode === "single" && nextLives <= 0) || current >= 9;
    if (isGameOver) {
      navigate("/scoreboard", {
        state: { mode, player1, player2, score1: nextScore1, score2: nextScore2 },
      });
      return;
    }

    setCurrent((c) => c + 1);
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (!questions || questions.length === 0)
    return <div className="text-center text-white">No questions available.</div>;

  const q = questions[current];
  if (!q) return <div className="text-center text-white">No more questions.</div>;

  
  const otherCapitals = questions.map((c) => c.capital).filter((cap) => cap !== q.capital);
  const sampled = [...otherCapitals].sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [...sampled, q.capital].sort(() => 0.5 - Math.random());

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">
        {mode === "single" ? `${player1}'s Game` : `Turn: ${turn === 1 ? player1 : player2}`}
      </h2>
      <p className="mb-2">Question {current + 1} / 10</p>
      {mode === "single" && <p className="mb-2">❤️ Lives: {lives}</p>}

      <div className="bg-gray-200 p-6 rounded-lg shadow-lg text-center mb-6 w-96">
        <p className="text-lg font-semibold mb-4">
          What is the capital of <span className="text-yellow-400">{q.country}</span>?
        </p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt, q.capital)}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 text-lg">
        <p>
          {player1}: {score1}
        </p>
        {mode === "dual" && (
          <p>
            {player2}: {score2}
          </p>
        )}
      </div>
    </div>
  );
}