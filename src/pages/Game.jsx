import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import QuestionCard from "../components/Game/QuestionCard";
import ScoreBoard from "../components/Game/Scoreboard";
import { OFFLINE_COUNTRIES } from "../data/countriesOffline";
import { db } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Game(){
  const loc = useLocation();
  const navigate = useNavigate();
  const { mode="single", online=true, player1="Player 1", player2="Player 2" } = loc.state || {};
  const twoPlayer = mode === "dual";

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [players, setPlayers] = useState([{ name: player1, score: 0, mistakes: 0 }, { name: player2, score: 0, mistakes: 0 }]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(()=>{
    async function load(){
      let pool = [];
      if (online) {
        try {
          const res = await fetch("https://restcountries.com/v3.1/all?fields=name,capital");
          const data = await res.json();
          pool = data.filter(c=>c.capital && c.capital.length>0).map(c=>({ country: c.name.common, capital: c.capital[0] }));
        } catch (e) {
          console.error("API fetch failed, switching to offline", e);
          pool = OFFLINE_COUNTRIES;
        }
      } else {
        pool = OFFLINE_COUNTRIES;
      }
      // create question list
      const shuffled = pool.sort(()=>Math.random()-0.5).slice(0,20);
      const prepared = shuffled.map(q=>{
        const wrong = [];
        while(wrong.length<3){
          const r = pool[Math.floor(Math.random()*pool.length)].capital;
          if(r !== q.capital && !wrong.includes(r)) wrong.push(r);
        }
        return { country: q.country, correct: q.capital, options: [...wrong, q.capital].sort(()=>Math.random()-0.5) };
      });
      setQuestions(prepared);
    }
    load();
  }, [online]);

  const handleAnswer = (opt) => {
    const q = questions[index];
    if (!q) return;
    setPlayers(prev=>{
      const copy = JSON.parse(JSON.stringify(prev));
      if (opt === q.correct) copy[currentPlayer].score += 1;
      else {
        copy[currentPlayer].mistakes += 1;
        if(copy[currentPlayer].mistakes >= 3) setGameOver(true);
      }
      return copy;
    });
    setIndex(i=>i+1);
    if (twoPlayer) setCurrentPlayer(p=> (p===0?1:0));
    if (index+1 >= questions.length) setGameOver(true);
  };

  const endAndSave = async () => {
    const p1s = players[0].score, p2s = players[1].score;
    try {
      await addDoc(collection(db, "leaderboard"), {
        player1: players[0].name,
        player2: players[1].name,
        player1Score: p1s,
        player2Score: p2s,
        totalScore: p1s + p2s,
        timestamp: serverTimestamp(),
      });
    } catch(err){ console.error("Save failed:", err); }
    navigate("/results", { state: { player1: players[0].name, player2: players[1].name, player1Score: p1s, player2Score: p2s } });
  };

  if (!questions.length) return (<><Navbar /><div className="p-6 text-center">Loading questions…</div></>);

  if (gameOver) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over</h2>
            <p className="mb-4">{players[0].name}: {players[0].score} — {players[1].name}: {players[1].score}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={endAndSave} className="px-6 py-2 bg-green-800 text-white rounded">Save & Results</button>
              <button onClick={()=>window.location.reload()} className="px-4 py-2 border rounded">Restart</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const q = questions[index];

  return (
    <>
      <Navbar />
      <div className="p-6">
        <ScoreBoard players={players} currentPlayer={currentPlayer} />
        <QuestionCard question={{ country: q.country, options: q.options, correct: q.correct }} onAnswer={handleAnswer} index={index+1} total={questions.length} currentPlayer={currentPlayer} players={players} />
      </div>
    </>
  );
}