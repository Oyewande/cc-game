import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GameBoard() {
  const { state } = useLocation();
  const { mode, player1, player2 } = state || {};
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
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      const formatted = data
        .filter((c) => c.capital && c.capital.length > 0)
        .map((c) => ({
          country: c.name.common,
          capital: c.capital[0],
        }));
      setQuestions(formatted.sort(() => 0.5 - Math.random()).slice(0, 10));
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAnswer = (choice, correct) => {
    const isCorrect = choice === correct;

    if (mode === "single") {
      if (isCorrect) setScore1((s) => s + 1);
      else setLives((l) => l - 1);
    } else {
      if (turn === 1) {
        if (isCorrect) setScore1((s) => s + 1);
        setTurn(2);
      } else {
        if (isCorrect) setScore2((s) => s + 1);
        setTurn(1);
      }
    }

    if ((mode === "single" && lives - (isCorrect ? 0 : 1) <= 0) || current >= 9) {
      navigate("/scoreboard", {
        state: { mode, player1, player2, score1, score2 },
      });
    } else {
      setCurrent((c) => c + 1);
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  const q = questions[current];
  const options = [...questions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((c) => c.capital);
  if (!options.includes(q.capital)) options[0] = q.capital;
  options.sort(() => 0.5 - Math.random());

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">
        {mode === "single"
          ? `${player1}'s Game`
          : `Turn: ${turn === 1 ? player1 : player2}`}
      </h2>
      <p className="mb-2">Question {current + 1} / 10</p>
      {mode === "single" && <p className="mb-2">❤️ Lives: {lives}</p>}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center mb-6 w-96">
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
        <p>{player1}: {score1}</p>
        {mode === "dual" && <p>{player2}: {score2}</p>}
      </div>
    </div>
  );
}