import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StartGame from "./pages/StartGame";
import Game from "./pages/Game";
import Results from "./pages/Results";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/start" element={<StartGame />} />
        <Route
          path="/game"
          element={
            <ProtectedRoute guestAllowed>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute guestAllowed>
              <Results />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
