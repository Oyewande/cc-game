import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function Leaderboard(){
  const [games, setGames] = useState([]);
  useEffect(()=>{
    const q = query(collection(db, "leaderboard"), orderBy("totalScore","desc"), limit(5));
    const unsub = onSnapshot(q, snap => {
      setGames(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return ()=>unsub();
  }, []);
  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-3">🏆 Top Games</h3>
      <ul className="space-y-2">
        {games.map((g,i)=>(
          <li key={g.id} className={`flex justify-between p-2 rounded ${i===0 ? 'bg-yellow-300 dark:bg-yellow-600 font-semibold' : 'bg-gray-50 dark:bg-gray-700'}`}>
            <div>#{i+1} — {g.player1} ({g.player1Score}) vs {g.player2} ({g.player2Score})</div>
            <div>Total: {g.totalScore}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}