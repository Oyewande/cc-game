export default function ScoreBoard({ players = [], currentPlayer = 0 }) {
  const normalizedPlayers = (players.length ? players : [{ name: "Player 1", score: 0, mistakes: 0 }])
    .map((player, index) => ({ player, originalIndex: index }));

  const filtered = normalizedPlayers.filter(({ player, originalIndex }) => {
    if (originalIndex === 0) return true;
    const name = player?.name?.trim()?.toLowerCase();
    return !!name && name !== "cpu";
  });

  const visiblePlayers =
    filtered.length > 1 ? filtered : filtered.slice(0, 1);

  return (
    <div className="flex gap-4 justify-center mb-6 flex-wrap">
      {visiblePlayers.map(({ player, originalIndex }) => (
        <div
          key={originalIndex}
          className={`p-4 rounded-xl w-44 text-center transition-all duration-300 ${
            currentPlayer === originalIndex
              ? 'ring-2 ring-[#425278] dark:ring-[#6b7aa8] bg-white dark:bg-[#33405D] shadow-md'
              : 'bg-white/80 dark:bg-[#33405D]/80'
          }`}
        >
          <div className="font-semibold
                          text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            {player?.name}
          </div>
          <div className="mt-2 text-xl font-bold
                        text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            {player?.score ?? 0} <span className="text-yellow-500">★</span>
          </div>
          <div className="text-sm mt-1
                        text-red-500 dark:text-red-400 transition-colors duration-300">
            Mistakes: {player?.mistakes ?? 0}/3
          </div>
        </div>
      ))}
    </div>
  );
}