import { useState, useEffect, useCallback, useRef } from "react";

const LABELS = ["A", "B", "C", "D"];
const TIMER_SECONDS = 15;

function QuestionCard({ question, onAnswer, index, total, currentPlayer, players }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  // Keep a stable ref to onAnswer so timer effects never need it as a dependency.
  // This prevents the cleanup from cancelling the setTimeout when handleAnswer
  // gets a new reference (due to its own useCallback deps changing in Game.jsx).
  const onAnswerRef = useRef(onAnswer);
  useEffect(() => {
    onAnswerRef.current = onAnswer;
  }, [onAnswer]);

  // Reset state when question changes
  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setTimeLeft(TIMER_SECONDS);
  }, [index]);

  // Effect A: countdown tick — only runs while time is actively counting down
  useEffect(() => {
    if (showResult || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [showResult, timeLeft]);

  // Effect B: timeout handler — fires when timeLeft hits 0.
  // showResult is intentionally NOT in the dependency array.
  // If it were, React would run the cleanup (clearTimeout) the moment
  // setShowResult(true) triggers a re-render, killing the timer before it fires.
  // With timeLeft as the only dep, cleanup only runs when the question changes
  // (index reset → timeLeft resets to 15), by which time the timer has already fired.
  useEffect(() => {
    if (timeLeft > 0) return;
    setSelected("__timeout__");
    setShowResult(true);
    const timer = setTimeout(() => {
      onAnswerRef.current(null);
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]); // showResult intentionally omitted — see comment above

  const handleSelect = useCallback((opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    const timer = setTimeout(() => {
      onAnswerRef.current(opt);
    }, 1200);
    return () => clearTimeout(timer);
  }, [showResult]); // onAnswer intentionally omitted — use ref instead

  if (!question) {
    return (
      <div className="text-slate-600 dark:text-slate-300 text-center py-12">Loading...</div>
    );
  }

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 10 ? "bg-emerald-500" : timeLeft > 5 ? "bg-amber-500" : "bg-red-500";
  // Only show a progress bar in offline (finite) mode
  const isUnlimited = total === null;
  const progressPercent = isUnlimited ? 0 : ((index - 1) / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress / question counter */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isUnlimited ? `Question ${index}` : `Question ${index} of ${total}`}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {players[currentPlayer]?.name}'s turn
          </span>
        </div>
        {/* Only render the progress bar in offline finite mode */}
        {!isUnlimited && (
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 md:p-8 shadow-lg
                      border border-slate-200/60 dark:border-slate-700/60 transition-colors duration-300">
        {/* Timer bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full
            ${timeLeft > 10 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : timeLeft > 5 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
            {timeLeft}s
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-6 text-slate-700 dark:text-slate-200">
          What is the capital of{" "}
          <span className="text-emerald-600 dark:text-emerald-400 text-xl md:text-2xl">
            {question.country}
          </span>
          ?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt, i) => {
            let btnClass = `relative py-3.5 px-4 rounded-xl cursor-pointer font-medium text-sm
                           border-2 transition-all duration-300 active:scale-[0.97] text-left`;

            if (showResult) {
              if (opt === question.correct) {
                btnClass += " border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-500";
              } else if (opt === selected && opt !== question.correct) {
                btnClass += " border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500 shake";
              } else {
                btnClass += " border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-50";
              }
              btnClass += " cursor-default";
            } else {
              btnClass += ` border-slate-200 dark:border-slate-600
                           bg-white dark:bg-slate-800
                           text-slate-700 dark:text-slate-200
                           hover:border-emerald-400 hover:bg-emerald-50 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20`;
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={showResult}
                className={btnClass}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg
                               bg-slate-100 dark:bg-slate-700 text-xs font-bold mr-3
                               text-slate-500 dark:text-slate-400">
                  {LABELS[i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Timeout feedback */}
        {showResult && selected === "__timeout__" && (
          <div className="mt-4 text-center text-sm font-medium text-amber-600 dark:text-amber-400">
            Time's up! The answer was <span className="font-bold">{question.correct}</span>
          </div>
        )}

        {/* Score strip at bottom */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700
                       flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="font-medium">
            {players[0]?.name}: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{players[0]?.score}</span>
          </div>
          {players[1] && players[1].name?.toLowerCase() !== "cpu" && (
            <div className="font-medium">
              {players[1]?.name}: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{players[1]?.score}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
