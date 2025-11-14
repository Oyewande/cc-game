
function QuestionCard({ question, onAnswer, index, total, currentPlayer, players }) {
  if (!question) return <div className="text-[#425278] dark:text-[#aab6d6]">Loading...</div>;
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-[#33405D] rounded-xl p-6 md:p-8 shadow-lg
                    transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium
                      text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
          Question {index}/{total}
        </div>
        <div className="text-sm
                      text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
          Turn: <span className="font-semibold">Player {currentPlayer + 1}</span>
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-bold mb-6
                    text-[#425278] dark:text-[#aab6d6] transition-colors duration-300">
        What is the capital of <span className="text-[#3a4770] dark:text-[#6b7aa8] text-2xl md:text-3xl">{question.country}</span>?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {question.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => onAnswer(opt)}
            className="py-3 px-4 rounded-lg cursor-pointer font-medium
                      bg-[#e0e4f1] hover:bg-[#425278] hover:text-white
                      dark:bg-[#49546F] dark:hover:bg-[#6b7aa8] dark:hover:text-white
                      text-[#425278] dark:text-[#cbd6f0]
                      transition-colors duration-300
                      active:scale-[0.98]"
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between text-sm
                    text-[#2d3a5b] dark:text-[#cbd6f0] transition-colors duration-300">
        <div className="font-medium">{players[0].name}: {players[0].score} <span className="text-yellow-500">★</span></div>
        <div className="font-medium">{players[1].name}: {players[1].score} <span className="text-yellow-500">★</span></div>
      </div>
    </div>
  );
}

export default QuestionCard;