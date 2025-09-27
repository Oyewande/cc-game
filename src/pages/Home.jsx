import { Link } from "react-router-dom";
import Navbar from "../components/UI/Navbar";

function Home(){
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <h1 className="text-4xl font-bold mb-4 text-center">🌍 Country & Capitals Challenge</h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300 max-w-xl">Choose single or two-player mode and whether to play online (live API) or offline (local bundle).</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/start?mode=single" className="px-8 py-3 bg-indigo-600 text-white rounded shadow">▶ Single Player</Link>
          <Link to="/start?mode=dual" className="px-8 py-3 bg-blue-500 text-white rounded shadow">👥 Two Players</Link>
        </div>
        <Link to="/results" className="mt-6 text-sm text-green-700 underline">View Leaderboard / Results</Link>
      </div>
    </>
  );
}
export default Home;