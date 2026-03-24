export default function ScoreBoard({ players = [], currentPlayer = 0 }) {
  const normalizedPlayers = (players.length ? players : [{ name: "Player 1", score: 0, mistakes: 0 }])
    .map((player, index) => ({ player, originalIndex: index }));

  const filtered = normalizedPlayers.filter(({ player, originalIndex }) => {
    if (originalIndex === 0) return true;
    const name = player?.name?.trim()?.toLowerCase();
    return !!name && name !== "cpu";
  });

  const visiblePlayers = filtered.length > 1 ? filtered : filtered.slice(0, 1);

  return (
    <div className="flex gap-3 justify-center mb-6 flex-wrap">
      {visiblePlayers.map(({ player, originalIndex }) => (
        <div
          key={originalIndex}
          className={`px-5 py-3 rounded-xl text-center transition-all duration-300 min-w-[10rem] ${
            currentPlayer === originalIndex
              ? "ring-2 ring-emerald-500 dark:ring-emerald-400 bg-white dark:bg-[#1e293b] shadow-lg shadow-emerald-500/10"
              : "bg-white/80 dark:bg-[#1e293b]/80 border border-slate-200/60 dark:border-slate-700/60"
          }`}
        >
          <div className="font-semibold text-sm text-slate-700 dark:text-slate-200">
            {player?.name}
          </div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-600 dark:text-emerald-400 score-bounce">
            {player?.score ?? 0}
          </div>
          <div className="text-xs mt-1 flex items-center justify-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`inline-block w-2 h-2 rounded-full transition-colors duration-300 ${
                  i < (player?.mistakes ?? 0) ? "bg-red-500" : "bg-slate-200 dark:bg-slate-600"
                }`}
              />
            ))}
            <span className="ml-1 text-slate-400 dark:text-slate-500">
              {player?.mistakes ?? 0}/3
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
