
function QuestionCard({ question, onAnswer, index, total, currentPlayer, players }) {
  if (!question) return <div>Loading...</div>;
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">Question {index}/{total}</div>
        <div className="text-sm">Turn: <span className="font-semibold">Player {currentPlayer + 1}</span></div>
      </div>

      <h3 className="text-xl font-bold mb-6 dark:text-white">What is the capital of <span className="text-indigo-600 dark:text-indigo-300">{question.country}</span>?</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => onAnswer(opt)}
            className="py-3 px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition">
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <div>{players[0].name}: {players[0].score} ★</div>
        <div>{players[1].name}: {players[1].score} ★</div>
      </div>
    </div>
  );
}

export default QuestionCard;