import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import { db } from "../firebase/config";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function Results(){
  const loc = useLocation();
  const navigate = useNavigate();
  const { player1, player2, player1Score=0, player2Score=0 } = loc.state || {};
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(()=> {
    const fetchTop = async () => {
      const q = query(collection(db, "leaderboard"), orderBy("totalScore","desc"), limit(5));
      const snap = await getDocs(q);
      setLeaderboard(snap.docs.map(d => d.data()));
    };
    fetchTop();
  }, []);

  let winnerText = "It's a tie!";
  if (player1Score > player2Score) winnerText = `${player1} wins!`;
  else if (player2Score > player1Score) winnerText = `${player2} wins!`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 flex flex-col items-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-2">Results</h1>
          <p className="mb-2">{player1}: {player1Score} — {player2}: {player2Score}</p>
          <h2 className="text-xl mb-4">{winnerText}</h2>

          <h3 className="text-lg font-semibold mb-2">🏆 Top Games</h3>
          <ul>
            {leaderboard.map((g,i)=>(
              <li key={i} className={`p-2 mb-2 rounded ${i===0 ? 'bg-yellow-300 dark:bg-yellow-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
                #{i+1} — {g.player1} ({g.player1Score}) vs {g.player2} ({g.player2Score}) <strong>Total: {g.totalScore}</strong>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-3 justify-center">
            <button onClick={()=>navigate("/start")} className="px-4 py-2 bg-green-600 text-white rounded">Play Again</button>
            <button onClick={()=>navigate("/")} className="px-4 py-2 border rounded">Home</button>
          </div>
        </div>
      </div>
    </>
  );
}