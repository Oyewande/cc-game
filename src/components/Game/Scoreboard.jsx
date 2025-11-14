export default function ScoreBoard({ players, currentPlayer }) {
  return (
    <div className="flex gap-4 justify-center mb-6">
      {players.map((p, i) => (
        <div 
          key={i} 
          className={`p-4 rounded-xl w-44 text-center transition-all duration-300 ${
            currentPlayer === i 
              ? 'ring-2 ring-[#425278] dark:ring-[#6b7aa8] bg-white dark:bg-[#33405D] shadow-md' 
              : 'bg-white/80 dark:bg-[#33405D]/80'
          }`}
        >
          <div className="font-semibold
                          text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            {p.name}
          </div>
          <div className="mt-2 text-xl font-bold
                        text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
            {p.score} <span className="text-yellow-500">★</span>
          </div>
          <div className="text-sm mt-1
                        text-red-500 dark:text-red-400 transition-colors duration-300">
            Mistakes: {p.mistakes}/3
          </div>
        </div>
      ))}
    </div>
  );
}