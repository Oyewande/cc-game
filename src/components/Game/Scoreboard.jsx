export default function ScoreBoard({ players, currentPlayer }) {
  return (
    <div className="flex gap-4 justify-center mb-4">
      {players.map((p, i) => (
        <div key={i} className={`p-3 rounded-lg w-44 text-center ${currentPlayer===i ? 'ring-2 ring-indigo-400' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <div className="font-semibold">{p.name}</div>
          <div className="mt-2 text-lg font-bold">{p.score} <span className="text-yellow-500">★</span></div>
          <div className="text-sm text-red-500 mt-1">Mistakes: {p.mistakes}/3</div>
        </div>
      ))}
    </div>
  );
}