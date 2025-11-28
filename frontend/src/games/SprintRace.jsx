import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SprintRace.css';

function SprintRace({ playerName, saveScore }) {
  const [gameState, setGameState] = useState('ready'); // ready, running, finished
  const [distance, setDistance] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = setInterval(() => {
        setTime((t) => t + 0.01);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (distance >= 100 && gameState === 'running') {
      setGameState('finished');
      const finalT = time;
      setFinalTime(finalT);
      saveScore('Sprint Race', finalT.toFixed(2), playerName);
    }
  }, [distance, gameState, time, playerName, saveScore]);

  const startGame = () => {
    setGameState('running');
    setDistance(0);
    setClicks(0);
    setTime(0);
    setFinalTime(null);
  };

  const handleClick = () => {
    if (gameState === 'running') {
      setClicks((c) => c + 1);
      setDistance((d) => Math.min(d + 2, 100));
    }
  };

  const runnerPosition = distance;

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Menu
      </button>

      <div className="game-header">
        <h1 className="game-title">🏃 100m Sprint</h1>
        <p className="game-subtitle">Click as fast as you can to run!</p>
      </div>

      <div className="game-card">
        {gameState === 'ready' && (
          <div className="ready-screen">
            <h2>Ready to Sprint?</h2>
            <p>Click the RUN button as fast as possible to reach 100m!</p>
            <button className="btn btn-gold btn-large" onClick={startGame}>
              START RACE
            </button>
          </div>
        )}

        {gameState === 'running' && (
          <>
            <div className="stats-row">
              <div className="stat">
                <div className="stat-label">Distance</div>
                <div className="stat-value">{distance.toFixed(1)}m</div>
              </div>
              <div className="stat">
                <div className="stat-label">Time</div>
                <div className="stat-value">{time.toFixed(2)}s</div>
              </div>
              <div className="stat">
                <div className="stat-label">Clicks</div>
                <div className="stat-value">{clicks}</div>
              </div>
            </div>

            <div className="track">
              <div className="runner" style={{ left: `${runnerPosition}%` }}>
                🏃
              </div>
              <div className="finish-line">🏁</div>
            </div>

            <button
              className="btn btn-success btn-large click-btn"
              onClick={handleClick}
            >
              RUN! 🏃
            </button>
          </>
        )}

        {gameState === 'finished' && (
          <div className="finished-screen">
            <h2>🎉 Race Complete!</h2>
            <div className="final-score">
              <div className="score-label">Your Time:</div>
              <div className="score-display">{finalTime}s</div>
            </div>
            <div className="score-details">
              <p>Distance: 100m</p>
              <p>Total Clicks: {clicks}</p>
              <p>Average Speed: {(100 / finalTime).toFixed(2)} m/s</p>
            </div>
            <div className="button-row">
              <button className="btn btn-primary" onClick={startGame}>
                Race Again
              </button>
              <button className="btn btn-gold" onClick={() => navigate('/leaderboard')}>
                View Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SprintRace;
