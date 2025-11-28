import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import MainMenu from './pages/MainMenu';
import SprintRace from './games/SprintRace';
import TargetPractice from './games/TargetPractice';
import ReactionTest from './games/ReactionTest';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [playerName, setPlayerName] = useState(
    localStorage.getItem('playerName') || ''
  );
  const [scores, setScores] = useState(
    JSON.parse(localStorage.getItem('scores') || '[]')
  );

  const saveScore = (game, score, playerName) => {
    const newScore = {
      id: Date.now(),
      game,
      score,
      playerName,
      timestamp: new Date().toISOString(),
    };

    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    localStorage.setItem('scores', JSON.stringify(updatedScores));
  };

  const setName = (name) => {
    setPlayerName(name);
    localStorage.setItem('playerName', name);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<MainMenu playerName={playerName} setPlayerName={setName} />}
          />
          <Route
            path="/sprint"
            element={<SprintRace playerName={playerName} saveScore={saveScore} />}
          />
          <Route
            path="/target"
            element={<TargetPractice playerName={playerName} saveScore={saveScore} />}
          />
          <Route
            path="/reaction"
            element={<ReactionTest playerName={playerName} saveScore={saveScore} />}
          />
          <Route path="/leaderboard" element={<Leaderboard scores={scores} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
