import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import { db } from "../firebase/config";
import { auth } from "../firebase/config";
import { updateProfile } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import { saveScore } from "../firebase/saveScore";

export default function Results() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    player1,
    player2,
    player1Score = 0,
    player2Score = 0,
    mode,
    anonymous = false,
    difficulty,
    continent,
  } = loc.state || {};

  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const [pendingName, setPendingName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const needsDisplayName = user && !user.displayName?.trim();

  const safePlayer1 = player1 || "Player 1";
  const isTwoPlayerGame = !!player2 && player2.toLowerCase() !== "cpu";
  const medals = ["🥇", "🥈", "🥉"];

  useEffect(() => {
    // Never save for dual-player (pass-and-play) games or anonymous sessions
    if (mode === "dual") {
      setSaveStatus("dual-player");
      return;
    }
    if (anonymous) {
      setSaveStatus("anonymous");
      return;
    }
    if (!user) {
      setSaveStatus("not-authenticated");
      return;
    }
    if (needsDisplayName) {
      return;
    }
    async function autoSave() {
      const result = await saveScore(user, player1Score);
      if (result.saved) {
        setSaveStatus(result.newHighScore ? "new-high" : "saved");
      } else {
        setSaveStatus(result.reason);
      }
    }
    autoSave();
  }, [user, player1Score, needsDisplayName, mode, anonymous]);


  useEffect(() => {
    const fetchTop = async () => {
      try {
        const q = query(collection(db, "scores"), orderBy("highScore", "desc"), limit(10));
        const snap = await getDocs(q);
        setLeaderboard(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Leaderboard fetch failed:", err);
      } finally {
        setLeaderboardLoading(false);
      }
    };
    fetchTop();
  }, [saveStatus]);

  const handleSetName = async () => {
    const trimmed = pendingName.trim();
    if (!trimmed) {
      setNameError("Please enter a display name.");
      return;
    }
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }
    setNameSaving(true);
    setNameError("");
    try {
  
      await updateProfile(auth.currentUser, { displayName: trimmed });

      const updatedUser = { ...user, displayName: trimmed };
      const result = await saveScore(updatedUser, player1Score);
      if (result.saved) {
        setSaveStatus(result.newHighScore ? "new-high" : "saved");
      } else {
        setSaveStatus(result.reason);
      }
    } catch (err) {
      console.error("Set name failed:", err);
      setNameError("Failed to save name. Try again.");
    } finally {
      setNameSaving(false);
    }
  };

  const handleRematch = () => {
    navigate("/game", {
      state: {
        mode: mode || "single",
        anonymous: anonymous || false,
        difficulty: difficulty || "all",
        continent: continent || "All",
        player1: safePlayer1,
        player2: isTwoPlayerGame ? player2 : "CPU",
      },
    });
  };

  const handleShare = () => {
    const text = isTwoPlayerGame
      ? `🌍 Capitals Quest — ${safePlayer1}: ${player1Score} vs ${player2}: ${player2Score}`
      : `🌍 Capitals Quest — I scored ${player1Score} points!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative
                    bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-md">

          <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-2xl shadow-xl
                          border border-slate-200/60 dark:border-slate-700/60 text-center mb-4">
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="text-2xl font-bold mb-1 text-slate-800 dark:text-white">
              Final Results
            </h1>

            {user && needsDisplayName && saveStatus !== "new-high" && saveStatus !== "saved" && (
              <div className="mt-3 mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20
                             border border-amber-200 dark:border-amber-800 text-left">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Set a display name to appear on the leaderboard
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pendingName}
                    onChange={(e) => setPendingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSetName()}
                    placeholder="Your display name"
                    maxLength={24}
                    className="flex-1 px-3 py-2 rounded-lg text-xs
                              bg-white dark:bg-slate-800
                              text-slate-800 dark:text-slate-200
                              placeholder:text-slate-400 dark:placeholder:text-slate-500
                              border border-amber-300 dark:border-amber-700
                              focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <button
                    onClick={handleSetName}
                    disabled={nameSaving}
                    className="px-3 py-2 rounded-lg text-xs font-semibold
                              bg-amber-500 hover:bg-amber-600 text-white
                              transition-all cursor-pointer disabled:opacity-50"
                  >
                    {nameSaving ? "..." : "Save"}
                  </button>
                </div>
                {nameError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{nameError}</p>
                )}
              </div>
            )}

            {saveStatus && !needsDisplayName && (
              <div className={`mt-3 mb-3 py-2 px-3 rounded-lg text-xs font-medium ${
                saveStatus === "new-high"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : saveStatus === "saved"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  : saveStatus === "not-authenticated"
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  : saveStatus === "dual-player" || saveStatus === "anonymous"
                  ? "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}>
                {saveStatus === "new-high" && "🎉 New high score saved!"}
                {saveStatus === "saved" && "Score saved to leaderboard."}
                {saveStatus === "dual-player" && "Pass & Play scores aren't tracked on the leaderboard."}
                {saveStatus === "anonymous" && "Playing as Anonymous — scores aren't tracked."}
                {saveStatus === "not-authenticated" && (
                  <>
                    Log in to join the leaderboard.{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="underline font-semibold cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                )}
                {saveStatus === "permission-denied" && "Could not save — please sign in again."}
                {saveStatus === "error" && "Failed to save. Please try again."}
              </div>
            )}

            {saveStatus && needsDisplayName === false && (saveStatus === "new-high" || saveStatus === "saved") && (
              <div className="mt-3 mb-3 py-2 px-3 rounded-lg text-xs font-medium
                             bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400
                             border border-emerald-200 dark:border-emerald-800">
                {saveStatus === "new-high" ? "🎉 New high score saved!" : "Score saved to leaderboard."}
              </div>
            )}

            <div className="flex gap-4 justify-center mt-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-6 py-4 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">{safePlayer1}</div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{player1Score}</div>
              </div>
              {isTwoPlayerGame && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-6 py-4 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">{player2}</div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{player2Score}</div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={handleRematch}
                className="px-5 py-2.5 rounded-xl shadow font-semibold text-sm
                          bg-emerald-600 hover:bg-emerald-700 text-white
                          transition-all duration-300 cursor-pointer"
              >
                Rematch
              </button>
              <button
                onClick={() => navigate("/start")}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm
                          bg-slate-800 hover:bg-slate-900 text-white
                          dark:bg-slate-700 dark:hover:bg-slate-600
                          transition-all duration-300 cursor-pointer"
              >
                New Game
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl border font-semibold text-sm
                          bg-white dark:bg-slate-800
                          text-slate-700 dark:text-slate-200
                          border-slate-200 dark:border-slate-600
                          hover:bg-slate-50 dark:hover:bg-slate-700
                          transition-all duration-300 cursor-pointer"
              >
                {copied ? "✓ Copied!" : "📋 Share"}
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2.5 rounded-xl border font-semibold text-sm
                          bg-white dark:bg-slate-800
                          text-slate-700 dark:text-slate-200
                          border-slate-200 dark:border-slate-600
                          hover:bg-slate-50 dark:hover:bg-slate-700
                          transition-all duration-300 cursor-pointer"
              >
                Home
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-xl
                          border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="text-sm font-bold mb-3 text-slate-800 dark:text-white">
              🏆 Leaderboard
            </h3>
            {leaderboardLoading ? (
              <div className="text-center py-4">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-4 text-sm text-slate-400 dark:text-slate-500">
                No scores yet. Be the first!
              </div>
            ) : (
              <ul className="space-y-1.5">
                {leaderboard.map((entry, i) => (
                  <li
                    key={entry.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-300 ${
                      entry.id === user?.uid
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                        : i < 3
                        ? "bg-slate-50 dark:bg-slate-800"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base w-6 text-center">
                        {i < 3
                          ? medals[i]
                          : <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">#{i + 1}</span>
                        }
                      </span>
                      <span className={`font-medium ${
                        entry.id === user?.uid
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-slate-700 dark:text-slate-200"
                      }`}>
                        {entry.displayName || entry.email?.split("@")[0] || "Anonymous"}
                        {entry.id === user?.uid && (
                          <span className="text-xs ml-1 opacity-60">(you)</span>
                        )}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {entry.highScore}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
