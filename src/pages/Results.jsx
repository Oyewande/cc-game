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
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-[#e0e4f1] dark:bg-[#1f2a44] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-md bg-white dark:bg-[#33405D] p-6 md:p-8 rounded-xl shadow-lg text-center
                        transition-colors duration-300">
          <h1 className="text-2xl md:text-3xl font-bold mb-4
                        text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            Results
          </h1>
          <p className="mb-2 text-[#2d3a5b] dark:text-[#cbd6f0] transition-colors duration-300">
            {player1}: {player1Score} — {player2}: {player2Score}
          </p>
          <h2 className="text-xl md:text-2xl mb-6 font-semibold
                        text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            {winnerText}
          </h2>

          <h3 className="text-lg font-semibold mb-3
                       text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            🏆 Top Games
          </h3>
          <ul className="mb-6">
            {leaderboard.map((g,i)=>(
              <li key={i} className={`p-3 mb-2 rounded-md text-sm md:text-base transition-colors duration-300 ${
                i===0 
                  ? 'bg-yellow-300 dark:bg-yellow-600 text-[#425278] dark:text-[#1f2a44] font-semibold' 
                  : 'bg-gray-100 dark:bg-[#49546F] text-[#425278] dark:text-[#cbd6f0]'
              }`}>
                #{i+1} — {g.player1} ({g.player1Score}) vs {g.player2} ({g.player2Score}) <strong>Total: {g.totalScore}</strong>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3 justify-center">
            <button 
              onClick={()=>navigate("/start")} 
              className="px-4 md:px-6 py-2 rounded-md shadow font-semibold
                        bg-[#425278] hover:bg-[#3a4770] text-white
                        dark:bg-[#6b7aa8] dark:hover:bg-[#556294]
                        transition-colors duration-300 cursor-pointer"
            >
              Play Again
            </button>
            <button 
              onClick={()=>navigate("/")} 
              className="px-4 py-2 rounded-md border font-semibold
                        bg-white dark:bg-[#49546F]
                        text-[#425278] dark:text-[#cbd6f0]
                        border-[#425278]/30 dark:border-[#6b7aa8]/50
                        hover:bg-gray-100 dark:hover:bg-[#556294]
                        transition-colors duration-300 cursor-pointer"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}