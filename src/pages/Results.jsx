import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import { db } from "../firebase/config";
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/useAuth";

export default function Results(){
  const loc = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { player1, player2, player1Score=0, player2Score=0 } = loc.state || {};
  const [leaderboard, setLeaderboard] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const safePlayer1 = player1 || "Player 1";
  const normalizedPlayer2 = player2 || "";
  const isTwoPlayerGame = !!normalizedPlayer2 && normalizedPlayer2.toLowerCase() !== "cpu";
  const safePlayer2 = isTwoPlayerGame ? normalizedPlayer2 : null;

  useEffect(()=> {
    const fetchTop = async () => {
      const q = query(collection(db, "leaderboard"), orderBy("totalScore","desc"), limit(5));
      const snap = await getDocs(q);
      setLeaderboard(snap.docs.map(d => d.data()));
    };
    fetchTop();
  }, []);

  const handleSaveResults = async () => {
    if (!user) {
      setSaveStatus('offline');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    if (!db) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        player1: safePlayer1,
        player1Score,
        totalScore: isTwoPlayerGame ? player1Score + player2Score : player1Score,
        timestamp: serverTimestamp(),
      };

      if (isTwoPlayerGame) {
        payload.player2 = safePlayer2;
        payload.player2Score = player2Score;
      } else {
        payload.player2 = null;
        payload.player2Score = null;
      }

      await addDoc(collection(db, "leaderboard"), payload);
      setSaveStatus('success');
      const q = query(collection(db, "leaderboard"), orderBy("totalScore","desc"), limit(5));
      const snap = await getDocs(q);
      setLeaderboard(snap.docs.map(d => d.data()));
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const primaryResultText = isTwoPlayerGame
    ? `${safePlayer1}: ${player1Score} — ${safePlayer2}: ${player2Score}`
    : `${safePlayer1}: ${player1Score}`;

  const handleDelayedLogin = (event) => {
    event.preventDefault();
    if (redirecting) return;
    setRedirecting(true);
    setTimeout(() => {
      setRedirecting(false);
      navigate("/login");
    }, 3000);
  };

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
          <h2 className="text-xl md:text-2xl mb-6 font-semibold
                        text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            {primaryResultText}
          </h2>

          <h3 className="text-lg font-semibold mb-3
                       text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            🏆 Top Games
          </h3>
          <ul className="mb-6">
            {leaderboard.map((g,i)=>{
              const dual = typeof g.player2 === "string" && g.player2.trim() && g.player2.trim().toLowerCase() !== "cpu";
              const opponentName = dual ? g.player2 : null;
              return (
                <li key={i} className={`p-3 mb-2 rounded-md text-sm md:text-base transition-colors duration-300 ${
                  i===0 
                    ? 'bg-yellow-300 dark:bg-yellow-600 text-[#425278] dark:text-[#1f2a44] font-semibold' 
                    : 'bg-gray-100 dark:bg-[#49546F] text-[#425278] dark:text-[#cbd6f0]'
                }`}>
                  {dual ? (
                    <>
                      {g.player1} ({g.player1Score}) vs {opponentName} ({g.player2Score})
                    </>
                  ) : (
                    <>
                      {g.player1} ({g.player1Score}) — Solo run
                    </>
                  )}{" "}
                  <strong>Total: {g.totalScore}</strong>
                </li>
              );
            })}
          </ul>

          {saveStatus && (
            <div className={`mb-4 p-3 rounded-md text-sm font-medium transition-colors duration-300 ${
              saveStatus === 'success' 
                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                : saveStatus === 'offline'
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
            }`}>
              {saveStatus === 'success' && '✓ Results saved to leaderboard!'}
              {saveStatus === 'offline' && 'Please log in to save your results to the leaderboard.'}
              {saveStatus === 'error' && 'Failed to save results. Please try again.'}
            </div>
          )}

          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <button 
              onClick={handleSaveResults}
              disabled={saving}
              className="px-4 md:px-6 py-2 rounded-md shadow font-semibold
                        bg-[#425278] hover:bg-[#3a4770] text-white
                        dark:bg-[#6b7aa8] dark:hover:bg-[#556294]
                        transition-colors duration-300 cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Results'}
            </button>
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
          <div className="mt-6 flex flex-col items-center gap-3 w-full">
            {redirecting && (
              <div className="text-xs text-[#425278] dark:text-[#cbd6f0] animate-pulse">
                Redirecting to login…
              </div>
            )}
            <div className="w-full flex justify-center overflow-hidden px-6">
              <Link
                to="/login"
                onClick={handleDelayedLogin}
                className="marquee-link text-[#425278] dark:text-[#aab6d6] text-sm transition-colors duration-600"
              >
                Want to join our leaderboard? Click here!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}